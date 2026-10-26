/**
 * Reads a `Retry-After` header: a number of seconds, or an HTTP date. Seconds, or `undefined`.
 *
 * @internal
 */
export function retryAfterSeconds(value: string | undefined, now: number = Date.now()): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  if (/^\s*\d+(\.\d+)?\s*$/.test(value)) {
    return Math.max(0, Math.trunc(Number(value)));
  }
  const at = Date.parse(value);
  return Number.isNaN(at) ? undefined : Math.max(0, Math.round((at - now) / 1000));
}
