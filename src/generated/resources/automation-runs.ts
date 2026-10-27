// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { AutomationRun, AutomationRunsListParams } from '../types.js';

/** `client.automationRuns` */
export class AutomationRunsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List automation runs.
   *
   * Requires `automation:read`. The automation log: one run per evaluation that chose a rule, newest first
   * (`sort=-created_at`, ties by `id`), with cursor pagination. `inbox_id` is the rule's inbox. `inbox_id`,
   * `rule_id` and `conversation_id` take one value each; `outcome` takes a comma list.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listAutomationRuns`
   */
  list(params?: AutomationRunsListParams, options?: RequestOptions): Promise<Page<AutomationRun>> {
    return this._connection.call('automationRuns.list', [], params, options) as Promise<Page<AutomationRun>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.automationRuns.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<AutomationRunsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<AutomationRun> {
    return this._connection.all('automationRuns.list', [], params, options) as AsyncGenerator<AutomationRun>;
  }
}
