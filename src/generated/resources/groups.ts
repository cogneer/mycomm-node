// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Contact,
  Group,
  GroupsCreateParams,
  GroupsListParams,
  GroupsMembersAddParams,
  GroupsMembersAddResponse,
  GroupsMembersListParams,
  GroupsMembersRemoveParams,
  GroupsMembersRemoveResponse,
  GroupsUpdateParams,
} from '../types.js';

/** `client.groups` */
export class GroupsResource {
  readonly members: GroupsMembersResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.members = new GroupsMembersResource(_connection);
  }

  /**
   * List groups.
   *
   * Requires `contacts:read`. Groups of the account sorted by `name` (default) with cursor pagination. `q` matches
   * the name, case-insensitively.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listGroups`
   */
  list(params?: GroupsListParams, options?: RequestOptions): Promise<Page<Group>> {
    return this._connection.call('groups.list', [], params, options) as Promise<Page<Group>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.groups.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<GroupsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Group> {
    return this._connection.all('groups.list', [], params, options) as AsyncGenerator<Group>;
  }

  /**
   * Create a group.
   *
   * Requires `groups:write`. The name is unique per account, ignoring case (`409 NAME_TAKEN`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createGroup`
   */
  create(params: GroupsCreateParams, options?: RequestOptions): Promise<WithMeta<Group>> {
    return this._connection.call('groups.create', [], params, options) as Promise<WithMeta<Group>>;
  }

  /**
   * Retrieve a group.
   *
   * Requires `contacts:read`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getGroup`
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Group>> {
    return this._connection.call('groups.show', [id], undefined, options) as Promise<WithMeta<Group>>;
  }

  /**
   * Update a group.
   *
   * Requires `groups:write`. Changes `name` and `description`; a duplicate name answers `409 NAME_TAKEN`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateGroup`
   */
  update(id: string, params?: GroupsUpdateParams, options?: RequestOptions): Promise<WithMeta<Group>> {
    return this._connection.call('groups.update', [id], params, options) as Promise<WithMeta<Group>>;
  }

  /**
   * Delete a group.
   *
   * Requires `groups:write`. Removes the group and its memberships; the contacts stay. Refused with `409`
   * `INVALID_STATE` and `details.used_by` (each `{type, id, name}`) while a scheduled, running or paused campaign
   * uses the group or an automation rule's add-to-group or remove-from-group action names it.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `deleteGroup`
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('groups.delete', [id], undefined, options) as Promise<void>;
  }
}

/** `client.groups.members` */
export class GroupsMembersResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List the contacts of a group.
   *
   * Requires `contacts:read`. The contacts of the group with the filters and resource of `GET /v1/contacts`;
   * soft-deleted contacts are not listed.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listGroupMembers`
   */
  list(id: string, params?: GroupsMembersListParams, options?: RequestOptions): Promise<Page<Contact>> {
    return this._connection.call('groups.members.list', [id], params, options) as Promise<Page<Contact>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.groups.members.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(id: string, params?: Omit<GroupsMembersListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Contact> {
    return this._connection.all('groups.members.list', [id], params, options) as AsyncGenerator<Contact>;
  }

  /**
   * Add contacts to a group.
   *
   * Requires `groups:write`. 1 to 1,000 contact ids. Unknown ids are reported in `not_found`; contacts already in
   * the group count in `already_member`. Each contact that joins emits `contact.updated` (changed `groups`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `addGroupMembers`
   */
  add(id: string, params: GroupsMembersAddParams, options?: RequestOptions): Promise<WithMeta<GroupsMembersAddResponse>> {
    return this._connection.call('groups.members.add', [id], params, options) as Promise<WithMeta<GroupsMembersAddResponse>>;
  }

  /**
   * Remove contacts from a group.
   *
   * Requires `groups:write`. 1 to 1,000 contact ids. Ids that are not members count in `not_member`. Each removed
   * contact emits `contact.updated` (changed `groups`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `removeGroupMembers`
   */
  remove(
    id: string,
    params: GroupsMembersRemoveParams,
    options?: RequestOptions,
  ): Promise<WithMeta<GroupsMembersRemoveResponse>> {
    return this._connection.call('groups.members.remove', [id], params, options) as Promise<
      WithMeta<GroupsMembersRemoveResponse>
    >;
  }
}
