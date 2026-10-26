// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Suppression,
  SuppressionCheck,
  SuppressionsCheckParams,
  SuppressionsCreateParams,
  SuppressionsListParams,
  SuppressionsRemoveParams,
} from '../types.js';

/** `client.suppressions` */
export class SuppressionsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List suppressions.
   *
   * Requires `suppressions:read`. The account's suppressed identities, newest first, with cursor pagination.
   * Suppressions belong to the account, not to an inbox: a restricted key sees the whole list. Comma lists match
   * any of the values. A phone number in `address` written without country code is read in the account country.
   * Only `marketing` traffic is blocked by a suppression.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: SuppressionsListParams, options?: RequestOptions): Promise<Page<Suppression>> {
    return this._connection.call('suppressions.list', [], params, options) as Promise<Page<Suppression>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.suppressions.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<SuppressionsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Suppression> {
    return this._connection.all('suppressions.list', [], params, options) as AsyncGenerator<Suppression>;
  }

  /**
   * Suppress a number.
   *
   * Requires `suppressions:write` (never held by a restricted key). `identity_type` defaults to `phone` (the only
   * type in v1) and `reason` to `api`; the API may write `api`, `complaint` or `dnc`. The address is stored in
   * E.164 (a number without country code is read in the account country; one that is not a valid number is `422
   * VALIDATION_FAILED` with `INVALID_NUMBER` on `address`). A new suppression answers `201`, writes a
   * `consent_events` `opt_out` (method `api`) and emits `contact.opted_out`; the identity's queued marketing is
   * cancelled. A number that is already suppressed, for any reason, answers `200` with the existing row unchanged.
   * With the account setting `opt_out.scope: contact`, a number that belongs to a contact suppresses every
   * identity of that contact not suppressed yet, each with its own consent event and `contact.opted_out`, as a
   * STOP reply does; the answer is still the row of the number given.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: SuppressionsCreateParams, options?: RequestOptions): Promise<WithMeta<Suppression>> {
    return this._connection.call('suppressions.create', [], params, options) as Promise<WithMeta<Suppression>>;
  }

  /**
   * Remove a suppression.
   *
   * Requires `suppressions:write`. Deletes the suppression, writes a `consent_events` `opt_in` (method `api`, the
   * note) and emits `contact.opted_in`; the `opt_out` consent event stays (the consent trail is append-only).
   * `consent_note` is required when the suppression's `reason` is `keyword`: without it the answer is `422
   * CONSENT_NOTE_REQUIRED` and the number stays suppressed. `204`. A suppression that is absent or in another
   * account is `404`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  remove(id: string, params?: SuppressionsRemoveParams, options?: RequestOptions): Promise<void> {
    return this._connection.call('suppressions.remove', [id], params, options) as Promise<void>;
  }

  /**
   * Check whether an address is suppressed.
   *
   * Requires `suppressions:read`. `address` is the E.164 number (a number without country code is read in the
   * account country; one that is not a valid number is `422 VALIDATION_FAILED` with `INVALID_NUMBER` on
   * `address`). `identity_type` defaults to `phone`. The answer echoes the normalised address.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  check(params: SuppressionsCheckParams, options?: RequestOptions): Promise<WithMeta<SuppressionCheck>> {
    return this._connection.call('suppressions.check', [], params, options) as Promise<WithMeta<SuppressionCheck>>;
  }
}
