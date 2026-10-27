/*
 * Runs the SDK against a real MyComm API: the key, contacts, groups, paging, idempotent replays, dry-run sends, uploads,
 * webhook endpoints, stats and the mapping of the API's errors. Not part of the test suite: run it before a release,
 * against a test account. It creates contacts, a group, a webhook endpoint and a media file, and deletes what the API lets
 * it delete. It sends no message: every send is a dry run.
 *
 *   MYCOMM_API_KEY=mc_live_... MYCOMM_BASE_URL=https://staging.mycomm.cogneer.tech npx tsx test/live/smoke.ts
 *
 * A local `./server` stack of the backend serves plain HTTP; with `REQUIRE_HTTPS=false` in its .env (local only) point
 * MYCOMM_BASE_URL at http://127.0.0.1:8880. Exits non-zero when a step fails.
 */
import {
  APIError,
  AuthenticationError,
  MyComm,
  NotFoundError,
  ValidationError,
  Webhook,
  toFile,
  type Contact,
} from '../../src/index.js';

const apiKey = process.env.MYCOMM_API_KEY;
if (apiKey === undefined) {
  console.error('Set MYCOMM_API_KEY.');
  process.exit(1);
}
const baseUrl = process.env.MYCOMM_BASE_URL ?? MyComm.DEFAULT_BASE_URL;
const mycomm = new MyComm({ apiKey, baseUrl, maxRetries: 0 });
const results = { ok: 0, failed: [] as string[] };

async function step<T>(name: string, run: () => Promise<T>): Promise<T | undefined> {
  try {
    const value = await run();
    results.ok++;
    console.log(`  ok    ${name}`);
    return value;
  } catch (error) {
    results.failed.push(name);
    const detail =
      error instanceof APIError ? error.summary() : error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.log(`  FAIL  ${name}: ${detail}`);
    return undefined;
  }
}

function check(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function expectError(Class: abstract new (...args: never[]) => Error, run: () => Promise<unknown>): Promise<Error> {
  try {
    await run();
  } catch (error) {
    check(error instanceof Class, `expected ${Class.name}, got ${error instanceof Error ? error.name : String(error)}`);
    return error as Error;
  }
  throw new Error(`expected ${Class.name}, but the call succeeded`);
}

const run = Date.now().toString(36);
const phone = (n: number) => `+92300${String(1_000_000 + ((Date.now() + n) % 8_999_999)).padStart(7, '0')}`;

console.log(`MyComm Node SDK live check against ${baseUrl}`);

const account = await step('account.get and verify()', async () => {
  const verified = await mycomm.verify();
  check(verified.ok, verified.problems.join('; '));
  const found = await mycomm.account.get();
  check(found.id === verified.account?.id, 'verify() and account.get() disagree');
  check(typeof found._meta.requestId === 'string', 'no request id');
  return found;
});
void account;

const inboxes = await step('inboxes.list and channels.list', async () => {
  const page = await mycomm.inboxes.list({ limit: 10 });
  await mycomm.channels.list();
  await mycomm.channels.types();
  return page.data;
});
const inbox = inboxes?.[0];

const contacts: Contact[] = [];
await step('contacts.create, show, update (clear with null)', async () => {
  const created = await mycomm.contacts.create({
    first_name: 'Ada',
    email: `ada-${run}@example.com`,
    identities: [{ type: 'phone', address: phone(1) }],
  });
  contacts.push(created);
  const updated = await mycomm.contacts.update(created.id, { last_name: 'Lovelace', email: null });
  check(updated.last_name === 'Lovelace' && updated.email === null, 'update did not apply');
  const shown = await mycomm.contacts.show(created.id);
  check(shown.id === created.id, 'show returned another contact');
});

await step('idempotent replay of a create', async () => {
  const key = `node-sdk-${run}-replay`;
  const params = { first_name: 'Grace', identities: [{ type: 'phone', address: phone(2) }] };
  const first = await mycomm.contacts.create(params, { idempotencyKey: key });
  const second = await mycomm.contacts.create(params, { idempotencyKey: key });
  contacts.push(first);
  check(second.id === first.id, 'the replay created a second contact');
  check(second._meta.idempotentReplayed, 'Idempotent-Replayed was not true');
});

await step('contacts.upsertByIdentity', async () => {
  const upserted = await mycomm.contacts.upsertByIdentity({
    identity: { type: 'phone', address: phone(3) },
    first_name: 'Katherine',
  });
  contacts.push(upserted);
});

await step('paging: list with limit 1 and all()', async () => {
  const page = await mycomm.contacts.list({ limit: 1 });
  check(page.data.length === 1, 'a page of one held more or less');
  check(page.hasMore(), 'no next page after the first of several contacts');
  let seen = 0;
  for await (const contact of mycomm.contacts.all({ limit: 1 })) {
    void contact;
    if (++seen >= 3) break;
  }
  check(seen === 3, `all() yielded ${seen} contacts`);
});

await step('groups.create, members.add, members.list, delete', async () => {
  const group = await mycomm.groups.create({ name: `Node SDK ${run}` });
  await mycomm.groups.members.add(group.id, { contact_ids: contacts.map((contact) => contact.id) });
  const members = await mycomm.groups.members.list(group.id);
  check(members.data.length === contacts.length, `the group has ${members.data.length} members`);
  await mycomm.groups.delete(group.id);
});

await step('messages.send dry run and messages.list', async () => {
  const preview = await mycomm.messages.send({
    inbox_id: inbox?.id,
    to: phone(4),
    body: 'Node SDK live check',
    category: 'transactional',
    dry_run: true,
  });
  check(preview.dry_run === true && preview.id === null, 'the dry run was not a preview');
  check(typeof preview.segments === 'number', 'no segment count');
  await mycomm.messages.list({ limit: 5, status: ['delivered', 'failed'] });
});

await step('messages.sendBatch dry run', async () => {
  const batch = await mycomm.messages.sendBatch({
    dry_run: true,
    defaults: { category: 'transactional', inbox_id: inbox?.id },
    messages: [
      { to: phone(5), body: 'One' },
      { to: 'not a number', body: 'Two' },
    ],
  });
  check(batch.results.length === 2, 'two items, not two results');
  check(batch.results[1]!.error !== null, 'the bad number was accepted');
});

await step('templates.preview', async () => {
  const rendered = await mycomm.templates.preview({ body: 'Hi {{name}}', variables: { name: 'Ada' } });
  void rendered;
});

await step('media.upload and media.get', async () => {
  const png = Uint8Array.from(
    atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
    (char) => char.charCodeAt(0),
  );
  const media = await mycomm.media.upload({ file: toFile(png, 'dot.png', 'image/png') });
  const fetched = await mycomm.media.get(media.id);
  check(fetched.id === media.id, 'media.get returned other media');
});

await step('webhookEndpoints.create, rotateSecret, delete, and a signature check', async () => {
  const endpoint = await mycomm.webhookEndpoints.create({
    url: `https://example.com/mycomm-node-${run}`,
    events: ['message.delivered'],
  });
  check(endpoint.secret.length > 0, 'no secret');
  const body = JSON.stringify({ id: `evt-${run}`, type: 'ping', created_at: new Date().toISOString(), data: {} });
  await Webhook.verify(body, await Webhook.sign(body, endpoint.secret), endpoint.secret);
  const rotated = await mycomm.webhookEndpoints.rotateSecret(endpoint.id);
  check(rotated.secret !== endpoint.secret, 'the rotated secret is the old one');
  await mycomm.webhookEndpoints.delete(endpoint.id);
});

await step('stats.summary and stats.daily', async () => {
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
  await mycomm.stats.summary({ from, to });
  await mycomm.stats.daily({ from, to });
});

await step('errors: 404, 401 and the server-side 422', async () => {
  await expectError(NotFoundError, () => mycomm.messages.show('01923f80-5c6a-7b10-9c21-0d3e4f5a6b7c'));
  await expectError(AuthenticationError, () =>
    new MyComm({ apiKey: 'mc_live_not_a_real_key_0000000000', baseUrl, maxRetries: 0 }).account.get(),
  );
  const unchecked = new MyComm({ apiKey, baseUrl, maxRetries: 0, validate: false });
  const invalid = (await expectError(ValidationError, () =>
    unchecked.messages.send({ to: phone(6), body: 'x', expires_in: 5, dry_run: true }),
  )) as ValidationError;
  check(Object.keys(invalid.fields()).includes('expires_in'), `the 422 named ${Object.keys(invalid.fields()).join(', ')}`);
});

await step('tidy up: delete the contacts', async () => {
  for (const contact of contacts) await mycomm.contacts.delete(contact.id);
});

console.log(
  `\n${results.ok} steps passed, ${results.failed.length} failed${results.failed.length > 0 ? `: ${results.failed.join(', ')}` : ''}.`,
);
process.exit(results.failed.length > 0 ? 1 : 0);
