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

  it('dry-runs the send from the line it is given', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.send', FakeResponse.json({ id: null, status: null, hold_reason: null }, 200));

    await fake.client.verify({ to: '+923001234567', lineId: '0198f3a2-7c41-7e0b-9d52-6a1f3b8c4e12' });

    fake.assertCalled('messages.send', (request) => request.json?.line_id === '0198f3a2-7c41-7e0b-9d52-6a1f3b8c4e12');
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

  it('verifies_a_partner_key_on_a_partner_route_and_dry_runs_through_its_line', async () => {
    const fake = new MyCommFake({ apiKey: 'mc_partner_fake' });
    fake.respond('messages.send', FakeResponse.json({ id: null, status: null, hold_reason: null }, 200));
    fake.respond('account.get', FakeResponse.error(403, 'PARTNER_ROUTE_NOT_ALLOWED', 'A partner key cannot use this route.'));

    const viaOption = await fake.client.verify({ to: '+923001234567', lineId: 'line-1' });
    const viaForLine = await fake.client.forLine('line-2').verify({ to: '+923001234567' });

    expect(viaOption.ok).toBe(true);
    expect(viaOption.checks.map((check) => check.name)).toEqual(['key', 'send']);
    expect(viaOption.account).toBeNull();
    expect(viaForLine.ok).toBe(true);
    fake.assertNotCalled('account.get').assertCalledTimes('partner.lines.list', 2);
    const sends = fake.calls('messages.send');
    expect(sends[0]!.header('MyComm-Line')).toBe('line-1');
    expect(sends[0]!.json?.line_id).toBeUndefined();
    expect(sends[1]!.header('MyComm-Line')).toBe('line-2');
  });

  it('says a partner key needs a line to dry-run a send', async () => {
    const fake = new MyCommFake({ apiKey: 'mc_partner_fake' });

    const result = await fake.client.verify({ to: '+923001234567' });

    expect(result.ok).toBe(false);
    expect(result.checks[0]!.ok).toBe(true);
    expect(result.problems[0]).toContain('line');
    fake.assertNotCalled('messages.send');
  });

  it('reports a refused partner key', async () => {
    const fake = new MyCommFake({ apiKey: 'mc_partner_fake' });
    fake.respond('partner.lines.list', FakeResponse.error(401, 'UNAUTHENTICATED', 'The API key is not valid.'));

    const result = await fake.client.verify({ to: '+923001234567', lineId: 'line-1' });

    expect(result.problems).toEqual(['The API key is not valid.']);
    fake.assertNotCalled('messages.send');
  });
});
