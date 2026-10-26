import { describe, expect, it } from 'vitest';
import { InvalidArgumentError, type MessagesSendParams } from '../src/index.js';
import { MyCommFake } from '../src/testing/index.js';

/*
 * The checks the SDK runs before it sends: limits and rules written in the OpenAPI document, so a mistake fails here with
 * the field named instead of as a round trip to the server.
 */

async function refused(call: () => Promise<unknown>): Promise<InvalidArgumentError> {
  try {
    await call();
  } catch (error) {
    if (error instanceof InvalidArgumentError) return error;
    throw error;
  }
  throw new Error('Expected the call to be refused before it was sent.');
}

const UUID = '01923f80-5c6a-7b10-9c21-0d3e4f5a6b7c';

describe('validation', () => {
  it('refuses a send with no recipient and no content, naming both', async () => {
    const fake = new MyCommFake();
    const error = await refused(() => fake.client.messages.send({ category: 'transactional' }));

    expect(error.operation).toBe('messages.send');
    expect(error.violations.map((violation) => violation.rule)).toEqual(['REQUIRED_WITH', 'REQUIRED_WITH']);
    expect(error.message).toContain('Give one of to, contact_id');
    expect(error.message).toContain('Give at least one of content, body, media_ids, template_id');
    fake.assertNothingCalled();
  });

  it('refuses both to and contact_id', async () => {
    const error = await refused(() =>
      new MyCommFake().client.messages.send({ to: '+923001234567', contact_id: UUID, body: 'Hi' }),
    );

    expect(error.rule).toBe('EXCLUSIVE');
    expect(error.field).toBe('contact_id');
  });

  it('requires a category on the bulk lane', async () => {
    const error = await refused(() => new MyCommFake().client.messages.send({ to: '+923001234567', body: 'Hi', lane: 'bulk' }));

    expect(error.rule).toBe('REQUIRED_WHEN');
    expect(error.message).toBe('category is required when lane is bulk.');
  });

  it('needs a template for variables', async () => {
    const error = await refused(() =>
      new MyCommFake().client.messages.send({ to: '+923001234567', body: 'Hi', variables: { name: 'Amina' } }),
    );

    expect(error.field).toBe('variables');
    expect(error.message).toBe('variables needs template_id.');
  });

  it.each([
    ['expires_in too small', 'expires_in', 30, 'OUT_OF_RANGE', 'between 60 and 604800 (got 30)'],
    ['expires_in too large', 'expires_in', 700000, 'OUT_OF_RANGE', 'between 60 and 604800'],
    ['reference_id with a space', 'reference_id', 'order 1', 'INVALID_FORMAT', 'expected format'],
    ['reference_id too long', 'reference_id', 'x'.repeat(101), 'TOO_LONG', 'at most 100 characters (got 101)'],
    ['not a uuid', 'inbox_id', 'inbox-1', 'INVALID_FORMAT', 'must be a UUID'],
    ['unknown category', 'category', 'promo', 'INVALID_ENUM', 'must be one of transactional, marketing'],
    [
      'too many metadata keys',
      'metadata',
      Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`k${i + 1}`, 'v'])),
      'TOO_LONG',
      'at most 50 keys',
    ],
    ['nested metadata', 'metadata', { order: { id: 1 } }, 'INVALID_TYPE', "'order' does not"],
    ['metadata over 2 KB', 'metadata', { note: 'x'.repeat(2100) }, 'TOO_LONG', 'at most 2048 bytes as JSON'],
  ])('keeps %s inside the documented limits', async (_, field, value, rule, text) => {
    const params = { [field]: value, to: '+923001234567', body: 'Hi' } as unknown as MessagesSendParams;
    const error = await refused(() => new MyCommFake().client.messages.send(params));

    expect(error.field).toBe(field);
    expect(error.rule).toBe(rule);
    expect(error.message).toContain(text);
  });

  it('counts characters, not UTF-16 units, against a length limit', async () => {
    const fake = new MyCommFake();
    await fake.client.messages.send({ to: '+923001234567', body: 'Hi', reference_id: '😀'.repeat(100) });

    fake.assertCalledTimes('messages.send', 1);
  });

  it('reports every problem of a call, not only the first', async () => {
    const error = await refused(() => new MyCommFake().client.messages.send({ expires_in: 5, reference_id: 'a b' }));

    expect(error.violations.length).toBeGreaterThanOrEqual(3);
    expect(error.message).toContain('more');
  });

  it('checks the limit of a list call', async () => {
    const error = await refused(() => new MyCommFake().client.messages.list({ limit: 500 }));

    expect(error.field).toBe('limit');
    expect(error.rule).toBe('OUT_OF_RANGE');
  });

  it('catches a required argument left out by a caller without TypeScript', async () => {
    const error = await refused(() => new MyCommFake().client.contacts.upsertByIdentity({} as never));

    expect(error.rule).toBe('REQUIRED');
  });

  it('lets a valid call through and sends it', async () => {
    const fake = new MyCommFake();
    await fake.client.messages.send({
      to: '+923001234567',
      body: 'Hi',
      category: 'marketing',
      expires_in: 600,
      reference_id: 'order-1',
      metadata: { order: 1 },
    });

    fake.assertCalledTimes('messages.send', 1);
  });

  it('can be turned off, leaving the decision to the server', async () => {
    const fake = new MyCommFake({ validate: false });

    await fake.client.messages.send({ expires_in: 5 });

    fake.assertCalledTimes('messages.send', 1);
  });
});
