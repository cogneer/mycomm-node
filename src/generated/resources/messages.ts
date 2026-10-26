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
   * decides the outcome. A `sent` or other terminal message answers `409 NOT_CANCELLABLE` with `details.status`. A
   * message outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * `acknowledge_possible_duplicate` must be `true` to retry a message whose `failure.code` is `UNCONFIRMED`; it
   * is ignored otherwise. Errors: `409 NOT_RETRYABLE` (`details.status`, `details.failure_code`; not `failed` or
   * `expired`, inbound, or `UNCONFIRMED` without acknowledgement), `409 RETRY_LIMIT_REACHED` (5 manual retries),
   * and `422` `RECIPIENT_OPTED_OUT`, `CONTACT_BLOCKED`, `CHANNEL_INACTIVE` or `INBOX_ARCHIVED`. A message outside
   * the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * Items are accepted or rejected independently, in order: the answer is always `200` with a `summary` and one
   * `results[]` entry per item, also when every item was rejected. An item error carries the code of the matching
   * single send (`INVALID_NUMBER`, `CATEGORY_REQUIRED`, `RECIPIENT_OPTED_OUT`, ...). A `reference_id` already used
   * by the account, or earlier in the same batch, rejects that item with `REFERENCE_ID_EXISTS`.
   *
   * `Idempotency-Key` covers the whole batch: a repeat replays the stored `200`. `dry_run: true` runs every item
   * through the same checks and stores nothing; accepted entries then carry a message preview with `id` and
   * `status` null.
   *
   * Envelope problems answer `422` and nothing is processed: `BATCH_TOO_LARGE` (`details.max`, 1,000) or
   * `VALIDATION_FAILED`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * Answers `202` with the message resource (`status: queued`) plus `warnings[]` (empty when none; for example
   * `CHANNEL_OPTIONS_IGNORED`). A message is accepted while the phone is offline or the channel is paused; it
   * waits with `hold_reason` `device_offline`, `device_paused` or `channel_paused`.
   *
   * `Idempotency-Key` replays the stored `202` for the same request. A `reference_id` already used by the account
   * without a matching key answers `409 REFERENCE_ID_EXISTS` with `details.message_id` and the existing message in
   * `details.message`; nothing is created. Every acceptance rejection answers `422` with its own code
   * (`CATEGORY_REQUIRED`, `SEND_AFTER_TOO_FAR`, `INVALID_NUMBER`, `RECIPIENT_OPTED_OUT`, `CHANNEL_INACTIVE`, ...)
   * and the `details` listed per code in the error reference. Shape errors (including `metadata` over 2 KB or 50
   * keys, or non-scalar values) answer `422 VALIDATION_FAILED` with `details.fields`. An inbox, channel or contact
   * outside the key's scope answers 404.
   *
   * With `dry_run: true` the same validation and acceptance errors apply, but nothing is stored, queued or sent
   * and the answer is `200` with the would-be message: `dry_run: true`, `id`, `conversation_id`, `status` and the
   * timestamps `null`, `contact_id` `null` for a new number, and the computed `encoding`, `segments`, `type`,
   * `hold_reason` and `expires_at`. `hold_reason` predicts compliance and scheduling holds only. `Idempotency-Key`
   * and `reference_id` are checked but not consumed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  send(params: MessagesSendParams & { dry_run?: false }, options?: RequestOptions): Promise<WithMeta<SendMessageResponse>>;
  /**
   * Send one message.
   *
   * Queues one message. Requires `messages:send`. The inbox decides the channel: give `inbox_id`, `channel_id` or
   * `from` (the key's single inbox is used when it is restricted to exactly one). The recipient is `to` or
   * `contact_id`. The content is the `content` union or one of the shorthand fields (`body`, `media_ids`).
   *
   * Answers `202` with the message resource (`status: queued`) plus `warnings[]` (empty when none; for example
   * `CHANNEL_OPTIONS_IGNORED`). A message is accepted while the phone is offline or the channel is paused; it
   * waits with `hold_reason` `device_offline`, `device_paused` or `channel_paused`.
   *
   * `Idempotency-Key` replays the stored `202` for the same request. A `reference_id` already used by the account
   * without a matching key answers `409 REFERENCE_ID_EXISTS` with `details.message_id` and the existing message in
   * `details.message`; nothing is created. Every acceptance rejection answers `422` with its own code
   * (`CATEGORY_REQUIRED`, `SEND_AFTER_TOO_FAR`, `INVALID_NUMBER`, `RECIPIENT_OPTED_OUT`, `CHANNEL_INACTIVE`, ...)
   * and the `details` listed per code in the error reference. Shape errors (including `metadata` over 2 KB or 50
   * keys, or non-scalar values) answer `422 VALIDATION_FAILED` with `details.fields`. An inbox, channel or contact
   * outside the key's scope answers 404.
   *
   * With `dry_run: true` the same validation and acceptance errors apply, but nothing is stored, queued or sent
   * and the answer is `200` with the would-be message: `dry_run: true`, `id`, `conversation_id`, `status` and the
   * timestamps `null`, `contact_id` `null` for a new number, and the computed `encoding`, `segments`, `type`,
   * `hold_reason` and `expires_at`. `hold_reason` predicts compliance and scheduling holds only. `Idempotency-Key`
   * and `reference_id` are checked but not consumed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  send(params: MessagesSendParams & { dry_run: true }, options?: RequestOptions): Promise<WithMeta<SendMessageDryRunResponse>>;
  /**
   * Send one message.
   *
   * Queues one message. Requires `messages:send`. The inbox decides the channel: give `inbox_id`, `channel_id` or
   * `from` (the key's single inbox is used when it is restricted to exactly one). The recipient is `to` or
   * `contact_id`. The content is the `content` union or one of the shorthand fields (`body`, `media_ids`).
   *
   * Answers `202` with the message resource (`status: queued`) plus `warnings[]` (empty when none; for example
   * `CHANNEL_OPTIONS_IGNORED`). A message is accepted while the phone is offline or the channel is paused; it
   * waits with `hold_reason` `device_offline`, `device_paused` or `channel_paused`.
   *
   * `Idempotency-Key` replays the stored `202` for the same request. A `reference_id` already used by the account
   * without a matching key answers `409 REFERENCE_ID_EXISTS` with `details.message_id` and the existing message in
   * `details.message`; nothing is created. Every acceptance rejection answers `422` with its own code
   * (`CATEGORY_REQUIRED`, `SEND_AFTER_TOO_FAR`, `INVALID_NUMBER`, `RECIPIENT_OPTED_OUT`, `CHANNEL_INACTIVE`, ...)
   * and the `details` listed per code in the error reference. Shape errors (including `metadata` over 2 KB or 50
   * keys, or non-scalar values) answer `422 VALIDATION_FAILED` with `details.fields`. An inbox, channel or contact
   * outside the key's scope answers 404.
   *
   * With `dry_run: true` the same validation and acceptance errors apply, but nothing is stored, queued or sent
   * and the answer is `200` with the would-be message: `dry_run: true`, `id`, `conversation_id`, `status` and the
   * timestamps `null`, `contact_id` `null` for a new number, and the computed `encoding`, `segments`, `type`,
   * `hold_reason` and `expires_at`. `hold_reason` predicts compliance and scheduling holds only. `Idempotency-Key`
   * and `reference_id` are checked but not consumed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
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
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  events(id: string, options?: RequestOptions): Promise<Page<MessageEvent>> {
    return this._connection.call('messages.events', [id], undefined, options) as Promise<Page<MessageEvent>>;
  }
}
