// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Inbox, InboxesCreateParams, InboxesListParams, InboxesUpdateParams } from '../types.js';

/** `client.inboxes` */
export class InboxesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List inboxes.
   *
   * Requires `channels:read`. Archived inboxes are hidden unless `archived=true`. A key restricted to inboxes sees
   * only those.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listInboxes`
   */
  list(params?: InboxesListParams, options?: RequestOptions): Promise<Page<Inbox>> {
    return this._connection.call('inboxes.list', [], params, options) as Promise<Page<Inbox>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.inboxes.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<InboxesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Inbox> {
    return this._connection.all('inboxes.list', [], params, options) as AsyncGenerator<Inbox>;
  }

  /**
   * Create an integration inbox.
   *
   * Requires `channels:write`. Adds an `integration` inbox to a channel. `404` when the channel is unknown or
   * outside the key's scope; `409 NAME_TAKEN` `{field: "name"}` when the name is used on the channel
   * (case-insensitive).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createInbox`
   */
  create(params: InboxesCreateParams, options?: RequestOptions): Promise<WithMeta<Inbox>> {
    return this._connection.call('inboxes.create', [], params, options) as Promise<WithMeta<Inbox>>;
  }

  /**
   * Archive an integration inbox.
   *
   * Requires `channels:write`. Integration inboxes only (`409 INVALID_STATE` for a `main` inbox). Sends from it
   * are refused (`INBOX_ARCHIVED`) and reply routing skips it. Keys restricted to it keep read access. Archiving
   * an archived inbox changes nothing.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `archiveInbox`
   */
  archive(id: string, options?: RequestOptions): Promise<WithMeta<Inbox>> {
    return this._connection.call('inboxes.archive', [id], undefined, options) as Promise<WithMeta<Inbox>>;
  }

  /**
   * Unarchive an inbox.
   *
   * Requires `channels:write`. Does nothing when the inbox is not archived.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `unarchiveInbox`
   */
  unarchive(id: string, options?: RequestOptions): Promise<WithMeta<Inbox>> {
    return this._connection.call('inboxes.unarchive', [id], undefined, options) as Promise<WithMeta<Inbox>>;
  }

  /**
   * Get an inbox.
   *
   * Requires `channels:read`. `404` when the inbox is outside the key's scope.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getInbox`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Inbox>> {
    return this._connection.call('inboxes.get', [id], undefined, options) as Promise<WithMeta<Inbox>>;
  }

  /**
   * Update an inbox.
   *
   * Requires `channels:write`. `settings` keys are merged into the stored settings (a key set to `null` is
   * removed). `409 NAME_TAKEN` `{field: "name"}` when the name is used on the channel (case-insensitive).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateInbox`
   */
  update(id: string, params?: InboxesUpdateParams, options?: RequestOptions): Promise<WithMeta<Inbox>> {
    return this._connection.call('inboxes.update', [id], params, options) as Promise<WithMeta<Inbox>>;
  }
}
