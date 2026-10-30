// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { HostedLink } from '../types.js';

/** `client.links` */
export class LinksResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get a hosted link.
   *
   * Requires `channels:read`. The link without `url`; `status` reads `expired` once `expires_at` has passed. A
   * link of a line this key does not see is `404 NOT_FOUND`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getLink`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<HostedLink>> {
    return this._connection.call('links.get', [id], undefined, options) as Promise<WithMeta<HostedLink>>;
  }

  /**
   * Revoke a hosted link.
   *
   * Requires `links:write`. The link stops working at once, also for a page already open. Only an `open` link can
   * be revoked; any other status is `409 INVALID_STATE` with `details.status`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `deleteLink`
   */
  revoke(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('links.revoke', [id], undefined, options) as Promise<void>;
  }
}
