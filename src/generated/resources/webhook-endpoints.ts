// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  CreatedWebhookEndpoint,
  RotatedWebhookSecret,
  WebhookEndpoint,
  WebhookEndpointsCreateParams,
  WebhookEndpointsListParams,
  WebhookEndpointsRotateSecretParams,
  WebhookEndpointsUpdateParams,
  WebhookTestResult,
} from '../types.js';

/** `client.webhookEndpoints` */
export class WebhookEndpointsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List webhook endpoints.
   *
   * Requires `webhooks:write`. Secrets are never returned here. A restricted key sees only endpoints whose
   * `inbox_ids` is set and inside its scope.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: WebhookEndpointsListParams, options?: RequestOptions): Promise<Page<WebhookEndpoint>> {
    return this._connection.call('webhookEndpoints.list', [], params, options) as Promise<Page<WebhookEndpoint>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.webhookEndpoints.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<WebhookEndpointsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<WebhookEndpoint> {
    return this._connection.all('webhookEndpoints.list', [], params, options) as AsyncGenerator<WebhookEndpoint>;
  }

  /**
   * Create a webhook endpoint.
   *
   * Requires `webhooks:write`. The `url` must be `https`, carry no credentials and resolve only to public
   * addresses. `events` empty or omitted means every event except the opt-in ones. `inbox_ids` and `channel_types`
   * `null` mean all. At most 20 endpoints per account. A restricted key's endpoint defaults to (and must stay
   * inside) its inboxes, takes the key's channel types and cannot include managed accounts. The `secret` is shown
   * once, in this response.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: WebhookEndpointsCreateParams, options?: RequestOptions): Promise<WithMeta<CreatedWebhookEndpoint>> {
    return this._connection.call('webhookEndpoints.create', [], params, options) as Promise<WithMeta<CreatedWebhookEndpoint>>;
  }

  /**
   * Get a webhook endpoint.
   *
   * Requires `webhooks:write`. Never returns the secret. `404` outside a restricted key's scope.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<WebhookEndpoint>> {
    return this._connection.call('webhookEndpoints.get', [id], undefined, options) as Promise<WithMeta<WebhookEndpoint>>;
  }

  /**
   * Update a webhook endpoint.
   *
   * Requires `webhooks:write`. Only the fields sent change. `active: true` re-enables a disabled endpoint and
   * resets its failure counters. An endpoint with `include_managed_accounts` keeps `inbox_ids` `null`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: WebhookEndpointsUpdateParams, options?: RequestOptions): Promise<WithMeta<WebhookEndpoint>> {
    return this._connection.call('webhookEndpoints.update', [id], params, options) as Promise<WithMeta<WebhookEndpoint>>;
  }

  /**
   * Delete a webhook endpoint.
   *
   * Requires `webhooks:write`. Pending deliveries are dropped.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('webhookEndpoints.delete', [id], undefined, options) as Promise<void>;
  }

  /**
   * Rotate a webhook endpoint's secret.
   *
   * Requires `webhooks:write`. The old secret stays valid as the previous secret for
   * `previous_secret_valid_seconds` (0 to 86400, default 86400); during the overlap every delivery carries both
   * signatures. Rotating again replaces the previous secret.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  rotateSecret(
    id: string,
    params?: WebhookEndpointsRotateSecretParams,
    options?: RequestOptions,
  ): Promise<WithMeta<RotatedWebhookSecret>> {
    return this._connection.call('webhookEndpoints.rotateSecret', [id], params, options) as Promise<
      WithMeta<RotatedWebhookSecret>
    >;
  }

  /**
   * Send a test ping.
   *
   * Requires `webhooks:write`. Sends a `ping` event now and waits up to 10 s for the answer. Works on disabled
   * endpoints; a failed ping is not retried.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  test(id: string, options?: RequestOptions): Promise<WithMeta<WebhookTestResult>> {
    return this._connection.call('webhookEndpoints.test', [id], undefined, options) as Promise<WithMeta<WebhookTestResult>>;
  }
}
