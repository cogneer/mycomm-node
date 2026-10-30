// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  CreatedHostedLink,
  Line,
  LineSenderList,
  LinesCreateParams,
  LinesLinksCreateParams,
  LinesListParams,
  LinesSetSendersParams,
  LinesUpdateParams,
} from '../types.js';

/** `client.lines` */
export class LinesResource {
  readonly links: LinesLinksResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.links = new LinesLinksResource(_connection);
  }

  /**
   * List lines.
   *
   * Requires `channels:read`. Archived lines are hidden unless `archived=true`. A key restricted to lines sees
   * only those.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listLines`
   */
  list(params?: LinesListParams, options?: RequestOptions): Promise<Page<Line>> {
    return this._connection.call('lines.list', [], params, options) as Promise<Page<Line>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.lines.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<LinesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Line> {
    return this._connection.all('lines.list', [], params, options) as AsyncGenerator<Line>;
  }

  /**
   * Create an app line.
   *
   * Requires `channels:write`, which a key restricted to lines never holds. Adds an `app` line that sends through
   * `senders` in order: the first entry is the primary unless one is marked `primary`, which is then placed first
   * (the others keep their order), so the primary always sends first; the others are backups.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createLine`
   */
  create(params: LinesCreateParams, options?: RequestOptions): Promise<WithMeta<Line>> {
    return this._connection.call('lines.create', [], params, options) as Promise<WithMeta<Line>>;
  }

  /**
   * Get a line.
   *
   * Requires `channels:read`. `404` when the line is outside the key's scope.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getLine`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Line>> {
    return this._connection.call('lines.get', [id], undefined, options) as Promise<WithMeta<Line>>;
  }

  /**
   * Update a line.
   *
   * Requires `channels:write`. Every field is optional. `reply_window_days` (1 to 365) is how long a reply on a
   * channel this line wrote from comes back to this line. `settings` keys are merged into the stored settings (a
   * key set to `null` is removed). `409 NAME_TAKEN` `{field: "name"}` when another line of the account has the
   * name (case-insensitive).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateLine`
   */
  update(id: string, params?: LinesUpdateParams, options?: RequestOptions): Promise<WithMeta<Line>> {
    return this._connection.call('lines.update', [id], params, options) as Promise<WithMeta<Line>>;
  }

  /**
   * Archive a line.
   *
   * Requires `channels:write`. Archives the line; nothing is deleted. The Direct line cannot be archived (`422
   * LINE_IS_DIRECT`). Sends from an archived line are refused (`LINE_ARCHIVED`), reply routing skips it and its
   * open conversations move to the Direct line. Keys restricted to it keep read access.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `archiveLine`
   */
  archive(id: string, options?: RequestOptions): Promise<WithMeta<Line>> {
    return this._connection.call('lines.archive', [id], undefined, options) as Promise<WithMeta<Line>>;
  }

  /**
   * Unarchive a line.
   *
   * Requires `channels:write`. Does nothing when the line is not archived. Takes no body. A partner line that was
   * detached stays archived: `409 INVALID_STATE` `{line_id}`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `unarchiveLine`
   */
  unarchive(id: string, options?: RequestOptions): Promise<WithMeta<Line>> {
    return this._connection.call('lines.unarchive', [id], undefined, options) as Promise<WithMeta<Line>>;
  }

  /**
   * List a line's senders.
   *
   * Requires `channels:read`. The sender list in order, with each sender's health now. Not paginated.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listLineSenders`
   */
  listSenders(id: string, options?: RequestOptions): Promise<WithMeta<LineSenderList>> {
    return this._connection.call('lines.listSenders', [id], undefined, options) as Promise<WithMeta<LineSenderList>>;
  }

  /**
   * Replace a line's senders.
   *
   * Requires `channels:write`. Replaces the whole list; the order is the position (0 first). At most one entry is
   * `primary`; with none marked the first entry is. A marked primary is placed first and the others keep their
   * order, so role and position always agree. An entry without a role is a `backup`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `setLineSenders`
   */
  setSenders(id: string, params: LinesSetSendersParams, options?: RequestOptions): Promise<WithMeta<LineSenderList>> {
    return this._connection.call('lines.setSenders', [id], params, options) as Promise<WithMeta<LineSenderList>>;
  }
}

/** `client.lines.links` */
export class LinesLinksResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Create a hosted link for a line.
   *
   * Requires `links:write`. A short-lived link to MyComm's hosted page for one of your lines: send your user's
   * browser to `url`. `purpose` is what the page does: `connect` (the first phone; it also asks for the user's
   * number and joins an account that already has it, after a code sent to that number), `add_channel` (one more
   * SIM, added to the line as its last backup), `replace_device` (a new phone for `replaces_device_id`, a phone of
   * the line's account), `manage` and `claim`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `createLineLink`
   */
  create(id: string, params: LinesLinksCreateParams, options?: RequestOptions): Promise<WithMeta<CreatedHostedLink>> {
    return this._connection.call('lines.links.create', [id], params, options) as Promise<WithMeta<CreatedHostedLink>>;
  }
}
