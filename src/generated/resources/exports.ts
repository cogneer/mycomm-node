// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Export, ExportsCreateParams, ExportsListParams } from '../types.js';

/** `client.exports` */
export class ExportsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List exports.
   *
   * Requires the ability of at least one export type; the list holds only the exports of types the key may
   * request, newest first. List rows carry no signed download URL: `url` and `url_expires_at` are `null` here,
   * even for a `completed` export. Fetch the export with `GET /v1/exports/{id}` to get a `url` signed for 15
   * minutes.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: ExportsListParams, options?: RequestOptions): Promise<Page<Export>> {
    return this._connection.call('exports.list', [], params, options) as Promise<Page<Export>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.exports.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ExportsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Export> {
    return this._connection.all('exports.list', [], params, options) as AsyncGenerator<Export>;
  }

  /**
   * Request an export.
   *
   * The required ability depends on `type`: `messages_csv` needs `reports:read`, `contacts_csv` and `contact_json`
   * need `contacts:read`, `campaign_report` needs `campaigns:read`, `account_zip` needs `account:write`.
   * `messages_csv` takes the `GET /v1/messages` filters as `params`; `created_after` and `created_before` are
   * required and at most 366 days apart. A key restricted to inboxes exports only its inboxes. The export is built
   * asynchronously: poll `GET /v1/exports/{id}` or wait for the `export.completed` webhook.
   *
   * Errors: `422 VALIDATION_FAILED` (unknown `type` or invalid `params`), `403 ABILITY_MISSING`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: ExportsCreateParams, options?: RequestOptions): Promise<WithMeta<Export>> {
    return this._connection.call('exports.create', [], params, options) as Promise<WithMeta<Export>>;
  }

  /**
   * Get an export with a fresh signed URL.
   *
   * Requires the ability of the export's type. A `completed` export carries a `url` signed for 15 minutes,
   * refreshed on every call; the URL is a secret. An export of another account answers `404 NOT_FOUND`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Export>> {
    return this._connection.call('exports.get', [id], undefined, options) as Promise<WithMeta<Export>>;
  }
}
