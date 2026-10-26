/*
 * The examples of README.md, for the type checker (`npm run lint`): a README that drifts from the types fails here.
 */
import {
  APIError,
  ConnectionError,
  InvalidArgumentError,
  MessageCategory,
  MyComm,
  ValidationError,
  Webhook,
  WebhookSignatureError,
  fileFromPath,
  toFile,
} from '../src/index.js';
import { FakeResponse, FakeWebhook, MyCommFake } from '../src/testing/index.js';

declare function markDelivered(id: string): Promise<void>;
declare function markFailed(id: string, code: string | undefined): Promise<void>;
declare function handleReply(from: string | null, body: string | null): Promise<void>;

export async function readme(
  mycomm: MyComm,
  text: string,
  number: string,
  groupId: string,
  id: string,
  bytes: Uint8Array,
): Promise<void> {
  const message = await mycomm.messages.send({
    to: '+923001234567',
    body: 'Sale ends tonight. Reply STOP to opt out.',
    category: 'marketing',
    send_after: new Date(Date.now() + 2 * 60 * 60 * 1000),
    reference_id: 'campaign-7-user-991',
    metadata: { user_id: 991 },
  });
  for (const warning of message.warnings) console.warn(warning.message);
  message.status satisfies string;

  const preview = await mycomm.messages.send({ to: '+923001234567', body: text, dry_run: true });
  preview.segments satisfies number | null | undefined;
  preview.hold_reason satisfies string | null | undefined;

  const batch = await mycomm.messages.sendBatch({
    messages: [
      { to: '+923001234567', body: 'Hi Ada' },
      { to: '+923331112222', body: 'Hi Grace' },
    ],
    defaults: { category: 'transactional' },
  });
  for (const result of batch.results) {
    if (result.error !== null) console.error(`Message ${result.index} was rejected: ${result.error.code}`);
  }
  MessageCategory.Marketing satisfies 'marketing';

  try {
    await mycomm.messages.send({ to: number, body: text, expires_in: 30 });
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      void [error.message, error.field, error.rule, error.violations];
    }
  }

  const verified = await mycomm.verify({ to: '+923001234567' });
  if (!verified.ok) for (const problem of verified.problems) console.log(problem);
  verified.holdReason satisfies string | null;

  const page = await mycomm.contacts.list({ group_id: groupId, limit: 100 });
  for (const contact of page) void contact.id;
  for await (const contact of mycomm.contacts.all({ group_id: groupId })) void contact.id;
  void [page.next_cursor, page.hasMore(), await page.next(), (await mycomm.conversations.messages(id)).autoPaging()];

  await mycomm.contacts.update(id, { first_name: 'Ada' });
  await mycomm.contacts.update(id, { first_name: 'Ada', email: null });

  try {
    await mycomm.messages.send({ to: number, body: text, category: 'marketing' });
  } catch (error) {
    if (error instanceof ValidationError) {
      error.fields();
    } else if (error instanceof APIError) {
      void [
        error.is('RECIPIENT_OPTED_OUT'),
        error.status,
        error.code,
        error.details,
        error.requestId,
        error.docUrl,
        error.summary(),
      ];
    } else if (error instanceof ConnectionError) {
      // unreachable
    }
  }

  const shipped = await mycomm.messages.send(
    { to: '+923001234567', body: 'Order 1 has shipped.' },
    { idempotencyKey: 'order-shipped-1' },
  );
  shipped._meta.idempotentReplayed satisfies boolean;

  const endpoint = await mycomm.webhookEndpoints.create({
    url: 'https://example.com/webhooks/mycomm',
    events: ['message.delivered', 'message.failed', 'message.received'],
  });
  endpoint.secret satisfies string;

  const partner = new MyComm({ apiKey: process.env.MYCOMM_PARTNER_KEY });
  const account = await partner.partner.accounts.provision({
    external_ref: 'erp-business-20418',
    name: 'Acme Traders',
    country_iso: 'PK',
    timezone: 'Asia/Karachi',
  });
  const acme = partner.forAccount(account.id);
  await acme.messages.send({ to: '+923001234567', body: 'Welcome to Acme' });
  await partner.partner.usage.get({ from: '2026-10-01', to: '2026-10-31' });
  await partner.partner.accountKeys.create(account.id, { name: 'ERP' });

  const media = await mycomm.media.upload({ file: await fileFromPath('/path/to/photo.jpg') });
  await mycomm.media.upload({ file: toFile(bytes, 'photo.jpg', 'image/jpeg') });
  await mycomm.messages.send({ to: '+923001234567', media_ids: [media.id] });

  void [message._meta.requestId, message._meta.rateLimitRemaining, page.meta?.requestId];
}

export async function receiver(body: Buffer, header: string | string[] | undefined): Promise<number> {
  let event;
  try {
    event = await Webhook.constructEvent(body, header, 'whsec');
  } catch (error) {
    if (error instanceof WebhookSignatureError) return 400;
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
  return 204;
}

export async function testing(phone: string): Promise<void> {
  const fake = new MyCommFake();
  fake.respond('messages.send', { status: 'queued' });
  fake.respondOnce('messages.send', FakeResponse.error(422, 'RECIPIENT_OPTED_OUT'));
  fake.assertCalled('messages.send', (request) => request.json?.to === phone);
  fake.assertNotCalled('messages.sendBatch');
  const webhook = await FakeWebhook.make('message.delivered', { secret: 'whsec' });
  void [webhook.payload, webhook.headers()];
}
