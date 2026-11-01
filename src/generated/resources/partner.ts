// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  CreatedHostedLink,
  HostedLink,
  PartnerLine,
  PartnerLineStatus,
  PartnerLinesCreateParams,
  PartnerLinesLinksCreateParams,
  PartnerLinesListParams,
  PartnerLinesUpdateParams,
  PartnerLinesVouchParams,
  PartnerSponsorshipDefaultsPutParams,
  PartnerUsageGetParams,
  RecoveryVouch,
  SponsorshipDefaults,
  UsageResponse,
} from '../types.js';

/** `client.partner` */
export class PartnerResource {
  readonly lines: PartnerLinesResource;
  readonly links: PartnerLinksResource;
  readonly sponsorshipDefaults: PartnerSponsorshipDefaultsResource;
  readonly usage: PartnerUsageResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.lines = new PartnerLinesResource(_connection);
    this.links = new PartnerLinksResource(_connection);
    this.sponsorshipDefaults = new PartnerSponsorshipDefaultsResource(_connection);
    this.usage = new PartnerUsageResource(_connection);
  }
}

/** `client.partner.lines` */
export class PartnerLinesResource {
  readonly links: PartnerLinesLinksResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.links = new PartnerLinesLinksResource(_connection);
  }

  /**
   * Get a line's status.
   *
   * Requires `lines:read`. How the line is doing now, computed at the time of the call. `not_connected` until the
   * user's first number is verified on the line; then `connected`, or `needs_attention` with the reasons. You are
   * told of every change by webhook: `line.connected`, `line.needs_attention` and `line.recovered` reach your
   * endpoints that have `partner_lines`, and so does `line.alarm`, once per episode of a condition that needs
   * attention (a failover, no sender, a blocked pool member, a sender near its hourly limit, many messages between
   * the user's own numbers, a low sponsored allowance, unconfirmed messages).
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `getPartnerLineStatus`
   */
  status(id: string, options?: RequestOptions): Promise<WithMeta<PartnerLineStatus>> {
    return this._connection.call('partner.lines.status', [id], undefined, options) as Promise<WithMeta<PartnerLineStatus>>;
  }

  /**
   * List your lines.
   *
   * Requires `lines:read`. Newest first. Archived (detached) lines are left out unless `include_archived=true`, so
   * an `external_ref` filter may then return a detached line beside the live one.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `listPartnerLines`
   */
  list(params?: PartnerLinesListParams, options?: RequestOptions): Promise<Page<PartnerLine>> {
    return this._connection.call('partner.lines.list', [], params, options) as Promise<Page<PartnerLine>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.partner.lines.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<PartnerLinesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<PartnerLine> {
    return this._connection.all('partner.lines.list', [], params, options) as AsyncGenerator<PartnerLine>;
  }

  /**
   * Create a line.
   *
   * Requires `lines:write`. Makes a line for one of your users in a new, empty MyComm account that becomes the
   * user's account when they connect a phone through a hosted link. `user_number` is only a hint for that page: it
   * never joins the line to an account that already has the number (that needs a code sent to the number), and the
   * answer is the same whether or not the number has an account.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `createPartnerLine`
   */
  create(params: PartnerLinesCreateParams, options?: RequestOptions): Promise<WithMeta<PartnerLine>> {
    return this._connection.call('partner.lines.create', [], params, options) as Promise<WithMeta<PartnerLine>>;
  }

  /**
   * Get a line.
   *
   * Requires `lines:read`. Archived lines are returned too. A line of another partner is `404`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `getPartnerLine`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<PartnerLine>> {
    return this._connection.call('partner.lines.get', [id], undefined, options) as Promise<WithMeta<PartnerLine>>;
  }

  /**
   * Change a line.
   *
   * Requires `lines:write`. Changes `name` and `allowed_channel_types`; a field left out or `null` stays as it is.
   * `external_ref` never changes (`422`). A name another line of the account has answers `409 NAME_TAKEN`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `updatePartnerLine`
   */
  update(id: string, params?: PartnerLinesUpdateParams, options?: RequestOptions): Promise<WithMeta<PartnerLine>> {
    return this._connection.call('partner.lines.update', [id], params, options) as Promise<WithMeta<PartnerLine>>;
  }

  /**
   * Detach a line.
   *
   * Requires `lines:write`. Archives the line: its open conversations move to the account's Direct line, and the
   * user keeps the account, its channels, phones and history. `line.detached` is emitted once; detaching an
   * archived line again changes nothing. The line header stops working for it (`403 LINE_CONTEXT_INVALID`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `detachPartnerLine`
   */
  detach(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('partner.lines.detach', [id], undefined, options) as Promise<void>;
  }

  /**
   * Vouch for a recovery request.
   *
   * Requires `lines:write`. Someone asked to recover the account of your line (`line.recovery_requested`), and you
   * know this person. MyComm staff see your answer when they decide. It is never required and never enough alone:
   * nothing changes before the 7-day wait is over and staff approve.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `vouchForRecovery`
   */
  vouch(id: string, params: PartnerLinesVouchParams, options?: RequestOptions): Promise<WithMeta<RecoveryVouch>> {
    return this._connection.call('partner.lines.vouch', [id], params, options) as Promise<WithMeta<RecoveryVouch>>;
  }
}

/** `client.partner.lines.links` */
export class PartnerLinesLinksResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Create a hosted link for a line.
   *
   * Requires `links:write`. A short-lived link to MyComm's hosted page for this line: send your user's browser to
   * `url`. `purpose` is what the page does: `connect` (the first phone; it also asks for the user's number and
   * joins an account that already has it, after a code sent to that number), `add_channel` (one more SIM, added to
   * the line as its last backup), `replace_device` (a new phone for `replaces_device_id`, a phone of the line's
   * account), `manage` and `claim`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `createPartnerLineLink`
   */
  create(id: string, params: PartnerLinesLinksCreateParams, options?: RequestOptions): Promise<WithMeta<CreatedHostedLink>> {
    return this._connection.call('partner.lines.links.create', [id], params, options) as Promise<WithMeta<CreatedHostedLink>>;
  }
}

/** `client.partner.links` */
export class PartnerLinksResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get a hosted link.
   *
   * Requires `lines:read`. The link without `url`; `status` reads `expired` once `expires_at` has passed. A link
   * of another partner's line is `404 NOT_FOUND`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `getPartnerLink`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<HostedLink>> {
    return this._connection.call('partner.links.get', [id], undefined, options) as Promise<WithMeta<HostedLink>>;
  }

  /**
   * Revoke a hosted link.
   *
   * Requires `links:write`. The link stops working at once, also for a page already open. Only an `open` link can
   * be revoked; any other status is `409 INVALID_STATE` with `details.status`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `deletePartnerLink`
   */
  revoke(id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('partner.links.revoke', [id], undefined, options) as Promise<void>;
  }
}

/** `client.partner.sponsorshipDefaults` */
export class PartnerSponsorshipDefaultsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Get your default sponsorship.
   *
   * Requires `lines:read`. The terms a new line gets when `POST /lines` leaves `sponsorship` out; `null` for none.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `getSponsorshipDefaults`
   */
  get(options?: RequestOptions): Promise<WithMeta<SponsorshipDefaults>> {
    return this._connection.call('partner.sponsorshipDefaults.get', [], undefined, options) as Promise<
      WithMeta<SponsorshipDefaults>
    >;
  }

  /**
   * Set your default sponsorship.
   *
   * Requires `lines:write`. Replaces the terms new lines get when `POST /lines` leaves `sponsorship` out; `null`
   * removes them. Lines that already exist keep their own terms. Wrong terms answer `422 VALIDATION_FAILED` naming
   * the field, for example `default_sponsorship.message_allowance.fax`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `setSponsorshipDefaults`
   */
  put(params: PartnerSponsorshipDefaultsPutParams, options?: RequestOptions): Promise<WithMeta<SponsorshipDefaults>> {
    return this._connection.call('partner.sponsorshipDefaults.put', [], params, options) as Promise<
      WithMeta<SponsorshipDefaults>
    >;
  }
}

/** `client.partner.usage` */
export class PartnerUsageResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Usage per line.
   *
   * One row per line of yours, detached lines included (their history stays), sorted by `sent_segments`
   * descending. Counters come from the line's own traffic only, never from the rest of the user's account. Dates
   * are interpreted in each line's account time zone. Counters match the usage reports in the portal; rows and
   * totals add `by_channel_type`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/partner `getPartnerUsage`
   */
  get(params: PartnerUsageGetParams, options?: RequestOptions): Promise<WithMeta<UsageResponse>> {
    return this._connection.call('partner.usage.get', [], params, options) as Promise<WithMeta<UsageResponse>>;
  }
}
