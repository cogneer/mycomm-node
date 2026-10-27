// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Campaign,
  CampaignEstimate,
  CampaignRecipient,
  CampaignReport,
  CampaignsCreateParams,
  CampaignsListParams,
  CampaignsRecipientsListParams,
  CampaignsStartParams,
  CampaignsUpdateParams,
} from '../types.js';

/** `client.campaigns` */
export class CampaignsResource {
  readonly recipients: CampaignsRecipientsResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.recipients = new CampaignsRecipientsResource(_connection);
  }

  /**
   * Campaign report.
   *
   * Requires `campaigns:read`. The aggregate report of a campaign, live while it runs and after it ends. `stats`
   * is `campaigns.stats`. Rates use `stats.sent` as denominator (`delivery_rate` = delivered / sent, `click_rate`
   * = unique clicks / sent) and are `null` while nothing was sent.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getCampaignReport`
   */
  report(id: string, options?: RequestOptions): Promise<WithMeta<CampaignReport>> {
    return this._connection.call('campaigns.report', [id], undefined, options) as Promise<WithMeta<CampaignReport>>;
  }

  /**
   * List campaigns.
   *
   * Requires `campaigns:read`. Campaigns of the account, newest first (`sort=-created_at`, the only sort), with
   * cursor pagination. An item carries no `audience.addresses`; read the campaign for them. A key limited to some
   * inboxes never holds `campaigns:read` and answers `403 ABILITY_MISSING`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listCampaigns`
   */
  list(params?: CampaignsListParams, options?: RequestOptions): Promise<Page<Campaign>> {
    return this._connection.call('campaigns.list', [], params, options) as Promise<Page<Campaign>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.campaigns.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<CampaignsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Campaign> {
    return this._connection.all('campaigns.list', [], params, options) as AsyncGenerator<Campaign>;
  }

  /**
   * Create a draft campaign.
   *
   * Requires `campaigns:write`. Creates a `draft`: `body` or `template_id` (a copy), the audience (`group_ids`,
   * `smart_list_ids`, `import_id` of a contacts CSV import, and at most 10,000 `addresses`), defaults for
   * `category` (`marketing`), `append_opt_out_text` (`true` for marketing), `shorten_links` and `track_clicks`
   * (`true`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createCampaign`
   */
  create(params: CampaignsCreateParams, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.create', [], params, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Retrieve a campaign.
   *
   * Requires `campaigns:read`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getCampaign`
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.show', [id], undefined, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Update a draft campaign.
   *
   * Requires `campaigns:write`. Any create field, while the campaign is a `draft`; a field that is absent keeps
   * its value. An `audience` given in part changes only the keys it names (a CSV `import_id` stays unless the call
   * sets it; a new one is attached as on create, the same one again changes nothing, and an attached CSV cannot be
   * removed).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateCampaign`
   */
  update(id: string, params?: CampaignsUpdateParams, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.update', [id], params, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Delete a draft campaign.
   *
   * Requires `campaigns:write`. A `draft` only; any other status answers `409 INVALID_STATE`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `deleteCampaign`
   */
  delete(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('campaigns.delete', [id], undefined, options) as Promise<void>;
  }

  /**
   * Estimate a campaign.
   *
   * Requires `campaigns:read`. Expands the audience without saving anything and returns the review figures:
   * recipients, skips, segments, start and finish time, warnings and the other review counts. Exact figures come
   * after the start expands the audience. `503 SERVICE_UNAVAILABLE` when a smart list of the audience cannot be
   * counted in time.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `estimateCampaign`
   */
  estimate(id: string, options?: RequestOptions): Promise<WithMeta<CampaignEstimate>> {
    return this._connection.call('campaigns.estimate', [id], undefined, options) as Promise<WithMeta<CampaignEstimate>>;
  }

  /**
   * Start or schedule a campaign.
   *
   * Requires `campaigns:write`. From `draft`: `scheduled` when `scheduled_at` is in the future
   * (`campaign.scheduled`), else `running` (the audience is expanded then, `campaign.started`). From `scheduled`:
   * no `scheduled_at` (or a past one) runs it now, a new future time reschedules it.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `startCampaign`
   */
  start(id: string, params?: CampaignsStartParams, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.start', [id], params, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Unschedule a campaign.
   *
   * Requires `campaigns:write`. `scheduled` back to `draft` with `scheduled_at` cleared (`campaign.unscheduled`);
   * edit it, then start it again. `409 INVALID_STATE` from any other status.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `unscheduleCampaign`
   */
  unschedule(id: string, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.unschedule', [id], undefined, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Pause a campaign.
   *
   * Requires `campaigns:write`. `running` to `paused`: feeding stops and campaign messages still `queued` are held
   * (`hold_reason: campaign_paused`); messages already on the phone complete. `409 INVALID_STATE` from any other
   * status.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `pauseCampaign`
   */
  pause(id: string, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.pause', [id], undefined, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Resume a campaign.
   *
   * Requires `campaigns:write`. `paused` to `running`; held messages are released. `409 INVALID_STATE` from any
   * other status. While the account is frozen the campaign stays paused and the call answers `422
   * ACCOUNT_THROTTLED` with `details.risk_state: frozen`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `resumeCampaign`
   */
  resume(id: string, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.resume', [id], undefined, options) as Promise<WithMeta<Campaign>>;
  }

  /**
   * Cancel a campaign.
   *
   * Requires `campaigns:write`. `draft`, `scheduled`, `running` or `paused` to `cancelled`. Pending recipients and
   * queued campaign messages become `cancelled` (`message.cancelled`, reason `campaign_cancelled`). `409
   * INVALID_STATE` from `completed` or `cancelled`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `cancelCampaign`
   */
  cancel(id: string, options?: RequestOptions): Promise<WithMeta<Campaign>> {
    return this._connection.call('campaigns.cancel', [id], undefined, options) as Promise<WithMeta<Campaign>>;
  }
}

/** `client.campaigns.recipients` */
export class CampaignsRecipientsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List the recipients of a campaign.
   *
   * Requires `campaigns:read`. The per-recipient results of a campaign, oldest first (`sort=created_at`), with
   * cursor pagination. Each filter takes one value. A campaign of another account answers `404`. A key limited to
   * some inboxes never holds `campaigns:read` and answers `403 ABILITY_MISSING`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listCampaignRecipients`
   */
  list(id: string, params?: CampaignsRecipientsListParams, options?: RequestOptions): Promise<Page<CampaignRecipient>> {
    return this._connection.call('campaigns.recipients.list', [id], params, options) as Promise<Page<CampaignRecipient>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.campaigns.recipients.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(
    id: string,
    params?: Omit<CampaignsRecipientsListParams, 'cursor'>,
    options?: RequestOptions,
  ): AsyncGenerator<CampaignRecipient> {
    return this._connection.all('campaigns.recipients.list', [id], params, options) as AsyncGenerator<CampaignRecipient>;
  }
}
