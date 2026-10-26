import { describe, expect, it } from 'vitest';
import { FakeResponse, MyCommFake } from '../src/testing/index.js';

describe('verify()', () => {
  it('passes when the key works and a dry run is accepted, and sends nothing', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.send', FakeResponse.json({ id: null, status: null, hold_reason: null }, 200));

    const result = await fake.client.verify({ to: '+923001234567' });

    expect(result.ok).toBe(true);
    expect(result.checks.map((check) => check.name)).toEqual(['key', 'send']);
    expect(result.account?.id).toBeDefined();
    fake.assertCalled('messages.send', (request) => request.json?.dry_run === true && request.json?.to === '+923001234567');
  });

  it('reports a refused key as a failed check instead of throwing', async () => {
    const fake = new MyCommFake();
    fake.respond('account.get', FakeResponse.error(401, 'UNAUTHENTICATED', 'The API key is not valid.'));

    const result = await fake.client.verify({ to: '+923001234567' });

    expect(result.ok).toBe(false);
    expect(result.problems).toEqual(['The API key is not valid.']);
    fake.assertNotCalled('messages.send');
  });

  it('reports the reason a send would be refused, and a predicted hold', async () => {
    const fake = new MyCommFake();
    fake.respondOnce(
      'messages.send',
      FakeResponse.error(422, 'RECIPIENT_IS_CHANNEL', 'The recipient is the number of the channel.'),
    );
    fake.respondOnce('messages.send', FakeResponse.json({ id: null, hold_reason: 'quiet_hours' }, 200));

    const refused = await fake.client.verify({ to: '+923001234567' });
    const held = await fake.client.verify({ to: '+923001234567' });

    expect(refused.problems).toEqual(['The recipient is the number of the channel.']);
    expect(held.ok).toBe(true);
    expect(held.holdReason).toBe('quiet_hours');
    expect(held.checks[1]!.message).toBe('A message to +923001234567 would be accepted but held (quiet_hours).');
  });

  it('checks only the key when no number is given', async () => {
    const fake = new MyCommFake();

    const result = await fake.client.verify();

    expect(result.checks).toHaveLength(1);
    fake.assertNotCalled('messages.send');
  });
});
