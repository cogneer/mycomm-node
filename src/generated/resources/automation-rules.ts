// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  AutomationDryRun,
  AutomationRule,
  AutomationRuleList,
  AutomationRulesCreateParams,
  AutomationRulesReorderParams,
  AutomationRulesTestParams,
  AutomationRulesUpdateParams,
} from '../types.js';

/** `client.automationRules` */
export class AutomationRulesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List the automation rules of an inbox.
   *
   * Requires `automation:read`. All rules of the inbox ordered by `position`, not paginated: the away message
   * first (position 0), then the keyword rules from 1; rules are evaluated by ascending position and the first
   * matching keyword rule wins. A key restricted to inboxes reads only its own inboxes; another inbox, or one of
   * another account, is `404`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(id: string, options?: RequestOptions): Promise<WithMeta<AutomationRuleList>> {
    return this._connection.call('automationRules.list', [id], undefined, options) as Promise<WithMeta<AutomationRuleList>>;
  }

  /**
   * Create an automation rule.
   *
   * Requires `automation:write`, which a key restricted to inboxes never holds (`403 ABILITY_MISSING`). A keyword
   * rule goes to the end of the inbox's keyword rules unless `position` (1 to the number of keyword rules plus
   * one) says otherwise; an `away` rule has no `match`, sits at position 0 and fires outside the inbox's business
   * hours. An inbox holds at most 200 keyword rules and one away rule: a second one is `409 INVALID_STATE`. `422
   * TEMPLATE_ARCHIVED` and `LINK_PUBLIC_SHORTENER` (`details.url`) come from the `reply` actions; `422
   * VALIDATION_FAILED` covers every field, an unknown group or template (also one of another account), a reserved
   * opt-out or opt-in keyword, and any field that is not listed here. Strings, lists and objects have their size
   * limits checked first, so oversized values are `422`, never an error. The body is JSON, at most 128 KB (`413
   * PAYLOAD_TOO_LARGE`, `details.max_bytes`); anything else is `400 MALFORMED_REQUEST`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(id: string, params: AutomationRulesCreateParams, options?: RequestOptions): Promise<WithMeta<AutomationRule>> {
    return this._connection.call('automationRules.create', [id], params, options) as Promise<WithMeta<AutomationRule>>;
  }

  /**
   * Reorder the keyword rules of an inbox.
   *
   * Requires `automation:write`. `rule_ids` names every keyword rule of the inbox exactly once, in the new order
   * (the away rule is not part of it); positions become 1 to n. A missing, repeated, unknown or foreign id is `422
   * VALIDATION_FAILED` and nothing changes. Answers with all rules of the inbox ordered by position.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  reorder(id: string, params: AutomationRulesReorderParams, options?: RequestOptions): Promise<WithMeta<AutomationRuleList>> {
    return this._connection.call('automationRules.reorder', [id], params, options) as Promise<WithMeta<AutomationRuleList>>;
  }

  /**
   * Get an automation rule.
   *
   * Requires `automation:read`. `404` for a rule of another inbox or account and for an inbox outside the key's
   * scope.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, rule_id: string, options?: RequestOptions): Promise<WithMeta<AutomationRule>> {
    return this._connection.call('automationRules.get', [id, rule_id], undefined, options) as Promise<WithMeta<AutomationRule>>;
  }

  /**
   * Update an automation rule.
   *
   * Requires `automation:write`. Only the fields sent change; any field except `type` and `inbox_id`, which are
   * `422 VALIDATION_FAILED` when sent, even with their current value. A `position` moves a keyword rule among the
   * keyword rules of its inbox. The errors of the create call apply to the fields sent.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(
    id: string,
    rule_id: string,
    params?: AutomationRulesUpdateParams,
    options?: RequestOptions,
  ): Promise<WithMeta<AutomationRule>> {
    return this._connection.call('automationRules.update', [id, rule_id], params, options) as Promise<WithMeta<AutomationRule>>;
  }

  /**
   * Delete an automation rule.
   *
   * Requires `automation:write`. The remaining keyword rules keep their order at positions 1 to n. Past runs of
   * the rule are kept.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, rule_id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('automationRules.delete', [id, rule_id], undefined, options) as Promise<void>;
  }

  /**
   * Test a message against the automation of an inbox.
   *
   * Requires `automation:read`. A dry run: the inbox's rules and guards decide what an inbound message with this
   * `body` would do, and nothing is sent, written or logged. `at` (default now) is the instant used for business
   * hours and the guard windows. With `contact_id` the per-conversation guards (loop guard, cooldown) read that
   * contact's conversation in the inbox; without it only the channel cap applies. A guard outcome (`skipped:*`)
   * still names the rule and lists its actions and reply preview, and `outcome` says why nothing would be sent.
   * `no_match` means no rule fits or the message runs no automation at all (an opt-out keyword, for example): no
   * rule, no actions and no preview. A key restricted to inboxes tests only its own inboxes; another inbox, or one
   * of another account, is `404`. The reply preview renders the contact's fields, so a `contact_id` also needs
   * `contacts:read` (`403 ABILITY_MISSING`, checked before the contact is looked up). A `contact_id` that is not a
   * contact of the account is `422 VALIDATION_FAILED`, as is any field not listed here. The body is JSON, at most
   * 128 KB (`413 PAYLOAD_TOO_LARGE`); anything else is `400 MALFORMED_REQUEST`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  test(id: string, params: AutomationRulesTestParams, options?: RequestOptions): Promise<WithMeta<AutomationDryRun>> {
    return this._connection.call('automationRules.test', [id], params, options) as Promise<WithMeta<AutomationDryRun>>;
  }
}
