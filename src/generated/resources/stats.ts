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
   * `group_by=none` every day is present, zeros included, and the response is not paginated.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getDailyStats`
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
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getStatsSummary`
   */
  summary(params: StatsSummaryParams, options?: RequestOptions): Promise<WithMeta<StatsSummary>> {
    return this._connection.call('stats.summary', [], params, options) as Promise<WithMeta<StatsSummary>>;
  }
}
