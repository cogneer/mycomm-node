// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Contact,
  SmartList,
  SmartListPreview,
  SmartListsCountResponse,
  SmartListsCreateParams,
  SmartListsListParams,
  SmartListsMembersListParams,
  SmartListsPreviewParams,
  SmartListsUpdateParams,
} from '../types.js';

/** `client.smartLists` */
export class SmartListsResource {
  readonly members: SmartListsMembersResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.members = new SmartListsMembersResource(_connection);
  }

  /**
   * List smart lists.
   *
   * Requires `contacts:read`. Smart lists of the account sorted by `name` (default) with cursor pagination. `q`
   * matches the name, case-insensitively.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: SmartListsListParams, options?: RequestOptions): Promise<Page<SmartList>> {
    return this._connection.call('smartLists.list', [], params, options) as Promise<Page<SmartList>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.smartLists.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<SmartListsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<SmartList> {
    return this._connection.all('smartLists.list', [], params, options) as AsyncGenerator<SmartList>;
  }

  /**
   * Create a smart list.
   *
   * Requires `groups:write`. `filter` is the smart list filter language; a filter that breaks it answers `422
   * FILTER_INVALID` with `details.pointer`, a JSON pointer to the bad node. The name is unique per account,
   * ignoring case (`409 NAME_TAKEN`).
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: SmartListsCreateParams, options?: RequestOptions): Promise<WithMeta<SmartList>> {
    return this._connection.call('smartLists.create', [], params, options) as Promise<WithMeta<SmartList>>;
  }

  /**
   * Preview a filter.
   *
   * Requires `contacts:read`. Counts the contacts a filter matches and returns up to 10 of them, newest first,
   * without saving anything; for filter-builder UIs. Contacts are evaluated on their primary phone identity. A
   * count that runs past its 5-second limit answers `503 SERVICE_UNAVAILABLE`; retry after `Retry-After` seconds.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  preview(params: SmartListsPreviewParams, options?: RequestOptions): Promise<WithMeta<SmartListPreview>> {
    return this._connection.call('smartLists.preview', [], params, options) as Promise<WithMeta<SmartListPreview>>;
  }

  /**
   * Retrieve a smart list.
   *
   * Requires `contacts:read`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<SmartList>> {
    return this._connection.call('smartLists.show', [id], undefined, options) as Promise<WithMeta<SmartList>>;
  }

  /**
   * Update a smart list.
   *
   * Requires `groups:write`. Changes `name` and `filter`; an invalid filter answers `422 FILTER_INVALID` and a
   * duplicate name `409 NAME_TAKEN`. Any change starts a fresh count.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: SmartListsUpdateParams, options?: RequestOptions): Promise<WithMeta<SmartList>> {
    return this._connection.call('smartLists.update', [id], params, options) as Promise<WithMeta<SmartList>>;
  }

  /**
   * Delete a smart list.
   *
   * Requires `groups:write`. Refused with `409 INVALID_STATE` and `details.used_by` (each `{type, id, name}`)
   * while an unfinished campaign (draft, scheduled, running or paused) targets the list.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('smartLists.delete', [id], undefined, options) as Promise<void>;
  }

  /**
   * Count the contacts of a smart list.
   *
   * Requires `contacts:read`. The number of contacts the filter matches, cached for 10 minutes: contacts that
   * start or stop matching show within 10 minutes, while a change to the list is counted at once. A count that
   * runs past its 5-second limit answers `503 SERVICE_UNAVAILABLE`; retry after `Retry-After` seconds.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  count(id: string, options?: RequestOptions): Promise<WithMeta<SmartListsCountResponse>> {
    return this._connection.call('smartLists.count', [id], undefined, options) as Promise<WithMeta<SmartListsCountResponse>>;
  }
}

/** `client.smartLists.members` */
export class SmartListsMembersResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List the contacts of a smart list.
   *
   * Requires `contacts:read`. The contacts the filter matches now (evaluated live, never cached) with the filters,
   * sorts and resource of `GET /v1/contacts`. A saved filter that no longer validates (for example a group it
   * names was deleted) answers `422 FILTER_INVALID` until the list is edited.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(id: string, params?: SmartListsMembersListParams, options?: RequestOptions): Promise<Page<Contact>> {
    return this._connection.call('smartLists.members.list', [id], params, options) as Promise<Page<Contact>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.smartLists.members.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(id: string, params?: Omit<SmartListsMembersListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Contact> {
    return this._connection.all('smartLists.members.list', [id], params, options) as AsyncGenerator<Contact>;
  }
}
