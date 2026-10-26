// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Channel,
  ChannelTypeInfo,
  ChannelsConnectSimParams,
  ChannelsCreateParams,
  ChannelsListParams,
  ChannelsUpdateParams,
  ChannelsUpdateRatePolicyParams,
  ChannelsVerifyParams,
} from '../types.js';

/** `client.channels` */
export class ChannelsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get a channel.
   *
   * Requires `channels:read`. The full state of a number: status, the resolved `capabilities`, the rate policy
   * with its suggestion and ceiling, warm-up, the SIM safety score, the queue and rolling usage counts and the
   * latest verification. `404` when the channel is outside the key's scope.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.get', [id], undefined, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * Update the settings of a channel.
   *
   * Requires `channels:write`; a key restricted to inboxes never holds it. Changes only the keys sent.
   * `allowed_destination_countries` is `null` (the channel's own country only, the default) or a list of ISO
   * 3166-1 alpha-2 codes that must contain the channel's own country, else `422 VALIDATION_FAILED`; codes are
   * stored upper case. Adding another country is an explicit opt-in on the number and is audited as
   * `channel.destinations.updated`. `skip_business_senders: true` makes the phone stop uploading inbound from
   * short codes and alphanumeric senders (operator-notice senders are always uploaded). `404` when the channel is
   * not found in the account.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: ChannelsUpdateParams, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.update', [id], params, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * Pause a channel.
   *
   * Requires `channels:write`. `active` → `paused` with `pause_reason: owner`. Messages are still accepted and
   * wait until the channel is resumed. Emits `channel.paused`. A channel in any other state is `409 INVALID_STATE`
   * with `allowed_from: [active]`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  pause(id: string, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.pause', [id], undefined, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * Resume a paused channel.
   *
   * Requires `channels:write`. `paused` → `active` for `pause_reason` `owner`, `auto:failure_streak` and
   * `auto:quota` (after the SIM was recharged); `auto:health_critical` also once the SIM safety band is back to
   * `fair` or better. `auto:sim_missing` and `device_revoked` resume through the SIM returning or re-verification,
   * `auto:quarantine` through a successful test message or MyComm support, `admin` and `account_suspended` only
   * through MyComm: these answer `409 INVALID_STATE` with the channel's `status`, as does a channel that is not
   * paused. Emits `channel.resumed`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  resume(id: string, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.resume', [id], undefined, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * Disconnect a channel.
   *
   * Requires `channels:write`. → `disconnected` with `disconnect_reason: owner`; the number is released for use
   * elsewhere, queued outbound messages fail with `CHANNEL_DISCONNECTED`, inboxes and history stay readable and
   * sends get `CHANNEL_INACTIVE`. Emits `channel.disconnected`. A `pending_verification` channel that never
   * connected is deleted instead (`204`). An already disconnected channel is `409 INVALID_STATE`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  disconnect(id: string, options?: RequestOptions): Promise<WithMeta<Channel> | null> {
    return this._connection.call('channels.disconnect', [id], undefined, options) as Promise<WithMeta<Channel> | null>;
  }

  /**
   * Connect a SIM.
   *
   * Requires `channels:write`. Creates a channel in `pending_verification` for the SIM and asks the person holding
   * the phone to confirm the connection; while the prompt is open `verification.step` is `awaiting_confirmation`
   * and `verification.confirmation.status` is `pending`. After the tap the phone texts a 6-digit code to the
   * number and catches it. The outcome arrives as `channel.connected` or `channel.verification_failed` and on `GET
   * /v1/channels/{id}`. `address` is optional when the SIM reports its number or the platform's inbound probe is
   * configured; otherwise `422 ADDRESS_REQUIRED`. A number already active on a channel of the same account is
   * moved to this SIM when verification succeeds. `404` when the phone or SIM is not found in the account or
   * outside the key's scope.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  connectSim(
    id: string,
    sim_id: string,
    params?: ChannelsConnectSimParams,
    options?: RequestOptions,
  ): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.connectSim', [id, sim_id], params, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * Retry the verification of a channel.
   *
   * Requires `channels:write`. Retries the verification of a `pending_verification` channel: a new attempt after a
   * failed one, or a new verification after a `failed` or `expired` one, optionally with a corrected `address`. An
   * attempt that is still running is left as it is. It also re-verifies a channel paused with `auto:sim_missing`
   * on the SIM now in its phone; the channel keeps its number and stays paused until the verification succeeds. A
   * channel in any other state is `409 INVALID_STATE`. The checks are those of connect. `422
   * VERIFICATION_LIMIT_REACHED` says in `retry_after_seconds` when to try again.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  verify(id: string, params?: ChannelsVerifyParams, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.verify', [id], params, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * List channels.
   *
   * Requires `channels:read`. Every channel of the account whatever its status, oldest first, unless a filter
   * narrows the list. `health_band` filters on the stored SIM safety band, so a number that was never evaluated
   * matches no band. A key restricted to inboxes sees only the channels of those inboxes.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: ChannelsListParams, options?: RequestOptions): Promise<Page<Channel>> {
    return this._connection.call('channels.list', [], params, options) as Promise<Page<Channel>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.channels.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ChannelsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Channel> {
    return this._connection.all('channels.list', [], params, options) as AsyncGenerator<Channel>;
  }

  /**
   * Connect a push channel.
   *
   * Requires `channels:write`. Connecting a push channel (WhatsApp, Telegram) is part of v2; v1 answers `422
   * CHANNEL_TYPE_NOT_ALLOWED` to every request, whatever its body. A SIM is connected with `POST
   * /v1/devices/{id}/sims/{sim_id}/connect`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params?: ChannelsCreateParams, options?: RequestOptions): Promise<Record<string, unknown>> {
    return this._connection.call('channels.create', [], params, options) as Promise<Record<string, unknown>>;
  }

  /**
   * Get the connect state of a push channel.
   *
   * Requires `channels:read`. In v2 this returns the current QR code or pairing code of a connecting WhatsApp
   * channel. A SIM channel has none, so v1 answers `404 NOT_FOUND` for every channel.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  connectState(id: string, options?: RequestOptions): Promise<Record<string, unknown>> {
    return this._connection.call('channels.connectState', [id], undefined, options) as Promise<Record<string, unknown>>;
  }

  /**
   * Update the rate policy of a channel.
   *
   * Requires `channels:write`; a key restricted to inboxes never holds it. Sent keys are merged into the current
   * policy (nested objects key by key; a key sent as `null` clears it where the field allows `null`) and
   * `rate_policy_source` becomes `custom`. `{"reset_to_suggested": true}` restores the suggestion
   * (`rate_policy_source: suggested`) and clears the acknowledgement; it cannot be combined with policy fields. A
   * body that changes nothing is `422 VALIDATION_FAILED`.
   *
   * Checks run in this order and the first failure answers:
   *
   * 1. Shape and field bounds, `422 VALIDATION_FAILED`: every cap at least 1 and `per_min <= per_15m <= per_hour
   * <= per_day`, `interval_ms.min >= 60000 / ceiling.per_min`, `interval_ms.max` between `min` and 600000,
   * `bulk_hours` within 07:00 to 22:00 sender-local. 2. Every cap at or below the channel's `rate_policy_ceiling`,
   * else `422 ABOVE_PLATFORM_CEILING` with `{field, value, ceiling, reason}` (`platform`, `country`,
   * `override_limit`, `new_account` or `restricted_country`). During the first 14 days of the account the
   * suggestion is also the shortest wait allowed: `interval_ms.min` below the suggested shortest wait, or
   * `interval_ms.max` below the suggested longest wait, answers `422 ABOVE_PLATFORM_CEILING` with `reason:
   * new_account`; for these two fields `value` and `ceiling` are waits in milliseconds and `ceiling` is the
   * shortest wait allowed. A cap above its ceiling is answered first. Acknowledging the risk never lifts a
   * ceiling. After day 14 only step 1 limits a wait. `rate_policy_ceiling` itself holds caps only. 3. The risk of
   * the result: saving `amber` or `red` needs `acknowledge_risk: true`, again whenever the risk rises above the
   * acknowledged level, else `422 RISK_ACKNOWLEDGEMENT_REQUIRED` with `{risk, exceeds}`.
   *
   * Saving sets `acknowledged_risk_at` and is audited as `channel.rate_policy.updated`. While the SIM safety band
   * is `poor` or `critical` a custom policy is also capped at the suggestion times the band factor; the stored
   * policy is unchanged and applies again when the band recovers. `404` when the channel is not found in the
   * account.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  updateRatePolicy(id: string, params?: ChannelsUpdateRatePolicyParams, options?: RequestOptions): Promise<WithMeta<Channel>> {
    return this._connection.call('channels.updateRatePolicy', [id], params, options) as Promise<WithMeta<Channel>>;
  }

  /**
   * List channel types.
   *
   * Requires `channels:read`. Every channel type with what this account can connect and what each type can do, so
   * a partner UI adapts without hard-coding SMS. `available` is `true` when the type is enabled on the platform
   * and allowed by the account's `settings.channels.allowed_types`; a type that has not shipped yet carries
   * `available_from`. In v1 only `android_sim` is available. The list is about the account, not an inbox, so a key
   * restricted to inboxes gets the full answer. Not paginated.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  types(options?: RequestOptions): Promise<Page<ChannelTypeInfo>> {
    return this._connection.call('channels.types', [], undefined, options) as Promise<Page<ChannelTypeInfo>>;
  }
}
