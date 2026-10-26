// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Account, AccountUpdateParams } from '../types.js';

/** `client.account` */
export class AccountResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get the account.
   *
   * The account the key belongs to. Needs no ability and also works for a suspended account. `settings` is
   * `accounts.settings` without `notifications` and `onboarding`, which concern portal users only.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(options?: RequestOptions): Promise<WithMeta<Account>> {
    return this._connection.call('account.get', [], undefined, options) as Promise<WithMeta<Account>>;
  }

  /**
   * Update the account.
   *
   * Requires `account:write`. `settings` is deep-merged: arrays are replaced whole, language maps merge key by key
   * and `null` removes a language. `settings.limits` is read-only for account keys (`422 VALIDATION_FAILED`).
   * Changes are audit-logged.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(params?: AccountUpdateParams, options?: RequestOptions): Promise<WithMeta<Account>> {
    return this._connection.call('account.update', [], params, options) as Promise<WithMeta<Account>>;
  }
}
