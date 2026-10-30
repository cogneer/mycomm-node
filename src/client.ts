import { Connection } from './core/connection.js';
import { MyCommError } from './core/errors.js';
import { FetchTransport, type Fetch, type Transport } from './core/http.js';
import type { RequestOptions } from './core/request-options.js';
import type { Account } from './generated/types.js';
import { Resources } from './generated/resources/index.js';

export interface ClientOptions {
  /** An account key (`mc_live_...`) or a partner key (`mc_partner_...`). Defaults to the `MYCOMM_API_KEY` environment variable. */
  apiKey?: string;
  /** Origin of the API, without `/v1`. Defaults to `MYCOMM_BASE_URL`, else `https://mycomm.cogneer.tech`. */
  baseUrl?: string;
  /** Retries after a network error, a 429 or a 5xx. POSTs carry an `Idempotency-Key`, so a retry never repeats their effect. */
  maxRetries?: number;
  /** Milliseconds per attempt. */
  timeout?: number;
  /** With a partner key: the line (its id) every `/v1` call acts on. See `forLine()`. */
  lineId?: string;
  /**
   * Check the arguments of each call against the API's documented rules before sending, and throw `InvalidArgumentError`
   * when one breaks a rule. Turn off only if the API has relaxed a rule this SDK version does not know yet.
   */
  validate?: boolean;
  /** Headers sent with every request. */
  defaultHeaders?: Record<string, string>;
  /** Your own `fetch`, for a proxy or instrumentation. The global one by default. */
  fetch?: Fetch;
  /**
   * The SDK refuses to run in a browser, where anyone who opens the page can read the API key. Set this only for a key
   * that is meant to be public, which no MyComm key is.
   */
  dangerouslyAllowBrowser?: boolean;
}

/** @internal The fake swaps the network for its own answers through this option. */
export const TRANSPORT = Symbol('mycomm.transport');

/** @internal */
export interface InternalOptions extends ClientOptions {
  [TRANSPORT]?: Transport;
  sleep?: (seconds: number, signal?: AbortSignal) => Promise<void>;
}

export interface VerifyCheck {
  name: 'key' | 'send';
  ok: boolean;
  message: string;
}

/** What `client.verify()` found: which checks passed and what each said. */
export interface VerifyResult {
  /** Whether every check passed. */
  ok: boolean;
  checks: VerifyCheck[];
  /** The messages of the checks that failed, for a settings screen or a log. */
  problems: string[];
  /** The account the key acts on, when the key works. */
  account: Account | null;
  /** What would hold a message to the number you tested, when the dry run predicts a hold. */
  holdReason: string | null;
}

/**
 * The MyComm API.
 *
 *     const mycomm = new MyComm({ apiKey: process.env.MYCOMM_API_KEY });
 *     const message = await mycomm.messages.send({ to: '+923001234567', body: 'Your code is 4821' });
 *
 * Every resource of the API reference is a property (`messages`, `contacts`, `webhookEndpoints`, ...) and every operation
 * a method on it. The partner API lives under `partner`.
 */
export class MyComm extends Resources {
  static readonly DEFAULT_BASE_URL = 'https://mycomm.cogneer.tech';

  private readonly settings: InternalOptions;

  constructor(options: ClientOptions = {}) {
    const settings = options as InternalOptions;
    const apiKey = settings.apiKey ?? env('MYCOMM_API_KEY');
    if (apiKey === undefined || apiKey.trim() === '') {
      throw new MyCommError('The MyComm API key is missing: pass `apiKey` or set MYCOMM_API_KEY.');
    }
    if (isBrowser() && settings.dangerouslyAllowBrowser !== true) {
      throw new MyCommError(
        'The MyComm SDK runs on your server: in a browser anyone can read the API key. Create a connect session on your server and use @mycomm/connect in the page.',
      );
    }
    // The paths carry /v1 and /partner/v1 themselves; forgive a base URL that already ends in one.
    const baseUrl = (settings.baseUrl ?? env('MYCOMM_BASE_URL') ?? MyComm.DEFAULT_BASE_URL)
      .replace(/\/+$/, '')
      .replace(/\/(partner\/)?v1$/, '');
    const fetchImpl = settings.fetch ?? globalThis.fetch?.bind(globalThis);
    const transport = settings[TRANSPORT] ?? new FetchTransport(fetchImpl);
    super(
      new Connection({
        transport,
        apiKey,
        baseUrl,
        lineId: settings.lineId,
        maxRetries: settings.maxRetries ?? 2,
        timeout: settings.timeout ?? 30_000,
        validate: settings.validate ?? true,
        headers: settings.defaultHeaders ?? {},
        sleep: settings.sleep,
      }),
    );
    this.settings = { ...settings, apiKey, baseUrl, [TRANSPORT]: transport };
  }

  /**
   * A client that acts on one of your lines: every `/v1` call carries `MyComm-Line`. For partner keys, which reach `/v1`
   * only through a line they made (`client.partner.lines.create(...)`); `/partner/v1` calls never carry it.
   */
  forLine(lineId: string): MyComm {
    return new MyComm({ ...this.settings, lineId } as ClientOptions);
  }

  /** Whether the client holds a partner key (`mc_partner_...`), which uses the partner API and reaches `/v1` only through `forLine()`. */
  isPartnerKey(): boolean {
    return (this.settings.apiKey ?? '').startsWith('mc_partner_');
  }

  /**
   * Checks that the key works and, when you give a number to test with, that a message to it would be accepted. Nothing
   * is sent: the second check is a dry run (`dry_run: true`), which runs the same authentication, validation, recipient,
   * content and safety checks as a real send and stores nothing. It does not check that the phone is online or that the
   * carrier delivers; see the guide "Verify your integration".
   *
   * Never throws for a problem with the key or the request: each problem is a failed check in the result, with the API's
   * own message. It does not retry, so a failure is reported at once. `lineId` names the line to send from; leave it out
   * when the key has only one.
   *
   * A partner key is checked on the partner API (it reaches no account of its own on `/v1`, so `account` stays null) and
   * its send is dry-run through a line: the one of `forLine()`, else `lineId`.
   */
  async verify(options: { to?: string; lineId?: string } = {}): Promise<VerifyResult> {
    const once: RequestOptions = { maxRetries: 0 };
    const checks: VerifyCheck[] = [];
    let account: Account | null = null;
    let holdReason: string | null = null;
    const partner = this.isPartnerKey();

    try {
      if (partner) {
        await this.partner.lines.list({ limit: 1 }, once);
        checks.push({ name: 'key', ok: true, message: 'The partner key works.' });
      } else {
        account = await this.account.get(once);
        checks.push({ name: 'key', ok: true, message: `The key works for account ${account.id}.` });
      }
    } catch (error) {
      if (!(error instanceof MyCommError)) throw error;
      checks.push({ name: 'key', ok: false, message: error.message });
      return result(checks, null, null);
    }

    let sender: MyComm = this;
    let lineId = options.lineId;
    if (partner && options.to !== undefined) {
      const line = this.settings.lineId ?? options.lineId;
      if (line === undefined) {
        checks.push({
          name: 'send',
          ok: false,
          message: 'A partner key sends through one of its lines: pass lineId (or use forLine()).',
        });
        return result(checks, null, null);
      }
      // The line goes in the MyComm-Line header; the body names no line.
      sender = this.settings.lineId === line ? this : this.forLine(line);
      lineId = undefined;
    }

    if (options.to !== undefined) {
      try {
        const preview = await sender.messages.send(
          { line_id: lineId, to: options.to, body: 'MyComm verify', category: 'transactional', dry_run: true },
          once,
        );
        holdReason = preview.hold_reason ?? null;
        checks.push({
          name: 'send',
          ok: true,
          message: `A message to ${options.to} would be accepted${holdReason !== null ? ` but held (${holdReason})` : ''}.`,
        });
      } catch (error) {
        if (!(error instanceof MyCommError)) throw error;
        checks.push({ name: 'send', ok: false, message: error.message });
      }
    }

    return result(checks, account, holdReason);
  }
}

function result(checks: VerifyCheck[], account: Account | null, holdReason: string | null): VerifyResult {
  const problems = checks.filter((check) => !check.ok).map((check) => check.message);
  return { ok: problems.length === 0, checks, problems, account, holdReason };
}

function env(name: string): string | undefined {
  const runtime = globalThis as { process?: { env?: Record<string, string | undefined> } };
  const value = runtime.process?.env?.[name];
  return value === undefined || value === '' ? undefined : value;
}

function isBrowser(): boolean {
  const runtime = globalThis as { window?: unknown; document?: unknown; Deno?: unknown };
  return typeof runtime.window !== 'undefined' && typeof runtime.document !== 'undefined' && runtime.Deno === undefined;
}
