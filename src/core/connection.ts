import { OPERATIONS } from '../generated/operations.js';
import { APIError, ConnectionError, InvalidArgumentError, MyCommError, UnexpectedResponseError } from './errors.js';
import { guard } from './guard.js';
import { MyCommRequest, TIMEOUT, type MyCommResponse, type Transport } from './http.js';
import { withMeta } from './meta.js';
import type { OperationSpec } from './operation.js';
import { Page } from './page.js';
import type { RequestOptions } from './request-options.js';
import { retryAfterSeconds } from './retry-after.js';
import { filenameOf } from './uploads.js';
import { VERSION } from './version.js';

/** A repeat while the first request with the same key is still running: the API asks to wait a second. */
const IN_PROGRESS = 'IDEMPOTENCY_IN_PROGRESS';

const MAX_DELAY = 60;

export interface ConnectionOptions {
  transport: Transport;
  apiKey: string;
  baseUrl: string;
  accountId: string | undefined;
  maxRetries: number;
  /** Milliseconds per attempt. */
  timeout: number;
  validate: boolean;
  headers: Record<string, string>;
  /** Waits the given seconds between retries; replaced in tests. */
  sleep?: (seconds: number, signal?: AbortSignal) => Promise<void>;
}

/**
 * Everything the resources share: authentication, headers, encoding, retries and turning error answers into errors.
 *
 * @internal
 */
export class Connection {
  private readonly sleep: (seconds: number, signal?: AbortSignal) => Promise<void>;

  constructor(readonly options: ConnectionOptions) {
    this.sleep = options.sleep ?? wait;
  }

  /** Calls the operation of a resource method and reads its answer. */
  async call(key: string, pathArgs: string[], params: object | undefined, options?: RequestOptions): Promise<unknown> {
    const spec = OPERATIONS[key];
    if (spec === undefined) {
      throw new MyCommError(`Unknown operation ${key}.`);
    }
    const values = (params ?? {}) as Record<string, unknown>;
    const response = await this.request(spec, pathArgs, values, options);
    return this.read(key, spec, pathArgs, values, response, options);
  }

  /** Every item of a list, page after page. */
  async *all(key: string, pathArgs: string[], params: object | undefined, options?: RequestOptions): AsyncGenerator<unknown> {
    const page = (await this.call(key, pathArgs, params, options)) as Page<unknown>;
    yield* page.autoPaging();
  }

  private read(
    key: string,
    spec: OperationSpec,
    pathArgs: string[],
    values: Record<string, unknown>,
    response: MyCommResponse,
    options: RequestOptions | undefined,
  ): unknown {
    switch (spec.returns) {
      case 'void':
        return undefined;
      case 'maybe':
        return response.body === '' ? null : withMeta(object(response), response.meta());
      case 'page': {
        const body = object(response);
        const data = Array.isArray(body.data) ? body.data : [];
        const cursor = typeof body.next_cursor === 'string' ? body.next_cursor : null;
        const next = spec.paginated
          ? (nextCursor: string) => this.call(key, pathArgs, { ...values, cursor: nextCursor }, options) as Promise<Page<unknown>>
          : undefined;
        return new Page(data, cursor, response.meta(), next);
      }
      default:
        return withMeta(object(response), response.meta());
    }
  }

  /** Sends a request, retrying what is safe to retry. Resolves with a 2xx answer; throws for anything else. */
  async request(
    spec: OperationSpec,
    pathArgs: string[],
    values: Record<string, unknown>,
    options: RequestOptions = {},
  ): Promise<MyCommResponse> {
    const request = this.build(spec, pathArgs, values, options);
    const retries = Math.max(0, options.maxRetries ?? this.options.maxRetries);

    for (let attempt = 0; ; attempt++) {
      let response: MyCommResponse;
      try {
        response = await this.attempt(request, options);
      } catch (error) {
        if (!(error instanceof ConnectionError) || attempt >= retries || !repeatable(request)) {
          throw error;
        }
        await this.sleep(backoff(attempt), options.signal);
        continue;
      }

      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = APIError.fromResponse(response);
      const delay = attempt < retries ? retryDelay(request, response, error, attempt) : null;
      if (delay === null) {
        throw error;
      }
      await this.sleep(delay, options.signal);
    }
  }

  private async attempt(request: MyCommRequest, options: RequestOptions): Promise<MyCommResponse> {
    const controller = new AbortController();
    const timeout = options.timeout ?? this.options.timeout;
    const timer = setTimeout(() => controller.abort(new DOMException(TIMEOUT, 'TimeoutError')), timeout);
    const user = options.signal;
    const forward = (): void => controller.abort(user?.reason);
    if (user?.aborted) {
      clearTimeout(timer);
      throw user.reason;
    }
    user?.addEventListener('abort', forward, { once: true });
    try {
      return await this.options.transport.send(request, controller.signal);
    } finally {
      clearTimeout(timer);
      user?.removeEventListener('abort', forward);
    }
  }

  private build(
    spec: OperationSpec,
    pathArgs: string[],
    values: Record<string, unknown>,
    options: RequestOptions,
  ): MyCommRequest {
    const path = this.path(spec, pathArgs);
    if (this.options.validate) {
      guard(spec.operation, values, spec.constraints ?? {}, spec.rules ?? []);
    }

    const queryNames = new Set(spec.query ?? []);
    const query: Record<string, string> = {};
    const fields: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(values)) {
      if (queryNames.has(name)) {
        const encoded = queryValue(value);
        if (encoded !== undefined) query[name] = encoded;
      } else if (value !== undefined) {
        fields[name] = value;
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.options.apiKey}`,
      Accept: 'application/json',
      ...userAgent(),
    };
    // Acting as a managed account applies to /v1 only; /partner/v1 is the partner's own context.
    if (this.options.accountId !== undefined && path.startsWith('/v1/')) {
      headers['MyComm-Account'] = this.options.accountId;
    }

    let json: Record<string, unknown> | undefined;
    let body: string | undefined;
    let form: FormData | undefined;
    if (spec.format === 'multipart') {
      form = multipart(fields, new Set(spec.files ?? []));
    } else if (spec.method === 'POST' || spec.method === 'PUT' || spec.method === 'PATCH') {
      // The API requires a JSON object on every write, also when the operation takes no fields.
      json = fields;
      body = JSON.stringify(fields);
      headers['Content-Type'] = 'application/json';
    }

    if (spec.method === 'POST') {
      headers['Idempotency-Key'] = options.idempotencyKey ?? crypto.randomUUID();
    }
    Object.assign(headers, this.options.headers, options.headers ?? {});

    const search = new URLSearchParams(query).toString();
    const url = this.options.baseUrl + path + (search === '' ? '' : `?${search.replaceAll('+', '%20')}`);
    return new MyCommRequest(spec.operation, spec.method, url, path, query, headers, json, form, body);
  }

  /** The path with its parameters filled in. An empty id would reach another endpoint, so it is refused, validation or not. */
  private path(spec: OperationSpec, pathArgs: string[]): string {
    const names = spec.pathParams ?? [];
    let path = spec.path;
    names.forEach((name, index) => {
      const value = pathArgs[index];
      if (typeof value !== 'string' || value.trim() === '') {
        throw new InvalidArgumentError(spec.operation, [
          { field: name, rule: 'REQUIRED', message: `${name} must be a non-empty string.` },
        ]);
      }
      path = path.replace(`{${name}}`, encodeURIComponent(value));
    });
    return path;
  }
}

/** Query parameters: `undefined` and `null` dropped, booleans as `true`/`false`, dates as ISO 8601, lists comma-separated. */
function queryValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((item) => (item instanceof Date ? item.toISOString() : String(item))).join(',');
  return String(value);
}

/** The fields of a multipart body: files as parts with a name, lists and objects as JSON text. */
function multipart(fields: Record<string, unknown>, files: Set<string>): FormData {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (files.has(name) || value instanceof Blob) {
      if (!(value instanceof Blob)) {
        throw new InvalidArgumentError('upload', [
          { field: name, rule: 'INVALID_TYPE', message: `${name} must be a File or a Blob; see toFile() and fileFromPath().` },
        ]);
      }
      form.append(name, value, filenameOf(value, name));
    } else if (value instanceof Date) {
      form.append(name, value.toISOString());
    } else if (typeof value === 'object') {
      form.append(name, JSON.stringify(value));
    } else {
      form.append(name, String(value));
    }
  }
  return form;
}

function object(response: MyCommResponse): Record<string, unknown> {
  if (response.body === '') {
    return {};
  }
  let decoded: unknown;
  try {
    decoded = JSON.parse(response.body);
  } catch {
    decoded = undefined;
  }
  if (decoded === null || typeof decoded !== 'object' || Array.isArray(decoded)) {
    throw new UnexpectedResponseError(`The API answered ${response.status} with a body that is not a JSON object.`, response);
  }
  return decoded as Record<string, unknown>;
}

/** Seconds to wait before repeating the request, or `null` when this answer must not be retried. */
function retryDelay(request: MyCommRequest, response: MyCommResponse, error: APIError, attempt: number): number | null {
  const retryAfter = retryAfterSeconds(response.header('Retry-After'));
  const wait = retryAfter !== undefined ? Math.min(retryAfter, MAX_DELAY) : undefined;
  // Rejected before any work started, so safe for every method.
  if (response.status === 429 || response.status === 503) return wait ?? backoff(attempt);
  if (response.status === 409 && error.code === IN_PROGRESS) return wait ?? 1;
  if (response.status >= 500 && repeatable(request)) return wait ?? backoff(attempt);
  return null;
}

/**
 * Whether sending the request twice is harmless: a read, a write that sets a state, or a POST that carries an
 * `Idempotency-Key` (the API then replays the first answer instead of running again).
 */
function repeatable(request: MyCommRequest): boolean {
  return request.method !== 'POST' || request.header('Idempotency-Key') !== undefined;
}

function backoff(attempt: number): number {
  const base = Math.min(0.5 * 2 ** attempt, 8);
  return base * (0.75 + Math.random() * 0.5);
}

function wait(seconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, seconds * 1000);
    const abort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener('abort', abort, { once: true });
  });
}

let agent: Record<string, string> | undefined;

/** `User-Agent: mycomm-node/1.0.0 node/v22.12.0`, where the runtime lets a request carry one. */
function userAgent(): Record<string, string> {
  if (agent === undefined) {
    const runtime = globalThis as { process?: { versions?: Record<string, string> }; Deno?: { version?: { deno?: string } } };
    const versions = runtime.process?.versions;
    const name =
      runtime.Deno?.version?.deno !== undefined
        ? `deno/${runtime.Deno.version.deno}`
        : versions?.bun !== undefined
          ? `bun/${versions.bun}`
          : versions?.node !== undefined
            ? `node/v${versions.node}`
            : undefined;
    agent = name === undefined ? {} : { 'User-Agent': `mycomm-node/${VERSION} ${name}` };
  }
  return agent;
}
