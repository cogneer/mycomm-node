# Changelog

All notable changes to this package are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the package follows
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-11-09

Published 2.0.0 still used `account_id` and `default_line_id`; this release follows the API and renames them. Code that
reads either field, or any other name below, has to change when it moves to 2.1.0. The same names and behaviour as
`mycomm/mycomm-php` 2.1.0.

### Changed

- `account_id` is now `user_id` in results and webhook events. The API speaks of the user, not an account:
  `mycomm.me.get()` and `me.update()` (`GET`/`PATCH /v1/me`, ability `me:write`) replace `account.get()` and
  `account.update()`, and `client.verify()` returns the key's `user` (was `account`). The `Account`,
  `AccountSettings`, `AccountStatus`, `WebhookAccount`, `WebhookAccountData` and `WebhookAccountCounts` types are now
  `User`, `UserSettings`, `UserStatus`, `WebhookUser`, `WebhookUserData` and `WebhookUserCounts`;
  `AccountUpdateParams` is `MeUpdateParams`.
- `default_line_id` is now `direct_line_id`: every number has its own direct line (a channel's `direct_line_id`).
- A direct line sends only through its own number. `lines.setSenders()` on a direct line answers `409 INVALID_STATE`
  for any other list, or when its own number is switched off or has `mirror_inbound` on.
- `from` prefers the live number. When the number in `from` also has a disconnected copy, `messages.send()` sends
  through the live one; `LINE_ARCHIVED` answers only when no live copy exists.
- The `account.*` webhook events are `user.*` (`user.suspended`, `user.reactivated`, `user.deletion_scheduled`).
- Error codes `ACCOUNT_SUSPENDED`, `ACCOUNT_PENDING_DELETION`, `ACCOUNT_THROTTLED` and `NEW_ACCOUNT_LIMIT` are now
  `USER_SUSPENDED`, `USER_PENDING_DELETION`, `USER_THROTTLED` and `NEW_USER_LIMIT`; the values `account_suspended`
  (device pause reason), `account_deleted` (device revoked reason), `account_zip` (export type),
  `number_has_account` (channel verification failure reason) and `account_limit` (hold reason) are now `user_suspended`,
  `user_deleted`, `user_zip`, `number_has_user` and `user_limit`.
- A user's `country_iso` and `timezone` may be `null` until the user sets them.

## [2.0.0] - 2026-11-02

Built from the MyComm public API and partner API `2.0.0`, where lines replace inboxes and partners give each user a line.
The same names and behaviour as `mycomm/mycomm-php` 2.0.0. Nothing from 1.x is kept as an alias.

### Changed (breaking)

- `inboxes` is now `lines`: `mycomm.lines.list()`, `all()`, `create()`, `get()`, `update()`, `archive()` (now
  `DELETE /v1/lines/{id}`) and `unarchive()`. The `Inbox`, `InboxChannel`, `InboxSettings` and `InboxKind` types are gone;
  use `Line`, `LineSender`, `LineSettings` and `LineKind`.
- `inbox_id` is now `line_id` everywhere: `messages.send()`, `sendBatch()` items, conversations, messages and webhook
  events.
- `client.verify({ to, lineId })`: the option was `inboxId`.
- Partner keys act on a line, not an account: `client.forLine(lineId)` replaces `forAccount()` and every `/v1` call of
  that client carries `MyComm-Line` (was `MyComm-Account`); the option `lineId` replaces `accountId`, in `MyCommFake`
  too.

### Removed (breaking)

- Managed accounts: `partner.accounts` (`provision`, `list`, `all`, `get`, `update`, `suspend`, `reactivate`, `delete`)
  and `partner.accountKeys` (`create`, `list`, `all`, `revoke`), with the `ManagedAccount` types. A partner gives each
  user a line instead.
- Connect sessions: `connectSessions` (`create`, `get`, `delete`) and the `ConnectSession` types. Hosted links replace
  them.
- `Account.type` and `external_ref`, `WebhookAccount.type` and `external_ref`, the `AccountType` type, and the webhook
  envelope's `account_external_ref`: the API no longer sends them.

### Added

- Partner lines: `partner.lines.list()`, `all()`, `create()`, `get()`, `update()` and `detach()`, and
  `partner.lines.status(id)` (`PartnerLineStatus`: `state`, `needs_attention_reasons`, channels and sponsorship).
- Hosted links: `partner.lines.links.create(lineId, { purpose })` and `partner.links.get()` / `revoke()` for partner
  keys, `lines.links.create()` and `links.get()` / `revoke()` for account keys (`CreatedHostedLink`, with the one-time
  `url`, and `HostedLink`; purposes `connect`, `add_channel`, `replace_device`, `manage`, `claim`).
- `partner.sponsorshipDefaults.get()` and `put()`, and `sponsorship` on partner lines (`SponsorshipTerms`).
- `partner.usage.get()` reports one row per partner line (`line_id`, `external_ref`); its filter is `line_id`.
- `webhookEndpoints.create()` / `update()`: `partner_lines`.
- `client.verify()` with a partner key checks the key on the partner API and dry-runs the send through the line of
  `forLine()` (or its `lineId`); `client.isPartnerKey()`.
- Webhook events `line.connected`, `line.needs_attention`, `line.recovered`, `line.detached`, `line.quota_low` and
  `line.quota_exhausted`; types `LineState`, `LineNeedsAttentionReason`, `LineDetachedBy`,
  `HostedLinkPurpose`, `HostedLinkStatus` and `SponsorshipOnExhausted`.
- README: the partner flow for an ERP (a line per tenant, a `connect` link, the widget, `forLine()`, status and `line.*`
  webhooks).

- `lines.listSenders(id)` and `lines.setSenders(id, { senders })`: the channels a line sends from, with role (`primary`,
  `backup`, `pool`) and health.
- `conversations.handover(id, { line_id })`: hand a conversation over to another line.
- Webhook events `line.sender_changed`, `line.failover`, `line.no_sender` and `conversation.handed_over`.
- `Message.sender_pinned` and `sender_attempts`; `Channel.line_ids`.
- `lines.update()` takes `send_mode`, `sticky_sender`, `prefer`, `cross_type_fallback`, `on_unconfirmed`,
  `failover_seconds` and `alarm_thresholds`, and `Line` returns them (`LineCrossTypeFallback`, `LineFailoverSeconds`,
  `LineAlarmThresholds`; type `LinePrefer`).
- `mirror_inbound` on `LineSenderInput` and `LineSender`: copy inbound messages that land on another line to this line.
- `prefer` on `messages.send()` and `sendBatch()` items (type `MessagePrefer`).
- `Message.fallback_of`, `WebhookMessageReceivedData.mirrored` and `WebhookLineSenderChangedData.sticky_cleared_count`.
- Webhook event `line.alarm` (`WebhookLineAlarmData`, type `AlarmKind`), for public and partner endpoints.
- `partner.lines.vouch(id, { recovery_request_id })` (`RecoveryVouch`): answer a `line.recovery_requested` webhook when
  you know the person. MyComm staff see it when they decide; it is never required and never enough alone.
- Webhook event `line.recovery_requested` (`WebhookLineRecoveryRequestedData`); 58 events in all.
- `number_released` on `ChannelDisconnectReason`: the channel was disconnected because its number was let go.

### Fixed

- `VERSION` (and the `User-Agent`) said `1.0.0` while `package.json` said `1.0.2`; both are `2.0.0` now.

## [1.0.2] - 2026-10-28

### Fixed

- Doc comments that lost words: where a description had a dot inside code (such as `details.status`), the comment skipped
  from that dot to the end of a later sentence, so `connectSessions.delete()` read "…also for a page already open.status`."
(15 resources were affected). A sentence now ends only at `.`, `!`or`?` followed by a space.

## [1.0.1] - 2026-10-27

### Changed

- One ES module build with type declarations instead of separate ES module and CommonJS builds; CommonJS code loads it
  with `require()`. It needs Node.js 20.19+ (was 20+) and is 105 kB to download, under 500 kB installed (was about 1.9 MB).

## [1.0.0] - 2026-10-27

The first release, built from the MyComm public API and partner API `1.0.0` (backend commit in `spec/SOURCE`), the frozen
contract. The same names and behaviour as `mycomm/mycomm-php` 1.0.1.

### Added

- `MyComm` with every operation of the public API and of the partner API (157 methods), typed parameters and results for
  168 models and 74 enums, and `forAccount()` for partner keys.
- Checks before sending: the limits and rules of the OpenAPI document (ranges, lengths, formats, allowed values, `to` or
  `contact_id`, at least one content field, `variables` with `template_id`, `category` with the bulk lane, required fields)
  throw `InvalidArgumentError` naming the field and the rule. Turn off with `new MyComm({ validate: false })`.
- Retries for network errors, timeouts, `429`, `503` and other `5xx`, with an `Idempotency-Key` on every POST that is
  reused on each retry, `Retry-After` in seconds or as an HTTP date, and per-call `idempotencyKey`, `maxRetries`, `timeout`,
  `headers` and `signal`.
- Errors by status (`NotFoundError`, `ValidationError`, `RateLimitError`, ...) with `code`, `details`, `requestId`,
  `docUrl`, `is()`, `isAnyOf()` and `summary()`.
- `Page` with `next()`, `autoPaging()` and `all()` on every paginated list.
- Overloads on `dry_run` for `messages.send()` and `conversations.reply()`, so a dry run is typed as the preview.
- `Webhook.constructEvent()`, `verify()`, `parse()`, `isKnown()` and `sign()` over Web Crypto, with a type for each of the
  46 events.
- `client.verify()`: checks a key and, with a number, dry-runs a send. Sends nothing.
- `toFile()` and `fileFromPath()` for uploads.
- `@mycomm/node/testing`: `MyCommFake`, `FakeResponse` and `FakeWebhook`.
- ES module and CommonJS builds with type declarations; no runtime dependencies; Node.js 20+, Bun, Deno and edge
  runtimes.
