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
   * name. The upload is stored with `purpose: message`; reference its `id` from a message.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `uploadMedia`
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
   * @see https://mycomm.cogneer.tech/docs/api/public `getMedia`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Media>> {
    return this._connection.call('media.get', [id], undefined, options) as Promise<WithMeta<Media>>;
  }
}
