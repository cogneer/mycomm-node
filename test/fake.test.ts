import { describe, expect, it } from 'vitest';
import { ConnectionError, NotFoundError, RateLimitError, ValidationError, Webhook } from '../src/index.js';
import { examples, FakeAssertionError, FakeResponse, FakeWebhook, MyCommFake } from '../src/testing/index.js';

describe('the fake', () => {
  it('answers with the example of the reference by default', async () => {
    const fake = new MyCommFake();

    const message = await fake.client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(message).toEqual(examples.responses['messages.send']!.body);
    expect(message._meta.status).toBe(examples.responses['messages.send']!.status);
  });

  it('lays the given values over the example', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.show', { status: 'failed', failure: { code: 'CARRIER_REJECTED' } });

    const message = await fake.client.messages.show('m-1');

    expect(message.status).toBe('failed');
    expect(message.to).toBe((examples.responses['messages.show']!.body as { to: string }).to);
  });

  it('uses queued answers once, in order, before the standing one', async () => {
    const fake = new MyCommFake();
    fake
      .respond('messages.show', { status: 'delivered' })
      .respondOnce('messages.show', { status: 'queued' })
      .respondOnce('messages.show', { status: 'sent' });

    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await fake.client.messages.show('m-1')).status);

    expect(statuses).toEqual(['queued', 'sent', 'delivered', 'delivered']);
  });

  it('computes an answer from the request', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.send', (request) => ({ to: request.json?.to }));

    const message = await fake.client.messages.send({ to: '+923339876543', body: 'Hi' });

    expect(message.to).toBe('+923339876543');
  });

  it('throws the error of a stubbed failure at once', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.show', FakeResponse.error(404, 'NOT_FOUND', 'No message has that id.'));
    fake.respond('messages.send', FakeResponse.error(429, 'RATE_LIMITED', 'Slow down.', {}, { 'Retry-After': '2' }));

    await expect(fake.client.messages.show('m-1')).rejects.toBeInstanceOf(NotFoundError);
    const limited = (await fake.client.messages
      .send({ to: '+923001234567', body: 'Hi' })
      .catch((error: unknown) => error)) as RateLimitError;
    expect(limited).toBeInstanceOf(RateLimitError);
    expect(limited.retryAfter()).toBe(2);
    fake.assertCalledTimes('messages.send', 1);
  });

  it('stubs validation and network failures', async () => {
    const fake = new MyCommFake();
    fake.respondOnce('messages.send', FakeResponse.validationError({ to: 'Not a phone number.' }));
    fake.respondOnce('messages.send', FakeResponse.connectionError());

    const invalid = (await fake.client.messages
      .send({ to: '+923001234567', body: 'Hi' })
      .catch((error: unknown) => error)) as ValidationError;
    expect(invalid).toBeInstanceOf(ValidationError);
    expect(invalid.messagesFor('to')).toEqual(['Not a phone number.']);
    await expect(fake.client.messages.send({ to: '+923001234567', body: 'Hi' })).rejects.toBeInstanceOf(ConnectionError);
  });

  it('answers 204 with nothing', async () => {
    const fake = new MyCommFake();
    fake.respond('contacts.delete', FakeResponse.noContent());

    expect(await fake.client.contacts.delete('c-1')).toBeNull();
  });

  it('records what was sent', async () => {
    const fake = new MyCommFake({ accountId: 'acc-1' });

    await fake.client.messages.send({ to: '+923001234567', body: 'Hi', metadata: { order: 7 } }, { idempotencyKey: 'order-7' });

    const [request] = fake.calls('messages.send');
    expect(request!.json).toEqual({ to: '+923001234567', body: 'Hi', metadata: { order: 7 } });
    expect(request!.header('Idempotency-Key')).toBe('order-7');
    expect(request!.header('MyComm-Account')).toBe('acc-1');
    fake
      .assertCalled('messages.send', (call) => call.json?.to === '+923001234567')
      .assertCalledTimes('messages.send', 1)
      .assertNotCalled('contacts.list');
  });

  it.each([
    [(fake: MyCommFake) => fake.assertCalled('messages.send'), 'Expected a call of messages.send, but none was made.'],
    [(fake: MyCommFake) => fake.assertCalledTimes('messages.send', 2), 'Expected 2 call(s) of messages.send, but 0 were made.'],
  ])('fails its assertions with a readable message', (assertion, message) => {
    const fake = new MyCommFake();

    expect(() => assertion(fake)).toThrow(FakeAssertionError);
    expect(() => assertion(fake)).toThrow(message);
  });

  it('fails assertNothingCalled naming the calls', async () => {
    const fake = new MyCommFake();
    fake.assertNothingCalled();
    await fake.client.account.get();

    expect(() => fake.assertNothingCalled()).toThrow('Expected no API call, but these were made: account.get.');
  });

  it('builds a signed webhook delivery for a receiver test', async () => {
    const webhook = await FakeWebhook.make('message.delivered', { secret: 'whsec_test' });

    expect(webhook.headers()['MyComm-Signature']).toBe(webhook.signature);
    const event = await Webhook.constructEvent(webhook.payload, webhook.signature, 'whsec_test');
    expect(event.type).toBe('message.delivered');
    await expect(FakeWebhook.make('no.such.event')).rejects.toThrow('No webhook event is named no.such.event.');
  });
});
