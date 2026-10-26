import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EVENT_TYPES, Webhook, WebhookSignatureError, type WebhookEvent } from '../src/index.js';
import { examples, FakeWebhook } from '../src/testing/index.js';

const SECRET = '5f1c8a0e9d3b47c2a6e4f0b1d2c3a4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1';
const T = 1759310182;
const minimal = JSON.parse(readFileSync(new URL('./generated/minimal.json', import.meta.url), 'utf8')) as {
  events: Record<string, unknown>;
};

const hmac = (secret: string, body: string, t = T) => createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');

describe('webhooks', () => {
  it('accepts the signature format of the API reference', async () => {
    // The backend signs `HMAC-SHA256(secret, "<t>.<raw body>")` as lowercase hex.
    const body = '{"id":"01923f88-d4e5-7f6a-8b7c-8d9e0f1a2b3c","type":"ping"}';
    const header = `t=${T},v1=${hmac(SECRET, body)}`;

    await Webhook.verify(body, header, SECRET, { now: T });

    expect(await Webhook.sign(body, SECRET, T)).toBe(header);
  });

  it('verifies the raw bytes as received, a Buffer included', async () => {
    const body = '{"id":"e1","type":"ping","note":"سلام"}';
    const header = `t=${T},v1=${hmac(SECRET, body)}`;

    await Webhook.verify(Buffer.from(body), header, SECRET, { now: T });
    await Webhook.verify(new TextEncoder().encode(body), [header], SECRET, { now: T });
  });

  it('returns the typed event of a verified delivery', async () => {
    const webhook = await FakeWebhook.make('message.delivered', {
      overrides: { data: { message: { status: 'delivered' } } },
      secret: SECRET,
    });

    const event = await Webhook.constructEvent(webhook.payload, webhook.signature, SECRET);

    expect(Webhook.isKnown(event)).toBe(true);
    if (!Webhook.isKnown(event) || event.type !== 'message.delivered') throw new Error('Expected message.delivered.');
    expect(event.id).toBe((examples.events['message.delivered'] as { id: string }).id);
    expect(event.data.message.status).toBe('delivered');
  });

  it('narrows the data of an event on its type', async () => {
    const event = (await Webhook.constructEvent(
      (await FakeWebhook.make('ping', { secret: SECRET })).payload,
      (await FakeWebhook.make('ping', { secret: SECRET })).signature,
      SECRET,
    )) as WebhookEvent;

    switch (event.type) {
      case 'ping':
        expect(event.type).toBe('ping');
        break;
      default:
        throw new Error('Expected ping.');
    }
  });

  it('accepts either signature during a secret rotation', async () => {
    const body = (await FakeWebhook.make('ping')).payload;
    const header = `t=${T},v1=${hmac('old', body)},v1=${hmac('new', body)}`;

    await Webhook.verify(body, header, 'new', { now: T });
    await Webhook.verify(body, header, 'old', { now: T });
    await Webhook.verify(body, `t=${T},v1=${hmac('new', body)}`, ['old', 'new'], { now: T });
  });

  it('rejects a body that was changed after signing', async () => {
    const body = '{"id":"e1","type":"ping"}';
    const header = `t=${T},v1=${hmac(SECRET, body)}`;

    await expect(Webhook.verify(body.replace('ping', 'pong'), header, SECRET, { now: T })).rejects.toThrow(
      'No signature of the webhook matches',
    );
    await expect(Webhook.verify(body, header, 'another secret', { now: T })).rejects.toBeInstanceOf(WebhookSignatureError);
  });

  it.each([
    [-301, false],
    [-300, true],
    [300, true],
    [301, false],
  ])('treats a timestamp %i seconds off as accepted: %s', async (offset, accepted) => {
    const body = '{"id":"e1","type":"ping"}';
    const verify = Webhook.verify(body, `t=${T},v1=${hmac(SECRET, body)}`, SECRET, { now: T + offset });

    if (accepted) await expect(verify).resolves.toBeUndefined();
    else await expect(verify).rejects.toThrow('outside the tolerance');
  });

  it.each([undefined, null, '', 'garbage', 't=abc,v1=00', `t=${T}`, 'v1=00'])(
    'rejects the signature header %s',
    async (header) => {
      await expect(Webhook.verify('{}', header, SECRET, { now: T })).rejects.toThrow('missing or malformed');
    },
  );

  it('rejects a verified body that is not an event', async () => {
    const body = '{"hello":"world"}';

    await expect(Webhook.constructEvent(body, `t=${T},v1=${hmac(SECRET, body)}`, SECRET, { now: T })).rejects.toThrow(
      'not a MyComm event',
    );
  });

  it('keeps an event of a type added to the API later', async () => {
    const body = '{"id":"e1","type":"rocket.launched","created_at":"2026-10-01T09:15:02Z","data":{"x":1}}';

    const event = await Webhook.constructEvent(body, `t=${T},v1=${hmac(SECRET, body)}`, SECRET, { now: T });

    expect(Webhook.isKnown(event)).toBe(false);
    expect(event.type).toBe('rocket.launched');
    expect(event.data).toEqual({ x: 1 });
  });

  it.each(EVENT_TYPES.map((type) => [type]))('reads the example and the sparsest payload of %s', (type) => {
    for (const payload of [examples.events[type], minimal.events[type]]) {
      const event = Webhook.parse(JSON.stringify(payload));
      expect(event.type).toBe(type);
      expect(Webhook.isKnown(event)).toBe(true);
    }
  });

  it('knows every event of the reference', () => {
    expect(EVENT_TYPES).toHaveLength(46);
    expect(Object.keys(examples.events).sort()).toEqual([...EVENT_TYPES].sort());
  });
});
