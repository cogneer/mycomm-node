# Design of the MyComm Node.js SDK

Decided 2026-10-27. This records what the SDK is for and why it is shaped the way it is. For how to work on it, see
[development.md](development.md). The PHP SDK (`mycomm/mycomm-php`) made the same choices first; where this one differs,
the table says why.

## Purpose

Customers' developers and partners integrate MyComm from JavaScript and TypeScript servers (Express, Fastify, NestJS,
Next.js route handlers, serverless and edge functions) without writing HTTP code: send and track messages, sync contacts,
receive webhooks, provision managed accounts, and create the connect sessions that `@mycomm/connect` shows in the browser.
Success means an integration that is correct by default (no double sends, no crashes when the API grows) and that their
editor can autocomplete.

In scope: every operation of the public API (`/v1`) and the partner API (`/partner/v1`), and the webhook events. Out of
scope: the device API, which only the MyComm Android app uses, and the browser, where an API key cannot be kept secret.

## Decisions

| Question                 | Decision                                                                           | Why                                                                                                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language                 | TypeScript, shipped as ES modules with declarations                                | Types are most of the value of an SDK. CommonJS code loads it with `require()`, which Node.js supports for ES modules from 20.19 and 22.12, so a second build would only double the package.                                                                    |
| Runtimes                 | Node.js 20.19+, Bun, Deno, edge runtimes                                           | Built-in `fetch`, `FormData`, `File`, `AbortSignal` and Web Crypto exist in all of them, and `require()` of an ES module works.                                                                                                                                 |
| Dependencies             | None at run time                                                                   | Nothing to audit or to conflict; `fetch` and Web Crypto do the work.                                                                                                                                                                                            |
| Size                     | Under 500 kB installed                                                             | One build; JavaScript without comments or whitespace (names kept, so stack traces read like the source); declarations keep the docs, with each method's opening and an `@see` to the reference; the fake's examples packed so a repeated object is stored once. |
| How the code is produced | Hand-written runtime, generated API surface, own generator (a port of the PHP one) | Same reasons as in PHP; one set of names (`generator/config.ts` follows `config.php`) keeps both SDKs and their docs in step.                                                                                                                                   |
| Results                  | The JSON as sent, typed with interfaces; `_meta` non-enumerable                    | Idiomatic for JavaScript (no classes to hydrate), works with `JSON.stringify` and spreads, and unknown fields stay on the object.                                                                                                                               |
| Timestamps               | ISO 8601 strings in results; `Date` or string in parameters                        | What the wire carries; converting would be lossy for unknown fields and surprising in logs.                                                                                                                                                                     |
| Enums                    | String literal unions plus a constant object; results typed `Open<T>`              | Autocompletion and narrowing, while a value the API adds later is still a valid string.                                                                                                                                                                         |
| Browser                  | Refused unless `dangerouslyAllowBrowser`                                           | An API key in a page is a key anyone can read. Pages use `@mycomm/connect`.                                                                                                                                                                                     |
| Distribution             | Public repository, npm `@mycomm/node`, MIT                                         | The norm for API clients.                                                                                                                                                                                                                                       |

## Shape of the API

- **One client, both APIs.** A partner key uses the same `/v1` operations with a `MyComm-Account` header, so
  `client.forAccount(id)` returns a client that sends it, and the partner operations live under `client.partner`.
- **Names mirror the reference.** Operation `contacts.identities.block` is `client.contacts.identities.block()`; fields keep
  the API's `snake_case` names. A developer reading the API reference never has to translate.
- **Path ids, then one object.** Ids in the path are positional; every body field and query parameter goes in one typed
  `params` object; the optional `RequestOptions` come last.
- **`null` versus not sent.** `PATCH` treats `null` as "clear". In JavaScript that maps directly: `null` is sent, `undefined`
  or a missing key is not.
- **Dry runs.** `messages.send` and `conversations.reply` answer a dry run with a preview and a real call with the message.
  Overloads on `dry_run` give each call the type of its answer.
- **Forward compatibility.** The API adds fields, enum values, error codes and event types without a new version. Unknown
  fields stay on the object; enum fields are typed `Open<T>`; unknown error codes fall back on the HTTP status; an unknown
  event type is returned as it is, and `Webhook.isKnown(event)` tells it apart so a `switch` on `type` narrows `data`.

## Runtime behaviour

- **Idempotency.** Every POST carries an `Idempotency-Key` (a UUID unless the caller supplies one), reused on each retry of
  that call. The API then replays the first answer, so a retry cannot send a message twice.
- **Retries.** Two by default. Network errors, timeouts and `5xx` are retried with jittered exponential backoff; `429` and
  `503` wait for `Retry-After` (at most a minute); `409 IDEMPOTENCY_IN_PROGRESS` waits a second. Nothing else is retried.
  The caller's `AbortSignal` stops an attempt and the waits; it is never retried.
- **Writes always send a JSON object**, `{}` when the operation has no fields, because the API rejects a write without one.
- **Paths.** An empty id is refused before sending, with validation on or off: `/v1/contacts/` would reach the list.
- **Errors** are classes by HTTP status, carrying the API's code, details, request id and `doc_url`.
- **Webhooks.** `MyComm-Signature: t=<unix>,v1=<hex hmac-sha256 of "<t>.<raw body>">`, several `v1` values during a secret
  rotation, 300 s tolerance, constant-time comparison, computed over the raw bytes.

## How correctness is checked

1. **Generated tests over the whole surface.** For every operation the generator writes example arguments, a full example
   answer and the sparsest answer the spec allows. The suite calls each method against the fake and checks method, path,
   body rules and the result. Every event's example and sparsest payload is parsed.
2. **Generated type checks.** `test/generated/types.check.ts` asserts with `satisfies` that every example answer (full and
   sparsest) fits the declared type of its method and every event fits its event type, and calls every method with its
   example arguments. `npm run lint` type-checks it, so a type that disagrees with the reference fails the build.
3. **Hand-written tests** for the runtime: retries, idempotency, encoding, errors, paging, signatures, the fake, the default
   `fetch` transport, and the README's examples (`test/readme.check.ts`).
4. **Generator tests** on the small fixture spec of mycomm-php.
5. **A packed-install check** before a release: install the packed tarball into an empty project and compile an ES module
   and a CommonJS consumer against it, and `require()` it (see development.md).

The type checks found what the PHP SDK could not see: the backend's bundler writes an empty list in an example as `{}`
(`media: []` in the source fragment becomes `media: {}` in `openapi/public.yaml`). PHP decodes both as an empty array. The
generator writes such examples as lists again (`conform()` in `generator/examples.ts`) until the bundler is fixed.

## Known limits

- `channels.create` and `channels.connectState` belong to channel types that are not enabled yet and have no success answer
  in the spec; they return the decoded JSON as `Record<string, unknown>`.
- Filters with a list of values are typed `string` (one value) or `string[] | string` (a comma list), not as the list of
  values, because the server may accept values this SDK version does not know.
