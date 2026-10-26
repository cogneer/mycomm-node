// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { ContactField, ContactFieldsCreateParams, ContactFieldsUpdateParams } from '../types.js';

/** `client.contactFields` */
export class ContactFieldsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List custom contact field definitions.
   *
   * Requires `contacts:read`. All definitions of the account ordered by `position`; not paginated.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(options?: RequestOptions): Promise<Page<ContactField>> {
    return this._connection.call('contactFields.list', [], undefined, options) as Promise<Page<ContactField>>;
  }

  /**
   * Create a custom contact field.
   *
   * Requires `contacts:write`. `key` matches `^[a-z][a-z0-9_]{0,39}$` and is not reserved (`first_name`,
   * `last_name`, `full_name`, `email`, `phone`, `language`, `group`); `key` and `type` cannot change later.
   * `options` is required for `select` and refused for other types. An account has at most 100 fields. `position`
   * defaults to after the last field.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: ContactFieldsCreateParams, options?: RequestOptions): Promise<WithMeta<ContactField>> {
    return this._connection.call('contactFields.create', [], params, options) as Promise<WithMeta<ContactField>>;
  }

  /**
   * Update a custom contact field.
   *
   * Requires `contacts:write`. Changes `label`, `options` (select fields only) and `position`. Sending `key` or
   * `type` is refused with `422`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: ContactFieldsUpdateParams, options?: RequestOptions): Promise<WithMeta<ContactField>> {
    return this._connection.call('contactFields.update', [id], params, options) as Promise<WithMeta<ContactField>>;
  }

  /**
   * Delete a custom contact field.
   *
   * Requires `contacts:write`. Removes the definition and its key from every contact. Refused with `409`
   * `INVALID_STATE` and `details.used_by` (the users of the field, each `{type, id, name}`) while a smart-list
   * filter references it; edit or delete those smart lists first.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('contactFields.delete', [id], undefined, options) as Promise<void>;
  }
}
