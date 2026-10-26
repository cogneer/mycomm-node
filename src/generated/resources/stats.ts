// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { StatsDailyParams, StatsDailyResponse, StatsSummary, StatsSummaryParams } from '../types.js';

/** `client.stats` */
export class StatsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Daily counters.
   *
   * Requires `reports:read`. Counters per calendar day in the account time zone, from `usage_daily`. `from` and
   * `to` are inclusive and span at most 366 days (`422 RANGE_TOO_LARGE`, details `{max_days: 366}`). With
   * `group_by=none` every day is present, zeros included, and the response is not paginated. Grouped results
   * contain rows only where there was traffic, ordered by `date` then the group key, and are paginated with
   * `cursor`. A key restricted to inboxes sees its inboxes only and may group by `none` or `inbox`; other values
   * give `VALIDATION_FAILED`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  daily(params: StatsDailyParams, options?: RequestOptions): Promise<WithMeta<StatsDailyResponse>> {
    return this._connection.call('stats.daily', [], params, options) as Promise<WithMeta<StatsDailyResponse>>;
  }

  /**
   * Period summary and live state.
   *
   * Requires `reports:read`. One call for a dashboard header. `totals` are sums of `usage_daily` over the
   * inclusive range (calendar days in the account time zone, at most 366 days: `422 RANGE_TOO_LARGE`, details
   * `{max_days: 366}`). `delivery_rate` is delivered over sent on channels with delivery reports; `read_rate` is
   * `null` when the account has no read-capable channel; a rate is `null` when there is nothing to divide by.
   * `failures_by_code` counts outbound messages whose `failed_at` falls in the range. `queue_now`, `channels` and
   * `devices` are current counts. A key restricted to inboxes gets figures for its inboxes, channels and devices
   * only.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  summary(params: StatsSummaryParams, options?: RequestOptions): Promise<WithMeta<StatsSummary>> {
    return this._connection.call('stats.summary', [], params, options) as Promise<WithMeta<StatsSummary>>;
  }
}
