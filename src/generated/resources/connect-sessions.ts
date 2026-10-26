// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { ConnectSession, ConnectSessionsCreateParams, ConnectSessionsCreateResponse } from '../types.js';

/** `client.connectSessions` */
export class ConnectSessionsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Create a connect session.
   *
   * Requires `channels:write`. Send your tenant's browser to `url` to connect a phone on MyComm's hosted page
   * without an API key in the browser. Works with an account key and with a partner key acting as a managed
   * account (`MyComm-Account`). `url` is returned only here and is a bearer credential: treat it like a password.
   * At most 20 sessions are open per account (`422 CONNECT_SESSION_LIMIT_REACHED` with `details.max`) and 60 are
   * created per account per hour (`429 RATE_LIMITED`).
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params?: ConnectSessionsCreateParams, options?: RequestOptions): Promise<WithMeta<ConnectSessionsCreateResponse>> {
    return this._connection.call('connectSessions.create', [], params, options) as Promise<
      WithMeta<ConnectSessionsCreateResponse>
    >;
  }

  /**
   * Get a connect session.
   *
   * Requires `channels:read`. The session without `url`; `status` reads `expired` once `expires_at` has passed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<ConnectSession>> {
    return this._connection.call('connectSessions.get', [id], undefined, options) as Promise<WithMeta<ConnectSession>>;
  }

  /**
   * Revoke a connect session.
   *
   * Requires `channels:write`. The link stops working at once, also for a page already open. Only an `open`
   * session can be revoked; any other status is `409 INVALID_STATE` with `details.status`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('connectSessions.delete', [id], undefined, options) as Promise<void>;
  }
}
