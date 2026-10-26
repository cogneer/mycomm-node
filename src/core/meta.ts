import type { MyCommResponse } from './http.js';

/**
 * What the API said about a call besides its body: `message._meta`, `page.meta`.
 */
export class ResponseMeta {
  constructor(
    readonly status: number,
    /** `MyComm-Request-Id`: quote it to support. */
    readonly requestId: string | undefined,
    readonly rateLimitLimit: number | undefined,
    readonly rateLimitRemaining: number | undefined,
    /** Seconds until the rate-limit window resets. */
    readonly rateLimitReset: number | undefined,
    /** True when this is the stored answer of an earlier call with the same `Idempotency-Key`. */
    readonly idempotentReplayed: boolean,
    /** `Deprecation` header of a deprecated endpoint, `@<unix time>`. */
    readonly deprecation: string | undefined,
    /** HTTP date after which a deprecated endpoint stops working. */
    readonly sunset: string | undefined,
    /** All response headers, names in lower case. */
    readonly headers: Readonly<Record<string, string>>,
  ) {}

  static fromResponse(response: MyCommResponse): ResponseMeta {
    const int = (name: string): number | undefined => {
      const value = response.header(name);
      return value !== undefined && /^\d+$/.test(value.trim()) ? Number(value) : undefined;
    };
    return new ResponseMeta(
      response.status,
      response.header('MyComm-Request-Id'),
      int('RateLimit-Limit'),
      int('RateLimit-Remaining'),
      int('RateLimit-Reset'),
      response.header('Idempotent-Replayed') === 'true',
      response.header('Deprecation'),
      response.header('Sunset'),
      response.headers,
    );
  }
}

/**
 * An object the API returned, with the `ResponseMeta` of its call as `_meta`. `_meta` is not enumerable: it stays out of
 * `JSON.stringify()`, spreads and `Object.keys()`, so the object is exactly the payload as sent.
 */
export type WithMeta<T> = T & { readonly _meta: ResponseMeta };

/** @internal */
export function withMeta<T extends object>(value: T, meta: ResponseMeta): WithMeta<T> {
  Object.defineProperty(value, '_meta', { value: meta, enumerable: false, writable: false, configurable: true });
  return value as WithMeta<T>;
}
