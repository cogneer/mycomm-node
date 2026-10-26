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
   * `rule_id` and `conversation_id` take one value each; `outcome` takes a comma list. `created_after` is
   * inclusive and `created_before` exclusive. A key restricted to inboxes sees only the runs of its own inboxes;
   * filtering on another inbox returns an empty page. A filter value that is not valid is `422 VALIDATION_FAILED`;
   * a cursor from other filters is `400 INVALID_CURSOR`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<AutomationRunsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<AutomationRun> {
    return this._connection.all('automationRuns.list', [], params, options) as AsyncGenerator<AutomationRun>;
  }
}
