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
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createConnectSession`
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
   * @see https://mycomm.cogneer.tech/docs/api/public `getConnectSession`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<ConnectSession>> {
    return this._connection.call('connectSessions.get', [id], undefined, options) as Promise<WithMeta<ConnectSession>>;
  }

  /**
   * Revoke a connect session.
   *
   * Requires `channels:write`. The link stops working at once, also for a page already open.status`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `deleteConnectSession`
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('connectSessions.delete', [id], undefined, options) as Promise<void>;
  }
}
