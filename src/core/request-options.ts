/**
 * Per-call settings, the last argument of any resource method: `client.messages.send(params, { idempotencyKey })`.
 */
export interface RequestOptions {
  /** Sent as `Idempotency-Key` on a POST. The SDK generates one when this is not given, and reuses it on each retry. */
  idempotencyKey?: string;
  /** Overrides the client's retry count for this call. */
  maxRetries?: number;
  /** Overrides the client's timeout per attempt, in milliseconds. */
  timeout?: number;
  /** Extra request headers. */
  headers?: Record<string, string>;
  /** Cancels the call, including the waits between retries. */
  signal?: AbortSignal;
}
