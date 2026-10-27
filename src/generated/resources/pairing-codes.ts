// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { PairingCode, PairingCodesCreateParams } from '../types.js';

/** `client.pairingCodes` */
export class PairingCodesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Create a pairing code.
   *
   * Requires `channels:write`. The code is 8 Crockford base32 characters, single use and valid for 10 minutes. At
   * most 20 codes are pending and 60 are created per account per hour (`429 PAIRING_CODE_LIMIT_REACHED` with
   * `retry_after_seconds` and a `Retry-After` header). Render `qr_payload` as-is as a QR code.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createPairingCode`
   */
  create(params?: PairingCodesCreateParams, options?: RequestOptions): Promise<WithMeta<PairingCode>> {
    return this._connection.call('pairingCodes.create', [], params, options) as Promise<WithMeta<PairingCode>>;
  }

  /**
   * Get a pairing code.
   *
   * Requires `channels:read`.paired`. `code` and `qr_payload` are `null` here because the code is stored hashed.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getPairingCode`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<PairingCode>> {
    return this._connection.call('pairingCodes.get', [id], undefined, options) as Promise<WithMeta<PairingCode>>;
  }

  /**
   * Invalidate a pairing code.
   *
   * Requires `channels:write`. Only a `pending` code can be invalidated; any other status is `409 INVALID_STATE`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `deletePairingCode`
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('pairingCodes.delete', [id], undefined, options) as Promise<void>;
  }
}
