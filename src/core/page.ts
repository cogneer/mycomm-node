import type { ResponseMeta } from './meta.js';

/**
 * One page of a list. Iterating it (`for (const item of page)`) yields the items of this page; `autoPaging()` and the
 * resource's `all()` continue through the following pages.
 */
export class Page<T> implements Iterable<T> {
  constructor(
    readonly data: T[],
    /** Cursor of the next page; `null` on the last page. */
    readonly next_cursor: string | null,
    /** Request id and rate-limit numbers of the call that returned this page. */
    readonly meta: ResponseMeta | undefined,
    private readonly fetchNext?: (cursor: string) => Promise<Page<T>>,
  ) {}

  hasMore(): boolean {
    return this.next_cursor !== null && this.fetchNext !== undefined;
  }

  /** Fetches the next page, or resolves to `null` on the last one. */
  async next(): Promise<Page<T> | null> {
    if (this.next_cursor === null || this.fetchNext === undefined) {
      return null;
    }
    return this.fetchNext(this.next_cursor);
  }

  /** Every item from this page to the last, fetching pages as the loop reaches them. */
  async *autoPaging(): AsyncGenerator<T> {
    for (let page: Page<T> | null = this; page !== null; page = await page.next()) {
      yield* page.data;
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.data[Symbol.iterator]();
  }

  get length(): number {
    return this.data.length;
  }
}
