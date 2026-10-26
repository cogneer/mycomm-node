import { WebhookSignatureError } from './core/errors.js';
import { EVENT_TYPES, type WebhookEvent, type WebhookEventBase } from './generated/events.js';

/** The raw body of a webhook request, exactly as received: a string, a `Buffer` or other bytes. */
export type WebhookPayload = string | ArrayBuffer | ArrayBufferView;

/**
 * An event whose type this SDK version does not know. Read `data` as it is, or ignore the event and answer 2xx: the API
 * adds event types without a new version.
 */
export interface UnknownEvent extends WebhookEventBase {
  data: unknown;
}

export interface VerifyOptions {
  /** Seconds a signature stays acceptable, which stops replays of a captured request. 300 by default. */
  tolerance?: number;
  /** Unix time (seconds) to compare the signature's timestamp with; the current time by default. */
  now?: number;
}

const known = new Set<string>(EVENT_TYPES);
const encoder = new TextEncoder();

/**
 * Verifies and reads the webhooks MyComm sends.
 *
 *     const event = await Webhook.constructEvent(rawBody, req.headers['mycomm-signature'], secret);
 *     if (Webhook.isKnown(event)) {
 *       switch (event.type) {
 *         case 'message.delivered': ...
 *       }
 *     }
 *
 * Always pass the raw request body, exactly as received (`express.raw({ type: 'application/json' })`, `await
 * request.text()`): a re-encoded body no longer matches its signature. Uses Web Crypto, so it runs on Node.js, Bun, Deno
 * and edge runtimes alike.
 */
export class Webhook {
  static readonly SIGNATURE_HEADER = 'MyComm-Signature';
  static readonly DEFAULT_TOLERANCE = 300;

  private constructor() {}

  /**
   * Verifies the signature and returns the event. `secret` is the endpoint's signing secret, or several while you roll
   * over to a new one. Throws `WebhookSignatureError` when the request must be rejected (answer 400).
   */
  static async constructEvent(
    payload: WebhookPayload,
    signature: string | string[] | null | undefined,
    secret: string | string[],
    options: VerifyOptions = {},
  ): Promise<WebhookEvent | UnknownEvent> {
    await Webhook.verify(payload, signature, secret, options);
    return Webhook.parse(payload);
  }

  /** Throws `WebhookSignatureError` unless the signature is fresh and made with one of the secrets. */
  static async verify(
    payload: WebhookPayload,
    signature: string | string[] | null | undefined,
    secret: string | string[],
    options: VerifyOptions = {},
  ): Promise<void> {
    const header = Array.isArray(signature) ? signature.join(',') : (signature ?? '');
    let timestamp: number | null = null;
    const signatures: string[] = [];
    for (const part of header.split(',')) {
      const [key, value = ''] = part.trim().split('=', 2) as [string, string?];
      if (key === 't' && /^\d+$/.test(value)) {
        timestamp = Number(value);
      } else if (key === 'v1' && value !== '') {
        signatures.push(value);
      }
    }

    if (timestamp === null || signatures.length === 0) {
      throw new WebhookSignatureError('The MyComm-Signature header is missing or malformed.');
    }
    const now = options.now ?? Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > (options.tolerance ?? Webhook.DEFAULT_TOLERANCE)) {
      throw new WebhookSignatureError('The webhook timestamp is outside the tolerance.');
    }

    // During a secret rotation the header carries one signature per secret: any match is enough.
    const signed = concat(encoder.encode(`${timestamp}.`), bytes(payload));
    for (const candidate of Array.isArray(secret) ? secret : [secret]) {
      const expected = await hmac(candidate, signed);
      if (signatures.some((given) => equal(expected, given.toLowerCase()))) {
        return;
      }
    }

    throw new WebhookSignatureError('No signature of the webhook matches the secret.');
  }

  /** Reads an event without checking its signature. Only for a body that was verified already. */
  static parse(payload: WebhookPayload): WebhookEvent | UnknownEvent {
    let data: unknown;
    try {
      data = JSON.parse(typeof payload === 'string' ? payload : new TextDecoder().decode(bytes(payload)));
    } catch {
      data = undefined;
    }
    const event = data as Record<string, unknown> | undefined;
    if (event === null || typeof event !== 'object' || typeof event.type !== 'string' || typeof event.id !== 'string') {
      throw new WebhookSignatureError('The webhook body is not a MyComm event.');
    }
    return event as unknown as WebhookEvent | UnknownEvent;
  }

  /** Whether this SDK version knows the event's type; narrows it, so a `switch` on `type` then types `data`. */
  static isKnown(event: WebhookEvent | UnknownEvent): event is WebhookEvent {
    return known.has(event.type);
  }

  /** The `MyComm-Signature` value MyComm would send for a body, for testing your own receiver. */
  static async sign(payload: WebhookPayload, secret: string, timestamp: number = Math.floor(Date.now() / 1000)): Promise<string> {
    return `t=${timestamp},v1=${await hmac(secret, concat(encoder.encode(`${timestamp}.`), bytes(payload)))}`;
  }
}

async function hmac(secret: string, data: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bytes(payload: WebhookPayload): Uint8Array {
  if (typeof payload === 'string') return encoder.encode(payload);
  if (payload instanceof ArrayBuffer) return new Uint8Array(payload);
  return new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength);
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
}

/** Constant-time comparison of two hex strings. */
function equal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
