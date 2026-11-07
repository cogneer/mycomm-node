// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { MeUpdateParams, User } from '../types.js';

/** `client.me` */
export class MeResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get the user.
   *
   * The user the key belongs to. Needs no ability and also works for a suspended user. `settings` is the user's
   * settings without `notifications` and `onboarding`, which concern the portal only.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getMe`
   */
  get(options?: RequestOptions): Promise<WithMeta<User>> {
    return this._connection.call('me.get', [], undefined, options) as Promise<WithMeta<User>>;
  }

  /**
   * Update the user.
   *
   * Requires `me:write`. `settings` is deep-merged: arrays are replaced whole, language maps merge key by key and
   * `null` removes a language. `settings.limits` is read-only for user keys (`422 VALIDATION_FAILED`). Changes are
   * audit-logged.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateMe`
   */
  update(params?: MeUpdateParams, options?: RequestOptions): Promise<WithMeta<User>> {
    return this._connection.call('me.update', [], params, options) as Promise<WithMeta<User>>;
  }
}
