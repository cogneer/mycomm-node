import { ConnectionError } from './errors.js';
import { ResponseMeta } from './meta.js';

/**
 * A request as the SDK sends it. The testing fake records these, so tests can check what was sent.
 */
export class MyCommRequest {
  /** Header names in lower case. */
  readonly headers: Readonly<Record<string, string>>;

  constructor(
    /** The SDK operation, for example `messages.send`. */
    readonly operation: string,
    readonly method: string,
    /** The full URL, with the query string. */
    readonly url: string,
    /** The path below the origin, without the query string: `/v1/messages`. */
    readonly path: string,
    /** The query parameters as sent. */
    readonly query: Readonly<Record<string, string>>,
    headers: Record<string, string>,
    /** The JSON body as sent (before encoding); `undefined` for a request without one. */
    readonly json: Record<string, any> | undefined,
    /** The multipart body; `undefined` unless the operation uploads a file. */
    readonly form: FormData | undefined,
    /** The encoded JSON body; `undefined` for a request without one or with a multipart body. */
    readonly body: string | undefined,
  ) {
    this.headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]));
  }

  header(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }
}

/**
 * An answer of the API.
 */
export class MyCommResponse {
  /** Header names in lower case. */
  readonly headers: Readonly<Record<string, string>>;
  private cachedMeta: ResponseMeta | undefined;

  constructor(
    readonly status: number,
    headers: Record<string, string>,
    readonly body: string,
  ) {
    this.headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]));
  }

  header(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }

  meta(): ResponseMeta {
    return (this.cachedMeta ??= ResponseMeta.fromResponse(this));
  }
}

/**
 * Sends one attempt of a request. `ConnectionError` when no answer arrived.
 *
 * @internal
 */
export interface Transport {
  send(request: MyCommRequest, signal: AbortSignal): Promise<MyCommResponse>;
}

export type Fetch = (input: string, init: RequestInit) => Promise<Response>;

/** @internal */
export class FetchTransport implements Transport {
  constructor(private readonly fetchImpl: Fetch) {}

  async send(request: MyCommRequest, signal: AbortSignal): Promise<MyCommResponse> {
    let response: Response;
    let body: string;
    try {
      response = await this.fetchImpl(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.form ?? request.body,
        signal,
        redirect: 'error',
      });
      body = await response.text();
    } catch (error) {
      if (signal.aborted && isTimeout(signal.reason)) {
        throw new ConnectionError('Could not reach MyComm: the request timed out.', { cause: error });
      }
      if (signal.aborted) {
        // Aborted by the caller: not a network problem, and not to be retried.
        throw signal.reason ?? error;
      }
      const reason =
        error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : String(error);
      throw new ConnectionError(`Could not reach MyComm: ${reason}`, { cause: error });
    }
    const headers: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });
    return new MyCommResponse(response.status, headers, body);
  }
}

/** The reason of an abort caused by `AbortSignal.timeout()` or by the SDK's own timer. */
export function isTimeout(reason: unknown): boolean {
  return reason instanceof Error && (reason.name === 'TimeoutError' || reason.message === TIMEOUT);
}

/** @internal */
export const TIMEOUT = 'MyComm request timed out';
