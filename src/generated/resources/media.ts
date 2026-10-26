// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Media, MediaUploadParams } from '../types.js';

/** `client.media` */
export class MediaResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Upload an image.
   *
   * Requires `media:write`. `multipart/form-data` with one part `file` of at most 10 MB. The type is sniffed from
   * the content (`image/jpeg`, `image/png`, `image/gif`, `image/webp`), never taken from the header or the file
   * name. The upload is stored with `purpose: message`; reference its `id` from a message. An upload still
   * unattached after 24 hours is deleted. Rate limit: 60 requests per minute per account.
   *
   * Errors: `413 PAYLOAD_TOO_LARGE` (over 10 MB), `422 MEDIA_TYPE_UNSUPPORTED`, `422 VALIDATION_FAILED` (no `file`
   * part).
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  upload(params: MediaUploadParams, options?: RequestOptions): Promise<WithMeta<Media>> {
    return this._connection.call('media.upload', [], params, options) as Promise<WithMeta<Media>>;
  }

  /**
   * Get a media with a fresh signed URL.
   *
   * Requires `media:write` or `messages:read`. Every call signs a new `url` valid for 15 minutes; inbound MMS
   * media are fetched this way (webhooks carry ids, not URLs). A key restricted to inboxes sees only media of
   * messages in its inboxes, or uploaded with that key; any other media answers `404 NOT_FOUND`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Media>> {
    return this._connection.call('media.get', [id], undefined, options) as Promise<WithMeta<Media>>;
  }
}
