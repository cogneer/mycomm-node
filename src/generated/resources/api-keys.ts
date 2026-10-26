// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  ApiKey,
  ApiKeysCreateParams,
  ApiKeysListParams,
  ApiKeysRotateParams,
  ApiKeysRotateResponse,
  CreatedApiKey,
} from '../types.js';

/** `client.apiKeys` */
export class ApiKeysResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List API keys.
   *
   * Requires `keys:write`. Revoked keys are hidden unless `revoked=true`. The token is never returned here.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: ApiKeysListParams, options?: RequestOptions): Promise<Page<ApiKey>> {
    return this._connection.call('apiKeys.list', [], params, options) as Promise<Page<ApiKey>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.apiKeys.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ApiKeysListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<ApiKey> {
    return this._connection.all('apiKeys.list', [], params, options) as AsyncGenerator<ApiKey>;
  }

  /**
   * Create an API key.
   *
   * Requires `keys:write`. Abilities default to the preset for the key's scope, must be a subset of the calling
   * key's, and a restricted key cannot hold the abilities marked with a cross there. A restricted caller can
   * create keys only inside its own scope. `partner` keys are never created here. The `token` is shown once, in
   * this response.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: ApiKeysCreateParams, options?: RequestOptions): Promise<WithMeta<CreatedApiKey>> {
    return this._connection.call('apiKeys.create', [], params, options) as Promise<WithMeta<CreatedApiKey>>;
  }

  /**
   * Revoke an API key.
   *
   * Requires `keys:write`. Revokes immediately; the key's next call is `401`. Revoking a revoked key is a no-op.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  revoke(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('apiKeys.revoke', [id], undefined, options) as Promise<void>;
  }

  /**
   * Rotate an API key.
   *
   * Requires `keys:write`. Creates a new key with the same name, scope, abilities, allowed IPs and expiry, and
   * returns its `token` once. The old key keeps working for `grace_period_hours` (default 24, at most 168) so you
   * can deploy the new token without a gap; with `0` it is revoked at once. The old key's expiry never moves later
   * than it already was. A restricted caller can rotate only keys inside its own scope. A revoked or expired key
   * cannot be rotated.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  rotate(id: string, params?: ApiKeysRotateParams, options?: RequestOptions): Promise<WithMeta<ApiKeysRotateResponse>> {
    return this._connection.call('apiKeys.rotate', [id], params, options) as Promise<WithMeta<ApiKeysRotateResponse>>;
  }
}
