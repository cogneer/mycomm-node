// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Message,
  MessageEvent,
  MessagesListParams,
  MessagesRetryParams,
  MessagesSendBatchParams,
  MessagesSendParams,
  SendBatchResponse,
  SendMessageDryRunResponse,
  SendMessageResponse,
} from '../types.js';

/** `client.messages` */
export class MessagesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Cancel a message.
   *
   * Cancels a `queued` message, held and scheduled ones included. Requires `messages:send`. Answers `200` with the
   * message in `status: cancelled`. A `leased` message is already on the phone, so the call is a best-effort
   * cancel request: `202` with the message still `leased` and `cancel_requested_at` set; the phone's later report
   * decides the outcome.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `cancelMessage`
   */
  cancel(id: string, options?: RequestOptions): Promise<WithMeta<Message>> {
    return this._connection.call('messages.cancel', [id], undefined, options) as Promise<WithMeta<Message>>;
  }

  /**
   * Retry a message.
   *
   * Re-queues the same message (same id, `reference_id` and conversation position) from `failed` or `expired`.
   * Requires `messages:send`. `attempts` is reset, the failure fields are cleared and `expires_at` is set to now
   * plus the lane default. Compliance and channel and account state are checked again.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `retryMessage`
   */
  retry(id: string, params?: MessagesRetryParams, options?: RequestOptions): Promise<WithMeta<Message>> {
    return this._connection.call('messages.retry', [id], params, options) as Promise<WithMeta<Message>>;
  }

  /**
   * Send up to 1,000 messages.
   *
   * Sends 1-1,000 messages in one call. Requires `messages:send`. Each item has the fields of `POST /v1/messages`
   * except `dry_run`; `defaults` supplies any field an item omits and the item's value wins. `category` is
   * required on every item, in the item or in `defaults` (there is no implicit `transactional` here).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `sendMessageBatch`
   */
  sendBatch(params: MessagesSendBatchParams, options?: RequestOptions): Promise<WithMeta<SendBatchResponse>> {
    return this._connection.call('messages.sendBatch', [], params, options) as Promise<WithMeta<SendBatchResponse>>;
  }

  /**
   * List and search messages.
   *
   * Messages of the account, newest first, with cursor pagination. Requires `messages:read`. A restricted key
   * lists only the messages of its inboxes. Comma lists match any of the values. `q` is a full-text search on
   * `body` (at least 2 characters, Postgres `simple` configuration, so Urdu and Roman Urdu match word by word) and
   * always sorts newest first.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listMessages`
   */
  list(params?: MessagesListParams, options?: RequestOptions): Promise<Page<Message>> {
    return this._connection.call('messages.list', [], params, options) as Promise<Page<Message>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.messages.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<MessagesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Message> {
    return this._connection.all('messages.list', [], params, options) as AsyncGenerator<Message>;
  }

  /**
   * Send one message.
   *
   * Queues one message. Requires `messages:send`. The inbox decides the channel: give `inbox_id`, `channel_id` or
   * `from` (the key's single inbox is used when it is restricted to exactly one). The recipient is `to` or
   * `contact_id`. The content is the `content` union or one of the shorthand fields (`body`, `media_ids`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `sendMessage`
   */
  send(params: MessagesSendParams & { dry_run?: false }, options?: RequestOptions): Promise<WithMeta<SendMessageResponse>>;
  /**
   * Send one message.
   *
   * Queues one message. Requires `messages:send`. The inbox decides the channel: give `inbox_id`, `channel_id` or
   * `from` (the key's single inbox is used when it is restricted to exactly one). The recipient is `to` or
   * `contact_id`. The content is the `content` union or one of the shorthand fields (`body`, `media_ids`).
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `sendMessage`
   */
  send(params: MessagesSendParams & { dry_run: true }, options?: RequestOptions): Promise<WithMeta<SendMessageDryRunResponse>>;
  send(
    params?: MessagesSendParams,
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>>;
  send(
    params?: MessagesSendParams,
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>> {
    return this._connection.call('messages.send', [], params, options) as Promise<
      WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>
    >;
  }

  /**
   * Retrieve a message.
   *
   * Returns the message resource, inbound or outbound. Requires `messages:read`. A message outside the key's inbox
   * scope answers 404.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getMessage`
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Message>> {
    return this._connection.call('messages.show', [id], undefined, options) as Promise<WithMeta<Message>>;
  }

  /**
   * Message timeline.
   *
   * The message's events from `message_events`, oldest first, not paginated. Requires `messages:read`. A message
   * outside the key's inbox scope answers 404.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listMessageEvents`
   */
  events(id: string, options?: RequestOptions): Promise<Page<MessageEvent>> {
    return this._connection.call('messages.events', [id], undefined, options) as Promise<Page<MessageEvent>>;
  }
}
