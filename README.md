# MyComm Node.js SDK

The official Node.js and TypeScript client for the [MyComm](https://mycomm.cogneer.tech) messaging API: send and track
messages, manage contacts and conversations, receive webhooks, and (for partners) provision customer accounts.

- Every operation of the public API and the partner API, with typed parameters and typed results
- Checks your arguments against the API's documented rules before sending, and tells you which field is wrong
- Retries that cannot double-send: every POST carries an `Idempotency-Key`
- Lists you can `for await` over, across pages
- Webhook signature verification and a type per event
- A fake client for your own tests
- No dependencies: built-in `fetch` and Web Crypto. Runs on Node.js 20+, Bun, Deno and edge runtimes; ES modules and
  CommonJS

## Install

```bash
npm install @mycomm/node
```

## Quick start

```ts
import { MyComm } from '@mycomm/node';

const mycomm = new MyComm({ apiKey: process.env.MYCOMM_API_KEY }); // mc_live_...

const message = await mycomm.messages.send({
  to: '+923001234567',
  body: 'Your code is 4821',
});

message.id; // "01923f80-5c6d-7e7f-8a90-a1b2c3d4e5f6"
message.status; // "queued"
```

Create the key in the MyComm portal under **Developers → API keys**. Keep it on your server: the SDK refuses to run in a
browser, where anyone could read the key. To let your users pair their own phone from your page, create a connect session
on your server and show it with [`@mycomm/connect`](https://www.npmjs.com/package/@mycomm/connect).

`new MyComm()` without `apiKey` reads `MYCOMM_API_KEY` (and `MYCOMM_BASE_URL`) from the environment.

## How the SDK maps to the API

Each resource of the [API reference](https://mycomm.cogneer.tech/docs/api/public) is a property of the client and each
operation a method. The reference names an operation with a verb in camelCase (`sendMessage`); the SDK groups the
operations by resource, so the same call reads `messages.send()`. The PHP SDK uses the same names.

| Operation id in the reference | Call                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `sendMessage`                 | `mycomm.messages.send({...})`                             |
| `upsertContactByIdentity`     | `mycomm.contacts.upsertByIdentity({...})`                 |
| `blockContactIdentity`        | `mycomm.contacts.identities.block(contactId, identityId)` |
| `rotateWebhookEndpointSecret` | `mycomm.webhookEndpoints.rotateSecret(id)`                |
| `provisionManagedAccount`     | `mycomm.partner.accounts.provision({...})`                |

`generator/config.ts` holds the full table of operation ids.

Ids in the path are the leading arguments. Everything else goes in one object, named like the API's fields
(`reference_id`, `send_after`), so the reference and your editor's autocompletion agree. The last argument is always
the optional [request options](#retries-and-idempotency). Every type is exported: `MessagesSendParams`, `Message`,
`Contact`, `MessageStatus`, ...

## Sending messages

```ts
const message = await mycomm.messages.send({
  to: '+923001234567',
  body: 'Sale ends tonight. Reply STOP to opt out.',
  category: 'marketing',
  send_after: new Date(Date.now() + 2 * 60 * 60 * 1000),
  reference_id: 'campaign-7-user-991',
  metadata: { user_id: 991 },
});

for (const warning of message.warnings) {
  console.warn(warning.message);
}
```

Check what a send would do without sending it. With `dry_run: true` the result is typed as the preview:

```ts
const preview = await mycomm.messages.send({ to: '+923001234567', body: text, dry_run: true });

preview.segments; // how many SMS parts the text needs
preview.hold_reason; // why it would wait, if it would
```

Send up to 1,000 messages in one call. Items are accepted or rejected one by one:

```ts
const batch = await mycomm.messages.sendBatch({
  messages: [
    { to: '+923001234567', body: 'Hi Ada' },
    { to: '+923331112222', body: 'Hi Grace' },
  ],
  defaults: { category: 'transactional' },
});

for (const result of batch.results) {
  if (result.error !== null) {
    console.error(`Message ${result.index} was rejected: ${result.error.code}`);
  }
}
```

Follow a message afterwards with `mycomm.messages.show(id)`, or let MyComm tell you through [webhooks](#webhooks).

Enum values have constants too, for autocompletion: `MessageCategory.Marketing === 'marketing'`.

## What the SDK checks before sending

The API documents limits and rules for what you send: ranges, lengths, which fields exclude each other, which need
another. The SDK checks them first, so a mistake fails at once with the field named, instead of as a `422` from the
server:

```ts
import { InvalidArgumentError } from '@mycomm/node';

try {
  await mycomm.messages.send({ to: number, body: text, expires_in: 30 });
} catch (error) {
  if (error instanceof InvalidArgumentError) {
    error.message; // expires_in must be between 60 and 604800 (got 30).
    error.field; // "expires_in"
    error.rule; // "OUT_OF_RANGE", named like the API's own validation codes
    error.violations; // every problem, not only the first
  }
}
```

| Rule                | Example                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Ranges and lengths  | `expires_in` 60 to 604800; `reference_id` 1 to 100 characters without spaces; `limit` 1 to 200 |
| Allowed values      | `category` is `transactional` or `marketing`; `lane` is `high`, `normal` or `bulk`             |
| Formats             | ids are UUIDs                                                                                  |
| Sizes               | `metadata` at most 50 keys, 2048 bytes as JSON, scalar values only                             |
| Exactly one of      | `to` or `contact_id`                                                                           |
| At least one of     | `content`, `body`, `media_ids` or `template_id`                                                |
| Needs another field | `variables` needs `template_id`; `category` is required when `lane` is `bulk`                  |
| Required            | a required field left out, for callers without TypeScript                                      |

The rules are generated from the API's OpenAPI document, so they follow the API. Nothing is sent when one fails. Rules
the SDK does not know about, such as an opt-out, are still answered by the server (see [Errors](#errors)).

If the API relaxes a rule before you have updated the SDK, turn the checks off with `new MyComm({ validate: false })`.
Values the API may add later (the enum of a response, an unknown error code) are never rejected.

## Verify your settings

`verify()` checks that a key works and, when you give it a number to test with, that a message to that number would be
accepted. It sends nothing: the second check is a dry run.

```ts
const result = await mycomm.verify({ to: '+923001234567' }); // add inboxId when the key can use several

if (!result.ok) {
  for (const problem of result.problems) {
    console.log(problem); // the API's own message, for example why a recipient is refused
  }
}
```

A dry run does not know whether the phone is online or whether the carrier delivers; a hold it can predict is in
`result.holdReason`. See the guide [Verify your integration](https://mycomm.cogneer.tech/docs/guides/verify-your-integration).

## Lists and pagination

A list method resolves to one `Page`. Loop over it for the items of that page, or use `all()` to walk every page; the
next page is fetched only when the loop reaches it.

```ts
const page = await mycomm.contacts.list({ group_id: groupId, limit: 100 });

for (const contact of page) {
  // the first 100
}

for await (const contact of mycomm.contacts.all({ group_id: groupId })) {
  // every contact of the group
}
```

`page.next_cursor`, `page.hasMore()` and `await page.next()` are there when you page by hand, and `page.autoPaging()`
does what `all()` does for lists that are not named `list` (`(await mycomm.conversations.messages(id)).autoPaging()`).

## Leaving a field out or clearing it

An update changes only the fields you pass. Where a field can be cleared, `null` clears it:

```ts
await mycomm.contacts.update(id, { first_name: 'Ada' }); // email untouched
await mycomm.contacts.update(id, { first_name: 'Ada', email: null }); // email cleared
```

A field set to `undefined` counts as left out.

## Errors

Every error answer of the API becomes an error you can catch. Branch on `code`, which is stable; the message says what
happened and what to do, in English, and may change. `error.summary()` gives one line with the code, status, message,
details and request id.

```ts
import { APIError, ConnectionError, ValidationError } from '@mycomm/node';

try {
  await mycomm.messages.send({ to: number, body: text, category: 'marketing' });
} catch (error) {
  if (error instanceof ValidationError) {
    error.fields(); // { to: [{ code: 'INVALID_NUMBER', message: '...' }] }
  } else if (error instanceof APIError) {
    if (error.is('RECIPIENT_OPTED_OUT')) {
      // do not retry: the recipient unsubscribed
    }
    error.status; // 422
    error.code; // "RECIPIENT_OPTED_OUT"
    error.details; // { address: '+923001234567', ... }
    error.requestId; // quote this to support
    error.docUrl; // the page of the error reference that explains the code
    error.summary(); // RECIPIENT_OPTED_OUT (422): The recipient ...  details: {...}  request_id: ...
  } else if (error instanceof ConnectionError) {
    // MyComm could not be reached, even after the retries
  }
}
```

| Error                       | When                                                                          |
| --------------------------- | ----------------------------------------------------------------------------- |
| `BadRequestError`           | 400: malformed request, invalid cursor                                        |
| `InvalidHeaderError`        | 400 `INVALID_HEADER` (extends `BadRequestError`): `details.header` says which |
| `UnsupportedMediaTypeError` | 415: the body is not in the format the endpoint takes                         |
| `AuthenticationError`       | 401: key missing, unknown, revoked or expired                                 |
| `PermissionDeniedError`     | 403: ability, scope, IP allow-list, suspended account                         |
| `NotFoundError`             | 404                                                                           |
| `ConflictError`             | 409, for example `REFERENCE_ID_EXISTS`                                        |
| `PayloadTooLargeError`      | 413                                                                           |
| `UnprocessableError`        | 422: a rule refuses the request                                               |
| `ValidationError`           | 422 `VALIDATION_FAILED` (extends `UnprocessableError`)                        |
| `RateLimitError`            | 429, after the retries; `retryAfter()` says how long to wait                  |
| `ServerError`               | 5xx, after the retries                                                        |

All of them extend `APIError`, which extends `MyCommError`, the base of everything the SDK throws. `InvalidArgumentError`
also extends `MyCommError`, but it is not an `APIError`: no request was made. The `ErrorCode` type lists the codes this
version knows; a newer code arrives as it is and falls back on the error of its status.

## Retries and idempotency

The SDK retries a call twice (configurable) when the network fails or an attempt times out, when MyComm answers `429` or
`503` (waiting as long as `Retry-After` asks, at most a minute) and on other `5xx` answers, with exponential backoff.

That is safe for sends because every POST carries an `Idempotency-Key`, and a retry repeats the same key: MyComm then
replays the first answer instead of sending a second message. Pass your own key to make a whole operation of yours
repeatable, for example across a queue job's attempts:

```ts
const message = await mycomm.messages.send(
  { to: order.phone, body: `Order ${order.number} has shipped.` },
  { idempotencyKey: `order-shipped-${order.id}` },
);

message._meta.idempotentReplayed; // true when this was a replay
```

The request options also take `maxRetries`, `timeout` (milliseconds per attempt), `headers` and an `AbortSignal` as
`signal`, which also cancels the waits between retries.

## Webhooks

Verify each delivery with the signing secret of your webhook endpoint, then handle the typed event. Always pass the
**raw** request body: a parsed and re-encoded body no longer matches its signature.

```ts
import express from 'express';
import { Webhook, WebhookSignatureError } from '@mycomm/node';

const app = express();

app.post('/webhooks/mycomm', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = await Webhook.constructEvent(req.body, req.headers['mycomm-signature'], process.env.MYCOMM_WEBHOOK_SECRET!);
  } catch (error) {
    if (error instanceof WebhookSignatureError) return res.sendStatus(400);
    throw error;
  }

  if (Webhook.isKnown(event)) {
    switch (event.type) {
      case 'message.delivered':
        await markDelivered(event.data.message.id);
        break;
      case 'message.failed':
        await markFailed(event.data.message.id, event.data.message.failure?.code);
        break;
      case 'message.received':
        await handleReply(event.data.message.from, event.data.message.body);
        break;
    }
  }

  res.sendStatus(204); // also for an event you do not handle, or one added to MyComm later
});
```

In a route handler that gets a `Request` (Next.js, Hono, Cloudflare Workers, Bun, Deno), pass `await request.text()` and
`request.headers.get('MyComm-Signature')`.

Good to know:

- **Answer fast** with any 2xx and do the work in a queue. MyComm waits 10 seconds, then retries.
- **Deliveries can repeat and arrive out of order.** De-duplicate on `event.id` and never move a message status
  backwards.
- **Rotating the secret:** during the overlap MyComm signs with both secrets, so verification keeps working whichever one
  you hold. To switch without a gap, pass both: `Webhook.constructEvent(body, header, [newSecret, oldSecret])`.
- An event type this SDK version does not know is still returned; `Webhook.isKnown(event)` is then `false` and `data` is
  whatever MyComm sent. Answer 2xx.

Create the endpoint in the portal or with the API. The secret is shown once:

```ts
const endpoint = await mycomm.webhookEndpoints.create({
  url: 'https://example.com/webhooks/mycomm',
  events: ['message.delivered', 'message.failed', 'message.received'],
});

endpoint.secret;
```

## Partners

A partner key (`mc_partner_...`) provisions managed accounts and then acts as them on the normal API:

```ts
const partner = new MyComm({ apiKey: process.env.MYCOMM_PARTNER_KEY });

const account = await partner.partner.accounts.provision({
  external_ref: 'erp-business-20418',
  name: 'Acme Traders',
  country_iso: 'PK',
  timezone: 'Asia/Karachi',
});

const acme = partner.forAccount(account.id); // every call now carries MyComm-Account
await acme.messages.send({ to: '+923001234567', body: 'Welcome to Acme' });

const usage = await partner.partner.usage.get({ from: '2026-10-01', to: '2026-10-31' });
```

Or mint a key for the customer's own integration: `partner.partner.accountKeys.create(account.id, { name: 'ERP' })`.

## Uploading files

A file is a `File` or a `Blob`. `fileFromPath()` reads one from disk, `toFile()` builds one from bytes or text:

```ts
import { fileFromPath, toFile } from '@mycomm/node';

const media = await mycomm.media.upload({ file: await fileFromPath('/path/to/photo.jpg') });
const same = await mycomm.media.upload({ file: toFile(bytes, 'photo.jpg', 'image/jpeg') });

await mycomm.messages.send({ to: '+923001234567', media_ids: [media.id] });
```

## Testing your code

`MyCommFake` gives you a real client that never touches the network. Every operation answers with the example of the API
reference until you say otherwise. It works with any test runner.

```ts
import { FakeResponse, MyCommFake } from '@mycomm/node/testing';

const fake = new MyCommFake();
const notifier = new OrderNotifier(fake.client);

fake.respond('messages.send', { status: 'queued' }); // your values over the example
fake.respondOnce('messages.send', FakeResponse.error(422, 'RECIPIENT_OPTED_OUT'));

await notifier.orderShipped(order);

fake.assertCalled('messages.send', (request) => request.json?.to === order.phone);
fake.assertNotCalled('messages.sendBatch');
```

`FakeResponse` also has `page()`, `validationError()`, `noContent()`, `connectionError()` and `json()`. To test your
webhook receiver, `await FakeWebhook.make('message.delivered', { secret })` gives you a signed payload and its headers.

## Configuration

```ts
const mycomm = new MyComm({
  apiKey: process.env.MYCOMM_API_KEY,
  baseUrl: 'https://mycomm.cogneer.tech', // without /v1
  maxRetries: 2,
  timeout: 30_000, // milliseconds per attempt
  validate: true, // check arguments against the API's documented rules first
  defaultHeaders: {}, // sent with every request
  fetch: myFetch, // optional: your own fetch, for a proxy or instrumentation
});
```

## What every result carries

```ts
message._meta.requestId; // quote to support
message._meta.rateLimitRemaining; // requests left in the window
page.meta?.requestId; // the same for a page
```

A result is the JSON as MyComm sent it. `_meta` is not enumerable, so `JSON.stringify(message)` and `{ ...message }` hold
the payload only. Timestamps are ISO 8601 strings, as on the wire (`new Date(message.created_at)`); in parameters a `Date`
works as well.

MyComm adds fields and values without a new API version. The SDK is built for that: a field it does not know yet is still
on the object, and an enum value it does not know arrives as a plain string (enum fields are typed `Open<MessageStatus>`),
so nothing throws.

## Versioning

The SDK follows [semantic versioning](https://semver.org). It is generated from the same OpenAPI documents that the API is
tested against; [CHANGELOG.md](CHANGELOG.md) lists what each release added.

## Contributing

Most of `src/` is generated. See [docs/development.md](docs/development.md) before changing anything.

## License

MIT. See [LICENSE](LICENSE).
