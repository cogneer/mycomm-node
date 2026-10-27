// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  WebhookDeliveriesBulkReplayParams,
  WebhookDeliveriesBulkReplayResponse,
  WebhookDeliveriesListParams,
  WebhookDelivery,
} from '../types.js';

/** `client.webhookDeliveries` */
export class WebhookDeliveriesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List an endpoint's deliveries.
   *
   * Requires `webhooks:write`. Newest first. Filters `status` (`pending`, `failed`, `delivered`, `dead`;
   * comma-separated for several), `event_type`, `event_id`, `created_after` (inclusive) and `created_before`
   * (exclusive). An endpoint outside the caller's scope answers `404 NOT_FOUND`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listWebhookDeliveries`
   */
  list(id: string, params?: WebhookDeliveriesListParams, options?: RequestOptions): Promise<Page<WebhookDelivery>> {
    return this._connection.call('webhookDeliveries.list', [id], params, options) as Promise<Page<WebhookDelivery>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.webhookDeliveries.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(
    id: string,
    params?: Omit<WebhookDeliveriesListParams, 'cursor'>,
    options?: RequestOptions,
  ): AsyncGenerator<WebhookDelivery> {
    return this._connection.all('webhookDeliveries.list', [id], params, options) as AsyncGenerator<WebhookDelivery>;
  }

  /**
   * Bulk replay an endpoint's deliveries.
   *
   * Requires `webhooks:write`. Replays, oldest first and at most 10,000 per call, every delivery of the endpoint
   * in `status` (default `dead`) created inside the optional window. Deliveries whose payload was removed after 30
   * days are skipped.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `replayWebhookDeliveries`
   */
  bulkReplay(
    id: string,
    params?: WebhookDeliveriesBulkReplayParams,
    options?: RequestOptions,
  ): Promise<WithMeta<WebhookDeliveriesBulkReplayResponse>> {
    return this._connection.call('webhookDeliveries.bulkReplay', [id], params, options) as Promise<
      WithMeta<WebhookDeliveriesBulkReplayResponse>
    >;
  }

  /**
   * Get a delivery.
   *
   * Requires `webhooks:write`. `payload` is the exact signed body (`null` after 30 days); `last_response_excerpt`
   * is the first 4 KB of the receiver's last response body.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getWebhookDelivery`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<WebhookDelivery>> {
    return this._connection.call('webhookDeliveries.get', [id], undefined, options) as Promise<WithMeta<WebhookDelivery>>;
  }

  /**
   * Replay a delivery.
   *
   * Requires `webhooks:write`. Re-sends the stored payload now with a fresh signature and timestamp and the same
   * event `id`; status goes back to `pending` and attempts reset. `409 INVALID_STATE` when the payload was removed
   * after 30 days.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `replayWebhookDelivery`
   */
  replay(id: string, options?: RequestOptions): Promise<WithMeta<WebhookDelivery>> {
    return this._connection.call('webhookDeliveries.replay', [id], undefined, options) as Promise<WithMeta<WebhookDelivery>>;
  }
}
