import { MyComm, TRANSPORT, type ClientOptions, type InternalOptions } from '../client.js';
import { ConnectionError, MyCommError } from '../core/errors.js';
import { MyCommResponse, type MyCommRequest, type Transport } from '../core/http.js';
import { Webhook } from '../webhooks.js';
import { EVENTS, RESPONSES } from './examples.js';

const REQUEST_ID = '01923f80-5c6a-7b10-9c21-0d3e4f5a6b7c';

/** A check of the fake failed. Test runners show it like any failed assertion. */
export class FakeAssertionError extends Error {
  override name = 'FakeAssertionError';
}

type Overrides = Record<string, unknown>;

/**
 * An answer the fake gives instead of the API.
 */
export class FakeResponse {
  private constructor(
    private readonly status: number | undefined,
    private readonly body: unknown,
    private readonly headers: Record<string, string> = {},
    private readonly overrides: Overrides | undefined = undefined,
    private readonly connectionError: string | undefined = undefined,
  ) {}

  /**
   * The realistic answer the API reference documents for the operation, with your values on top:
   * `FakeResponse.example({ status: 'delivered' })`. Objects are merged deeply; lists are replaced.
   */
  static example(overrides: Overrides = {}, status?: number): FakeResponse {
    return new FakeResponse(status, undefined, {}, overrides);
  }

  static json(body: unknown, status = 200, headers: Record<string, string> = {}): FakeResponse {
    return new FakeResponse(status, body, headers);
  }

  /** One page of a list. Items are full payloads, or partial ones when the code under test reads only some fields. */
  static page(items: unknown[], nextCursor: string | null = null): FakeResponse {
    return new FakeResponse(200, { data: items, next_cursor: nextCursor });
  }

  static noContent(): FakeResponse {
    return new FakeResponse(204, undefined);
  }

  /** An error answer in the API's envelope; the client throws the matching error. Headers such as `{ 'Retry-After': '2' }`. */
  static error(
    status: number,
    code: string,
    message = 'The request failed.',
    details: Overrides = {},
    headers: Record<string, string> = {},
  ): FakeResponse {
    return new FakeResponse(status, { error: { code, message, details, request_id: REQUEST_ID } }, headers);
  }

  /** A `422 VALIDATION_FAILED`: field path => message. */
  static validationError(fields: Record<string, string>): FakeResponse {
    const violations: Record<string, Array<{ code: string; message: string }>> = {};
    for (const [path, message] of Object.entries(fields)) {
      violations[path] = [{ code: 'INVALID', message }];
    }
    return FakeResponse.error(422, 'VALIDATION_FAILED', 'The request has invalid fields.', { fields: violations });
  }

  /** No answer at all: the client throws a `ConnectionError`. */
  static connectionError(message = 'Connection refused'): FakeResponse {
    return new FakeResponse(undefined, undefined, {}, undefined, message);
  }

  /** @internal */
  resolve(operation: string): MyCommResponse {
    if (this.connectionError !== undefined) {
      throw new ConnectionError(`Could not reach MyComm: ${this.connectionError}`);
    }
    let status = this.status;
    let body = this.body;
    if (this.overrides !== undefined) {
      const example = RESPONSES[operation] ?? { status: 200, body: {} };
      status ??= example.status;
      body =
        example.body === null && Object.keys(this.overrides).length === 0 ? undefined : merge(example.body ?? {}, this.overrides);
    }
    return new MyCommResponse(
      status ?? 200,
      {
        'Content-Type': 'application/json',
        'MyComm-Request-Id': REQUEST_ID,
        'RateLimit-Limit': '600',
        'RateLimit-Remaining': '599',
        'RateLimit-Reset': '60',
        ...this.headers,
      },
      body === undefined ? '' : JSON.stringify(body),
    );
  }
}

type Answer = FakeResponse | Overrides;
type Stub = Answer | ((request: MyCommRequest) => Answer);

class FakeTransport implements Transport {
  readonly requests: MyCommRequest[] = [];
  readonly stubs = new Map<string, Stub>();
  readonly queues = new Map<string, FakeResponse[]>();

  async send(request: MyCommRequest): Promise<MyCommResponse> {
    this.requests.push(request);
    let answer: Stub | undefined = this.queues.get(request.operation)?.shift();
    answer ??= this.stubs.get(request.operation) ?? FakeResponse.example();
    if (typeof answer === 'function') {
      answer = answer(request);
    }
    const response = answer instanceof FakeResponse ? answer : FakeResponse.example(answer);
    return response.resolve(request.operation);
  }
}

/**
 * A MyComm client that never touches the network, for testing code that uses the SDK.
 *
 *     const fake = new MyCommFake();
 *     await notifyOrder(fake.client, order);
 *     fake.assertCalled('messages.send', (request) => request.json?.to === '+923001234567');
 *
 * Every operation answers with the realistic example of the API reference until you say otherwise with `respond()` or
 * `respondOnce()`. Operations are named by their SDK id: `messages.send`, `contacts.list`, `partner.accounts.provision`.
 */
export class MyCommFake {
  readonly client: MyComm;
  private readonly transport = new FakeTransport();

  /**
   * `validate`: whether the client checks arguments before sending, as a real client does. Turn it off to test how your
   * code handles what the server answers to a request the SDK would have refused.
   */
  constructor(options: Pick<ClientOptions, 'apiKey' | 'accountId' | 'validate'> = {}) {
    const internal: InternalOptions = {
      apiKey: options.apiKey ?? 'mc_live_fake',
      accountId: options.accountId,
      validate: options.validate,
      // No retries: an error you stub must surface at once, without the client waiting in between.
      maxRetries: 0,
      dangerouslyAllowBrowser: true,
      [TRANSPORT]: this.transport,
    };
    this.client = new MyComm(internal);
  }

  /**
   * Answers every call of an operation, until changed. An object is laid over the operation's example:
   * `respond('messages.send', { status: 'failed' })`. A function receives the request and returns an object or a
   * `FakeResponse`.
   */
  respond(operation: string, response: Stub): this {
    this.transport.stubs.set(operation, response);
    return this;
  }

  /** Answers the next call of an operation; several of these are used in order, before `respond()`. */
  respondOnce(operation: string, response: Answer): this {
    const queue = this.transport.queues.get(operation) ?? [];
    queue.push(response instanceof FakeResponse ? response : FakeResponse.example(response));
    this.transport.queues.set(operation, queue);
    return this;
  }

  /** The requests made, optionally of one operation. */
  calls(operation?: string): MyCommRequest[] {
    return this.transport.requests.filter((request) => operation === undefined || request.operation === operation);
  }

  assertCalled(operation: string, where?: (request: MyCommRequest) => boolean): this {
    const calls = this.matching(operation, where);
    check(
      calls.length > 0,
      where === undefined
        ? `Expected a call of ${operation}, but none was made.`
        : `Expected a matching call of ${operation}, but none of its ${this.calls(operation).length} call(s) matched.`,
    );
    return this;
  }

  assertCalledTimes(operation: string, times: number, where?: (request: MyCommRequest) => boolean): this {
    const count = this.matching(operation, where).length;
    check(count === times, `Expected ${times} call(s) of ${operation}, but ${count} were made.`);
    return this;
  }

  assertNotCalled(operation: string, where?: (request: MyCommRequest) => boolean): this {
    const count = this.matching(operation, where).length;
    check(count === 0, `Expected no call of ${operation}, but ${count} were made.`);
    return this;
  }

  assertNothingCalled(): this {
    const operations = [...new Set(this.transport.requests.map((request) => request.operation))];
    check(operations.length === 0, `Expected no API call, but these were made: ${operations.join(', ')}.`);
    return this;
  }

  private matching(operation: string, where?: (request: MyCommRequest) => boolean): MyCommRequest[] {
    const calls = this.calls(operation);
    return where === undefined ? calls : calls.filter(where);
  }
}

/**
 * A signed webhook request as MyComm would send it, for testing your receiver.
 *
 *     const webhook = await FakeWebhook.make('message.delivered', { secret });
 *     await request(app).post('/webhooks/mycomm').set(webhook.headers()).send(webhook.payload);
 */
export class FakeWebhook {
  private constructor(
    readonly payload: string,
    readonly signature: string,
  ) {}

  /**
   * `overrides` are laid over the event's example payload; `timestamp` is the Unix time of the signature (now by default).
   */
  static async make(
    type: string,
    options: { overrides?: Overrides; secret?: string; timestamp?: number } = {},
  ): Promise<FakeWebhook> {
    const example = EVENTS[type];
    if (example === undefined) {
      throw new MyCommError(`No webhook event is named ${type}.`);
    }
    const payload = JSON.stringify(merge(example, options.overrides ?? {}));
    return new FakeWebhook(payload, await Webhook.sign(payload, options.secret ?? 'whsec_fake', options.timestamp));
  }

  /** The request headers of the delivery. */
  headers(): Record<string, string> {
    return { 'Content-Type': 'application/json', [Webhook.SIGNATURE_HEADER]: this.signature };
  }
}

/** The example answer of every operation and the example payload of every event, by SDK operation id and event type. */
export const examples = { responses: RESPONSES, events: EVENTS };

function check(condition: boolean, message: string): void {
  if (!condition) {
    throw new FakeAssertionError(message);
  }
}

function merge(base: unknown, overrides: Overrides): unknown {
  if (base === null || typeof base !== 'object' || Array.isArray(base)) {
    return overrides;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(overrides)) {
    const current = out[key];
    out[key] =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current)
        ? merge(current, value as Overrides)
        : value;
  }
  return out;
}
