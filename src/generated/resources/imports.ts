// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Import, ImportsCreateFromFileParams, ImportsCreateParams, ImportsListParams } from '../types.js';

/** `client.imports` */
export class ImportsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List imports.
   *
   * Requires `contacts:read`. Newest first.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listImports`
   */
  list(params?: ImportsListParams, options?: RequestOptions): Promise<Page<Import>> {
    return this._connection.call('imports.list', [], params, options) as Promise<Page<Import>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.imports.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<ImportsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Import> {
    return this._connection.all('imports.list', [], params, options) as AsyncGenerator<Import>;
  }

  /**
   * Upload an import.
   *
   * The required ability depends on `type`: `contacts_csv` needs `contacts:write`, `suppressions_csv` needs
   * `suppressions:write`. `multipart/form-data` with `type`, `file` (CSV UTF-8 with a header row, at most 20 MB
   * and 200,000 rows) and `options`, a JSON string.<key>`; `existing` is `fill_empty` (default), `overwrite` or
   * `skip`; `consent_assertion` is `{asserted: true, source}`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createImport`
   */
  create(params: ImportsCreateParams, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.create', [], params, options) as Promise<WithMeta<Import>>;
  }

  /**
   * Upload an import.
   *
   * The required ability depends on `type`: `contacts_csv` needs `contacts:write`, `suppressions_csv` needs
   * `suppressions:write`. `multipart/form-data` with `type`, `file` (CSV UTF-8 with a header row, at most 20 MB
   * and 200,000 rows) and `options`, a JSON string.<key>`; `existing` is `fill_empty` (default), `overwrite` or
   * `skip`; `consent_assertion` is `{asserted: true, source}`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createImport`
   */
  createFromFile(params: ImportsCreateFromFileParams, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.createFromFile', [], params, options) as Promise<WithMeta<Import>>;
  }

  /**
   * Get an import.
   *
   * Requires `contacts:read`. Carries the totals and, once an error report exists, `error_report_url` signed for
   * 15 minutes and refreshed on every call (the URL is a secret). An import of another account answers `404
   * NOT_FOUND`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getImport`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.get', [id], undefined, options) as Promise<WithMeta<Import>>;
  }

  /**
   * Cancel an import.
   *
   * Requires the ability of the import's type. An import that is `awaiting_device_confirmation` (`phone_history`),
   * `queued` or `running` becomes `cancelled`; rows already written stay. An import in any other state answers
   * `409 INVALID_STATE`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `cancelImport`
   */
  cancel(id: string, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.cancel', [id], undefined, options) as Promise<WithMeta<Import>>;
  }
}
