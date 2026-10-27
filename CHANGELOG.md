# Changelog

All notable changes to this package are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the package follows
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Unreleased

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
- An ES module with type declarations, which CommonJS code loads with `require()`; no runtime dependencies; Node.js 20.19+,
  Bun, Deno and edge runtimes. 105 kB to download, under 500 kB installed.
