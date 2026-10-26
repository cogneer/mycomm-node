// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Conversation,
  ConversationsDeleteResponse,
  ConversationsListParams,
  ConversationsMessagesParams,
  ConversationsReplyParams,
  Message,
  SendMessageDryRunResponse,
  SendMessageResponse,
} from '../types.js';

/** `client.conversations` */
export class ConversationsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Mark a conversation read.
   *
   * Sets `unread_count` to 0 and stamps `read_at` on its unread inbound messages. Emits `conversation.read`.
   * Requires `conversations:write`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  read(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.read', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Mark a conversation unread.
   *
   * Sets `unread_count` to 1. Emits `conversation.unread`. Requires `conversations:write`. A conversation outside
   * the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  unread(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.unread', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Archive a conversation.
   *
   * Sets `status` to `archived`; the next inbound message reopens it. Emits `conversation.archived`. Requires
   * `conversations:write`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  archive(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.archive', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Unarchive a conversation.
   *
   * Sets `status` back to `open`. Emits `conversation.unarchived`. Requires `conversations:write`. A conversation
   * outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  unarchive(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.unarchive', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Block the conversation's contact identity.
   *
   * Convenience route: blocks the conversation's contact identity account-wide (every inbox and channel), exactly
   * like `POST /v1/contacts/{id}/identities/{identity_id}/block`. Idempotent. Every conversation of that identity
   * shows the same `blocked_at`. Requires `conversations:write`. A conversation outside the key's inbox scope
   * answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  block(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.block', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Unblock the conversation's contact identity.
   *
   * Clears `blocked_at` of the conversation's contact identity, account-wide. Nothing is replayed. Requires
   * `conversations:write`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  unblock(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.unblock', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Retrieve a conversation.
   *
   * Returns the conversation resource. Requires `conversations:read`. A conversation outside the key's inbox scope
   * answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Conversation>> {
    return this._connection.call('conversations.show', [id], undefined, options) as Promise<WithMeta<Conversation>>;
  }

  /**
   * Delete a conversation.
   *
   * Permanently deletes the conversation with its messages, their events, media and short links. Requires
   * `conversations:write`. Queued outbound messages are cancelled first; the purge runs in the background and
   * emits `conversation.deleted` when it is complete. Answers `202` at once; the conversation is no longer
   * readable. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, options?: RequestOptions): Promise<WithMeta<ConversationsDeleteResponse>> {
    return this._connection.call('conversations.delete', [id], undefined, options) as Promise<
      WithMeta<ConversationsDeleteResponse>
    >;
  }

  /**
   * List conversations.
   *
   * Conversations of the account, newest `last_message_at` first, with cursor pagination. Requires
   * `conversations:read`. A restricted key lists only the conversations of its inboxes. A conversation without
   * messages is not listed. Comma lists match any of the values. `q` matches the contact name, address and last
   * message preview (case-insensitive, at least 2 characters).
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: ConversationsListParams, options?: RequestOptions): Promise<Page<Conversation>> {
    return this._connection.call('conversations.list', [], params, options) as Promise<Page<Conversation>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.conversations.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ConversationsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Conversation> {
    return this._connection.all('conversations.list', [], params, options) as AsyncGenerator<Conversation>;
  }

  /**
   * Read a conversation's thread.
   *
   * The messages of one conversation, newest first by default. Requires `conversations:read`. Both sort directions
   * use `COALESCE(phone_timestamp, created_at)`, so imported history keeps the time the phone recorded;
   * `created_after` (inclusive) and `created_before` (exclusive) use the same time. Ties break on `id`. `q` is the
   * full-text search on `body` of `GET /v1/messages` (at least 2 characters). A conversation outside the key's
   * inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  messages(id: string, params?: ConversationsMessagesParams, options?: RequestOptions): Promise<Page<Message>> {
    return this._connection.call('conversations.messages', [id], params, options) as Promise<Page<Message>>;
  }

  /**
   * Reply in a conversation.
   *
   * Sends a message in the thread. Requires `conversations:write` and `messages:send`. The body is the body of
   * `POST /v1/messages` without `to`, `contact_id`, `inbox_id`, `channel_id`, `from` and `channel_type`; the inbox
   * and contact identity of the conversation are used. Sending one of those fields answers `422 VALIDATION_FAILED`
   * with the field in `details.fields`.
   *
   * Everything else behaves as on `POST /v1/messages`: `202` with the message resource plus `warnings[]`,
   * `dry_run`, `Idempotency-Key`, `reference_id` (`409 REFERENCE_ID_EXISTS`) and the `422` acceptance rejections
   * of `POST /v1/messages`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  reply(
    id: string,
    params: ConversationsReplyParams & { dry_run?: false },
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageResponse>>;
  /**
   * Reply in a conversation.
   *
   * Sends a message in the thread. Requires `conversations:write` and `messages:send`. The body is the body of
   * `POST /v1/messages` without `to`, `contact_id`, `inbox_id`, `channel_id`, `from` and `channel_type`; the inbox
   * and contact identity of the conversation are used. Sending one of those fields answers `422 VALIDATION_FAILED`
   * with the field in `details.fields`.
   *
   * Everything else behaves as on `POST /v1/messages`: `202` with the message resource plus `warnings[]`,
   * `dry_run`, `Idempotency-Key`, `reference_id` (`409 REFERENCE_ID_EXISTS`) and the `422` acceptance rejections
   * of `POST /v1/messages`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  reply(
    id: string,
    params: ConversationsReplyParams & { dry_run: true },
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageDryRunResponse>>;
  /**
   * Reply in a conversation.
   *
   * Sends a message in the thread. Requires `conversations:write` and `messages:send`. The body is the body of
   * `POST /v1/messages` without `to`, `contact_id`, `inbox_id`, `channel_id`, `from` and `channel_type`; the inbox
   * and contact identity of the conversation are used. Sending one of those fields answers `422 VALIDATION_FAILED`
   * with the field in `details.fields`.
   *
   * Everything else behaves as on `POST /v1/messages`: `202` with the message resource plus `warnings[]`,
   * `dry_run`, `Idempotency-Key`, `reference_id` (`409 REFERENCE_ID_EXISTS`) and the `422` acceptance rejections
   * of `POST /v1/messages`. A conversation outside the key's inbox scope answers 404.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  reply(
    id: string,
    params?: ConversationsReplyParams,
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>>;
  reply(
    id: string,
    params?: ConversationsReplyParams,
    options?: RequestOptions,
  ): Promise<WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>> {
    return this._connection.call('conversations.reply', [id], params, options) as Promise<
      WithMeta<SendMessageDryRunResponse> | WithMeta<SendMessageResponse>
    >;
  }
}
