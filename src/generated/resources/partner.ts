// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  ApiKey,
  CreatedApiKey,
  ManagedAccount,
  PartnerAccountKeysCreateParams,
  PartnerAccountKeysListParams,
  PartnerAccountsListParams,
  PartnerAccountsProvisionParams,
  PartnerAccountsSuspendParams,
  PartnerAccountsUpdateParams,
  PartnerUsageGetParams,
  UsageResponse,
} from '../types.js';

/** `client.partner` */
export class PartnerResource {
  readonly usage: PartnerUsageResource;
  readonly accounts: PartnerAccountsResource;
  readonly accountKeys: PartnerAccountKeysResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.usage = new PartnerUsageResource(_connection);
    this.accounts = new PartnerAccountsResource(_connection);
    this.accountKeys = new PartnerAccountKeysResource(_connection);
  }
}

/** `client.partner.usage` */
export class PartnerUsageResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Usage across managed accounts.
   *
   * Dates are interpreted in each account's own time zone (as stored in `usage_daily`). Paginated over accounts,
   * sorted by `sent_segments` descending. Counters match the usage reports in the portal; rows and totals add
   * `by_channel_type`. Per-day detail for one account: `GET /v1/stats/daily` acting as it.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(params: PartnerUsageGetParams, options?: RequestOptions): Promise<WithMeta<UsageResponse>> {
    return this._connection.call('partner.usage.get', [], params, options) as Promise<WithMeta<UsageResponse>>;
  }
}

/** `client.partner.accounts` */
export class PartnerAccountsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List managed accounts.
   *
   * A key with `allowed_account_ids` lists only those accounts.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: PartnerAccountsListParams, options?: RequestOptions): Promise<Page<ManagedAccount>> {
    return this._connection.call('partner.accounts.list', [], params, options) as Promise<Page<ManagedAccount>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.partner.accounts.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<PartnerAccountsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<ManagedAccount> {
    return this._connection.all('partner.accounts.list', [], params, options) as AsyncGenerator<ManagedAccount>;
  }

  /**
   * Provision a managed account.
   *
   * Idempotent by `external_ref`. `201` creates a managed account with no users; `channels.auto_connect_sims`
   * defaults to `true`. `200` returns the existing account with this `external_ref` **unchanged**, also when it is
   * `pending_deletion` (the request's other fields are ignored; use `PATCH`). Concurrent duplicates resolve to one
   * account. Keys with `allowed_account_ids` get `403 PARTNER_KEY_RESTRICTED`; read-only keys `403
   * ABILITY_MISSING`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  provision(params: PartnerAccountsProvisionParams, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.provision', [], params, options) as Promise<WithMeta<ManagedAccount>>;
  }

  /**
   * Get a managed account.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.get', [id], undefined, options) as Promise<WithMeta<ManagedAccount>>;
  }

  /**
   * Update a managed account.
   *
   * `settings` is deep-merged with the rules of `PATCH /v1/account`, plus `limits.max_daily_segments` and
   * `channels.allowed_types`, which only the partner may set. The new `name` appears in the paired app. A taken
   * `external_ref` is `409 EXTERNAL_REF_TAKEN`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: PartnerAccountsUpdateParams, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.update', [id], params, options) as Promise<WithMeta<ManagedAccount>>;
  }

  /**
   * Schedule deletion of a managed account.
   *
   * Cancels queued messages and unfinished campaigns first, then revokes devices and account keys and disconnects
   * channels. Emits `account.deletion_scheduled`. `reactivate` before `purge_at` (14 days) restores the data.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.delete', [id], undefined, options) as Promise<WithMeta<ManagedAccount>>;
  }

  /**
   * Suspend a managed account.
   *
   * `status: suspended`; `/v1` writes then get `403 ACCOUNT_SUSPENDED`. Emits `account.suspended`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  suspend(id: string, params: PartnerAccountsSuspendParams, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.suspend', [id], params, options) as Promise<WithMeta<ManagedAccount>>;
  }

  /**
   * Reactivate a managed account.
   *
   * From `suspended`, or from `pending_deletion` before `purge_at`. Emits `account.reactivated`. A suspension set
   * by MyComm support or a kill switch is not lifted by a partner (409 SUSPENDED_BY_SUPPORT).
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  reactivate(id: string, options?: RequestOptions): Promise<WithMeta<ManagedAccount>> {
    return this._connection.call('partner.accounts.reactivate', [id], undefined, options) as Promise<WithMeta<ManagedAccount>>;
  }
}

/** `client.partner.accountKeys` */
export class PartnerAccountKeysResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List a managed account's keys.
   *
   * The same resource as `GET /v1/api-keys`. The token is never returned here.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(id: string, params?: PartnerAccountKeysListParams, options?: RequestOptions): Promise<Page<ApiKey>> {
    return this._connection.call('partner.accountKeys.list', [id], params, options) as Promise<Page<ApiKey>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.partner.accountKeys.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(id: string, params?: Omit<PartnerAccountKeysListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<ApiKey> {
    return this._connection.all('partner.accountKeys.list', [id], params, options) as AsyncGenerator<ApiKey>;
  }

  /**
   * Mint an account key for a managed account.
   *
   * Same body and `201` response as `POST /v1/api-keys`, unrestricted or restricted to inboxes or channel types,
   * with any abilities. The `token` is shown once, in this response.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(id: string, params: PartnerAccountKeysCreateParams, options?: RequestOptions): Promise<WithMeta<CreatedApiKey>> {
    return this._connection.call('partner.accountKeys.create', [id], params, options) as Promise<WithMeta<CreatedApiKey>>;
  }

  /**
   * Revoke a managed account's key.
   *
   * Revokes immediately; the key's next call is `401`. Revoking a revoked key is a no-op.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  revoke(id: string, key_id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('partner.accountKeys.revoke', [id, key_id], undefined, options) as Promise<void>;
  }
}
