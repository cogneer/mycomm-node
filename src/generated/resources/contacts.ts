// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type {
  Contact,
  ContactBulkResponse,
  ContactIdentity,
  ContactOptOutResult,
  ContactsBulkUpsertParams,
  ContactsConversationsParams,
  ContactsCreateParams,
  ContactsDeleteParams,
  ContactsDeleteResponse,
  ContactsIdentitiesCreateParams,
  ContactsIdentitiesUpdateParams,
  ContactsListParams,
  ContactsOptOutParams,
  ContactsUpdateParams,
  ContactsUpsertByIdentityParams,
  Conversation,
} from '../types.js';

/** `client.contacts` */
export class ContactsResource {
  readonly identities: ContactsIdentitiesResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.identities = new ContactsIdentitiesResource(_connection);
  }

  /**
   * Opt a contact out everywhere.
   *
   * Requires `suppressions:write` (never held by a restricted key). Suppresses every identity of the contact, on
   * every channel, that is not suppressed yet: each gets a suppression with reason `api` and the optional `note`,
   * a `consent_events` `opt_out` (method `api`) and a `contact.opted_out`, and its queued marketing is cancelled.
   * Identities already suppressed, for any reason, are left unchanged and counted in `already_suppressed`, so
   * repeating the call writes nothing new. All identities are suppressed in one transaction. Undo is per identity
   * with `POST /v1/suppressions/{id}/remove`. A contact that is deleted, unknown or in another account is `404`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  optOut(id: string, params?: ContactsOptOutParams, options?: RequestOptions): Promise<WithMeta<ContactOptOutResult>> {
    return this._connection.call('contacts.optOut', [id], params, options) as Promise<WithMeta<ContactOptOutResult>>;
  }

  /**
   * Upsert a contact by phone number.
   *
   * Requires `contacts:write`. Finds the contact holding `identity` (the address is normalised to E.164 with the
   * account country), including a soft-deleted one, which is restored. When found, the sent fields are merged as
   * in `PATCH /v1/contacts/{id}` (top-level fields replace, `null` empties one; `custom_fields` merges key by key,
   * a `null` value removes a key) and the answer is `200`; otherwise a contact is created with that identity as
   * primary and the answer is `201`. `add_to_group_ids` only adds memberships. An opt-out of the number is never
   * cleared. Emits `contact.created` or `contact.updated`. This is the call integrations use to keep MyComm
   * contacts in sync with their own customer records.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  upsertByIdentity(params: ContactsUpsertByIdentityParams, options?: RequestOptions): Promise<WithMeta<Contact>> {
    return this._connection.call('contacts.upsertByIdentity', [], params, options) as Promise<WithMeta<Contact>>;
  }

  /**
   * Upsert up to 1,000 contacts.
   *
   * Requires `contacts:write`. Each item has the shape of `PUT /v1/contacts/by-identity` and is processed
   * independently, in order; the top-level `add_to_group_ids` is added for every item, together with the item's
   * own. The answer is always `200` with a `summary` and one `results[]` entry per item, also when every item was
   * rejected. A rejected item carries the error code the single upsert would answer (`INVALID_NUMBER`,
   * `IDENTITY_TYPE_UNAVAILABLE`, `VALIDATION_FAILED`) and writes nothing.
   *
   * Envelope problems answer `422` and nothing is processed: `BATCH_TOO_LARGE` (`details.max`, 1,000) or
   * `VALIDATION_FAILED`. Larger sets go through a CSV import. `Idempotency-Key` covers the whole call.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  bulkUpsert(params: ContactsBulkUpsertParams, options?: RequestOptions): Promise<WithMeta<ContactBulkResponse>> {
    return this._connection.call('contacts.bulkUpsert', [], params, options) as Promise<WithMeta<ContactBulkResponse>>;
  }

  /**
   * List contacts.
   *
   * Requires `contacts:read`. Live (not soft-deleted) contacts of the account with cursor pagination. Comma lists
   * match any of the values. `q` matches the name, email and any address (case-insensitive, at least 2 characters;
   * a phone-like search is also matched against the digits of the stored number, so `3451234` finds
   * `+923451234567`). `display_name` sorts with ICU collation; contacts without a name sort first and ties break
   * on `id`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  list(params?: ContactsListParams, options?: RequestOptions): Promise<Page<Contact>> {
    return this._connection.call('contacts.list', [], params, options) as Promise<Page<Contact>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.contacts.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   *
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  all(params?: Omit<ContactsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Contact> {
    return this._connection.all('contacts.list', [], params, options) as AsyncGenerator<Contact>;
  }

  /**
   * Create a contact.
   *
   * Requires `contacts:write`. At least one identity; `phone` is the only type in v1 (`422
   * IDENTITY_TYPE_UNAVAILABLE` for the others) and the address is normalised to E.164 using the account country
   * (`422 INVALID_NUMBER`). A number held by another contact answers `409 IDENTITY_TAKEN` with
   * `details.contact_id`. `custom_fields` keys must be defined contact fields. `group_ids` adds the memberships.
   * Emits `contact.created`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(params: ContactsCreateParams, options?: RequestOptions): Promise<WithMeta<Contact>> {
    return this._connection.call('contacts.create', [], params, options) as Promise<WithMeta<Contact>>;
  }

  /**
   * Retrieve a contact.
   *
   * Requires `contacts:read`. A soft-deleted contact answers `404`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  show(id: string, options?: RequestOptions): Promise<WithMeta<Contact>> {
    return this._connection.call('contacts.show', [id], undefined, options) as Promise<WithMeta<Contact>>;
  }

  /**
   * Update a contact.
   *
   * Requires `contacts:write`. Top-level fields replace the stored value (`null` empties it); `custom_fields`
   * merges key by key (`null` removes a key); `group_ids` replaces the memberships when sent. Identities have
   * their own endpoints. Emits `contact.updated` when something changed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(id: string, params?: ContactsUpdateParams, options?: RequestOptions): Promise<WithMeta<Contact>> {
    return this._connection.call('contacts.update', [id], params, options) as Promise<WithMeta<Contact>>;
  }

  /**
   * Delete a contact.
   *
   * Requires `contacts:write`. Soft delete: the contact is hidden from lists, groups and audiences while its
   * conversations and messages stay; emits `contact.deleted` (`erased: false`) and answers `204`. With
   * `?erase=true` (GDPR erasure) the contact, its identities, group memberships, conversations, messages, message
   * events, media, short links and link clicks are permanently deleted by a queued job, which emits
   * `contact.deleted` (`erased: true`); suppressions and consent events (plain E.164) and aggregates
   * (`usage_daily`, campaign stats) are kept. Answers `202 {"status": "erasing"}`; a soft-deleted contact can be
   * erased too.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, params?: ContactsDeleteParams, options?: RequestOptions): Promise<WithMeta<ContactsDeleteResponse> | null> {
    return this._connection.call('contacts.delete', [id], params, options) as Promise<WithMeta<ContactsDeleteResponse> | null>;
  }

  /**
   * List the conversations of a contact.
   *
   * Requires `conversations:read`. The contact's conversations across inboxes, newest `last_message_at` first
   * (restricted keys: the conversations of their inboxes only). A conversation without messages is not listed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  conversations(id: string, params?: ContactsConversationsParams, options?: RequestOptions): Promise<Page<Conversation>> {
    return this._connection.call('contacts.conversations', [id], params, options) as Promise<Page<Conversation>>;
  }
}

/** `client.contacts.identities` */
export class ContactsIdentitiesResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * Add an identity to a contact.
   *
   * Requires `contacts:write`. `type` is `phone` in v1 and the address is normalised to E.164 with the account
   * country (`422 INVALID_NUMBER`); `whatsapp` and `telegram` identities are added with their channels (`422
   * IDENTITY_TYPE_UNAVAILABLE` before). `sender_id` identities are created by MyComm from inbound only (`422
   * INVALID_NUMBER`). A number another contact holds answers `409 IDENTITY_TAKEN` with `details.contact_id`; one
   * this contact already holds answers `200` and creates nothing. A contact has at most 10 identities.
   * `is_primary: true` makes it the primary (the previous primary is unset and an automatic `display_name` follows
   * it). Emits `contact.updated`. An opt-out of the number is never cleared.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  create(id: string, params: ContactsIdentitiesCreateParams, options?: RequestOptions): Promise<WithMeta<ContactIdentity>> {
    return this._connection.call('contacts.identities.create', [id], params, options) as Promise<WithMeta<ContactIdentity>>;
  }

  /**
   * Make an identity primary.
   *
   * Requires `contacts:write`. Only `{"is_primary": true}`: the identity becomes the contact's primary, the
   * previous primary is unset and an automatic `display_name` (one the owner did not set) follows the new primary.
   * The type and address of an identity never change (`422 VALIDATION_FAILED`). A `sender_id` identity is
   * receive-only and cannot be made primary (`422 INVALID_NUMBER`). Emits `contact.updated` when something
   * changed.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  update(
    id: string,
    identity_id: string,
    params: ContactsIdentitiesUpdateParams,
    options?: RequestOptions,
  ): Promise<WithMeta<ContactIdentity>> {
    return this._connection.call('contacts.identities.update', [id, identity_id], params, options) as Promise<
      WithMeta<ContactIdentity>
    >;
  }

  /**
   * Remove an identity.
   *
   * Requires `contacts:write`. `409 INVALID_STATE` for the contact's last identity or an identity with
   * conversations (delete the contact instead). A removed primary is replaced by the earliest identity left, and
   * an automatic `display_name` follows it. Suppressions and consent of the address are kept, so an opt-out still
   * applies when the number comes back. Emits `contact.updated`.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  delete(id: string, identity_id: string, options?: RequestOptions): Promise<void> {
    return this._connection.call('contacts.identities.delete', [id, identity_id], undefined, options) as Promise<void>;
  }

  /**
   * Block an identity account-wide.
   *
   * Requires `contacts:write`. Sets `blocked_at` for every inbox and channel of the account. New outbound to the
   * identity is refused (`CONTACT_BLOCKED`) and its `queued` outbound is cancelled (`message.cancelled`, reason
   * `contact_blocked`). Inbound is still stored but is not counted as unread, runs no automation, sends no
   * notification and emits no `message.received` webhook; opt-out and opt-in keywords still apply. Campaign
   * recipients are skipped (`blocked`). Any identity can be blocked, a `sender_id` one included. Idempotent:
   * blocking a blocked identity changes nothing. Emits `contact.updated`. An opt-out is neither set nor cleared.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  block(id: string, identity_id: string, options?: RequestOptions): Promise<WithMeta<ContactIdentity>> {
    return this._connection.call('contacts.identities.block', [id, identity_id], undefined, options) as Promise<
      WithMeta<ContactIdentity>
    >;
  }

  /**
   * Unblock an identity.
   *
   * Requires `contacts:write`. Clears `blocked_at`, account-wide. Nothing is replayed: messages received or
   * cancelled while blocked stay as they are. Idempotent. Emits `contact.updated`. Send an empty JSON object `{}`
   * as the body.
   *
   * @throws {InvalidArgumentError} when an argument breaks a rule the API documents; nothing is sent (client option `validate`)
   * @throws {APIError} when the API answers with an error
   * @throws {ConnectionError} when the API cannot be reached
   */
  unblock(id: string, identity_id: string, options?: RequestOptions): Promise<WithMeta<ContactIdentity>> {
    return this._connection.call('contacts.identities.unblock', [id, identity_id], undefined, options) as Promise<
      WithMeta<ContactIdentity>
    >;
  }
}
