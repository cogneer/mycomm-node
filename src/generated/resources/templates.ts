// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Template,
  TemplateRender,
  TemplateSaved,
  TemplatesCreateParams,
  TemplatesListParams,
  TemplatesPreviewParams,
  TemplatesRenderParams,
  TemplatesUpdateParams,
} from '../types.js';

/** `client.templates` */
export class TemplatesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List templates.
   *
   * Requires `templates:read`. Templates of the account sorted by `name` (default) with cursor pagination.
   * Archived templates are hidden unless `archived=true`, which lists only them.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: TemplatesListParams, options?: RequestOptions): Promise<Page<Template>> {
    return this._connection.call('templates.list', [], params, options) as Promise<Page<Template>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.templates.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<TemplatesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Template> {
    return this._connection.all('templates.list', [], params, options) as AsyncGenerator<Template>;
  }

  /**
   * Create a template.
   *
   * Requires `templates:write`. `body` uses the variable syntax (`{{ name }}`, `{{ name | "fallback" }}`); a
   * syntax error answers `422 TEMPLATE_INVALID` with `details.position`. Names are unique among non-archived
   * templates, ignoring case (`409 NAME_TAKEN`). A body linking through a public URL shortener answers `422
   * LINK_PUBLIC_SHORTENER`, one estimated over 10 SMS parts `422 BODY_TOO_LONG`. Variables that are neither
   * contact nor custom fields are allowed (they must be supplied at send) and listed in `warnings`. `media_id`
   * must be a media item of the account.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: TemplatesCreateParams, options?: RequestOptions): Promise<WithMeta<TemplateSaved>> {
    return this._connection.call('templates.create', [], params, options) as Promise<WithMeta<TemplateSaved>>;
  }

  /**
   * Preview unsaved template text.
   *
   * Requires `templates:read`, and `contacts:read` when `contact_id` is given. The same as render, for a `body`
   * that is not saved. Nothing is written.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  preview(params: TemplatesPreviewParams, options?: RequestOptions): Promise<WithMeta<TemplateRender>> {
    return this._connection.call('templates.preview', [], params, options) as Promise<WithMeta<TemplateRender>>;
  }

  /**
   * Retrieve a template.
   *
   * Requires `templates:read`. Archived templates are returned too.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Template>> {
    return this._connection.call('templates.show', [id], undefined, options) as Promise<WithMeta<Template>>;
  }

  /**
   * Update a template.
   *
   * Requires `templates:write`. Changes `name`, `body`, `category` and `media_id` (`null` detaches the picture)
   * under the rules of create. Messages already accepted keep their rendered body. An archived template answers
   * `422 VALIDATION_FAILED`; restore it first.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: TemplatesUpdateParams, options?: RequestOptions): Promise<WithMeta<TemplateSaved>> {
    return this._connection.call('templates.update', [id], params, options) as Promise<WithMeta<TemplateSaved>>;
  }

  /**
   * Archive a template.
   *
   * Requires `templates:write`. Archives the template (`archived_at` set; sends refuse it with
   * `TEMPLATE_ARCHIVED`). Templates are never hard-deleted through the API, because messages, campaigns and
   * automation rules reference them. Archiving an archived template changes nothing.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  archive(id: string, options?: RequestOptions): Promise<WithMeta<Template>> {
    return this._connection.call('templates.archive', [id], undefined, options) as Promise<WithMeta<Template>>;
  }

  /**
   * Restore an archived template.
   *
   * Requires `templates:write`. Unarchives the template; `409 NAME_TAKEN` while a non-archived template has its
   * name. Send `{}` as the body.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  restore(id: string, options?: RequestOptions): Promise<WithMeta<Template>> {
    return this._connection.call('templates.restore', [id], undefined, options) as Promise<WithMeta<Template>>;
  }

  /**
   * Render a template.
   *
   * Requires `templates:read`, and `contacts:read` when `contact_id` is given (`403 ABILITY_MISSING` otherwise).
   * Renders the saved body exactly as a send renders it for one recipient: `variables` first, then the fields of
   * `contact_id` (a contact of the account), then account fields, then each variable's fallback. A variable
   * without value or fallback renders empty and is listed in `missing_variables`, as a send does. Values are plain
   * text and are never evaluated as template syntax; values over 500 characters are cut to 500. With
   * `shorten_links`, each URL a send would shorten shows as a placeholder link on the active short domain
   * (`https://{domain}/l/xxxxxxx`, the length of a real short link) and counts at that length; with no active
   * short domain links stay as written, as in a send. Smart character replacement follows the account setting
   * `sms.smart_replace`. `non_gsm_characters` lists the characters that force UCS-2. Nothing is written.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  render(id: string, params?: TemplatesRenderParams, options?: RequestOptions): Promise<WithMeta<TemplateRender>> {
    return this._connection.call('templates.render', [id], params, options) as Promise<WithMeta<TemplateRender>>;
  }
}
