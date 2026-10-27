// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { ConsentEvent, ConsentEventsListParams } from '../types.js';

/** `client.consentEvents` */
export class ConsentEventsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List consent events.
   *
   * Requires `suppressions:read`. The account's consent audit trail, newest first, with cursor pagination: every
   * `opt_out` and `opt_in` with its method, keyword, message, actor and note. The trail is append-only; it
   * outlives the suppression it records and the contact's erasure. Comma lists match any of the values.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listConsentEvents`
   */
  list(params?: ConsentEventsListParams, options?: RequestOptions): Promise<Page<ConsentEvent>> {
    return this._connection.call('consentEvents.list', [], params, options) as Promise<Page<ConsentEvent>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.consentEvents.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<ConsentEventsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<ConsentEvent> {
    return this._connection.all('consentEvents.list', [], params, options) as AsyncGenerator<ConsentEvent>;
  }
}
