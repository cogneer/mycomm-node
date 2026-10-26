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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ImportsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Import> {
    return this._connection.all('imports.list', [], params, options) as AsyncGenerator<Import>;
  }

  /**
   * Upload an import.
   *
   * The required ability depends on `type`: `contacts_csv` needs `contacts:write`, `suppressions_csv` needs
   * `suppressions:write`. `multipart/form-data` with `type`, `file` (CSV UTF-8 with a header row, at most 20 MB
   * and 200,000 rows) and `options`, a JSON string. For `contacts_csv`, `options.mapping` maps a column to
   * `phone`, `first_name`, `last_name`, `full_name` (split at the last space), `email`, `timezone`, `language`,
   * `group` or `custom.<key>`; `existing` is `fill_empty` (default), `overwrite` or `skip`; `consent_assertion` is
   * `{asserted: true, source}`. For `suppressions_csv`, `options.mapping` must map one column to `phone`; `reason`
   * is `import` (default) or `dnc`. The import goes straight from `uploaded` to `queued`; poll `GET
   * /v1/imports/{id}` or wait for the `import.completed` / `import.failed` webhook. The file is private data and
   * is never logged.
   *
   * Errors: `422 VALIDATION_FAILED` (unknown `type`, bad `options`, a CSV that is empty, too large, too long or
   * unreadable), `403 ABILITY_MISSING`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: ImportsCreateParams, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.create', [], params, options) as Promise<WithMeta<Import>>;
  }

  /**
   * Upload an import.
   *
   * The required ability depends on `type`: `contacts_csv` needs `contacts:write`, `suppressions_csv` needs
   * `suppressions:write`. `multipart/form-data` with `type`, `file` (CSV UTF-8 with a header row, at most 20 MB
   * and 200,000 rows) and `options`, a JSON string. For `contacts_csv`, `options.mapping` maps a column to
   * `phone`, `first_name`, `last_name`, `full_name` (split at the last space), `email`, `timezone`, `language`,
   * `group` or `custom.<key>`; `existing` is `fill_empty` (default), `overwrite` or `skip`; `consent_assertion` is
   * `{asserted: true, source}`. For `suppressions_csv`, `options.mapping` must map one column to `phone`; `reason`
   * is `import` (default) or `dnc`. The import goes straight from `uploaded` to `queued`; poll `GET
   * /v1/imports/{id}` or wait for the `import.completed` / `import.failed` webhook. The file is private data and
   * is never logged.
   *
   * Errors: `422 VALIDATION_FAILED` (unknown `type`, bad `options`, a CSV that is empty, too large, too long or
   * unreadable), `403 ABILITY_MISSING`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  cancel(id: string, options?: RequestOptions): Promise<WithMeta<Import>> {
    return this._connection.call('imports.cancel', [id], undefined, options) as Promise<WithMeta<Import>>;
  }
}
