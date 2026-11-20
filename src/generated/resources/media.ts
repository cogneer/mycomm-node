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
   * Upload a media file.
   *
   * Requires `media:write`. `multipart/form-data` with one part `file`. The type is sniffed from the content,
   * never taken from the header or the file name. Every user may upload images (`image/jpeg`, `image/png`,
   * `image/gif`, `image/webp`) of at most 10 MB; the other types and sizes are those of the channel types the user
   * may use (`GET /v1/channels/types`, `capabilities.media` of each available type), for example WhatsApp video,
   * audio and documents up to their caps.
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
   * media are fetched this way (webhooks carry ids, not URLs). A key restricted to lines sees only media of
   * messages in its lines, or uploaded with that key; any other media answers `404 NOT_FOUND`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getMedia`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Media>> {
    return this._connection.call('media.get', [id], undefined, options) as Promise<WithMeta<Media>>;
  }
}
