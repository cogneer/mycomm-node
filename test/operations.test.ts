import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Page } from '../src/core/page.js';
import { examples, FakeResponse, MyCommFake } from '../src/testing/index.js';

/*
 * Every method of every resource, called with example arguments against the example answers the generator built from the
 * API reference. A row per operation, so a spec change that breaks a method names it.
 */

interface Row {
  operation: string;
  key: string;
  resource: string[];
  method: string;
  args: unknown[];
  http: string;
  path: string;
  format: 'none' | 'json' | 'multipart';
  returns: 'void' | 'null' | 'model' | 'maybe' | 'page' | 'json';
}

const rows = JSON.parse(readFileSync(new URL('./generated/operations.json', import.meta.url), 'utf8')) as Row[];
const minimal = JSON.parse(readFileSync(new URL('./generated/minimal.json', import.meta.url), 'utf8')) as {
  responses: Array<{ operation: string; key: string; status: number; body: unknown }>;
};

function call(fake: MyCommFake, row: Pick<Row, 'resource' | 'method' | 'args'>): Promise<unknown> {
  let target: Record<string, unknown> = fake.client as unknown as Record<string, unknown>;
  for (const segment of row.resource) target = target[segment] as Record<string, unknown>;
  const args = row.args.map((arg) => {
    if (arg === null || typeof arg !== 'object') return arg;
    return Object.fromEntries(
      Object.entries(arg).map(([name, value]) => [
        name,
        value === '@file' ? new File(['phone\n+923001234567\n'], 'contacts.csv', { type: 'text/csv' }) : value,
      ]),
    );
  });
  return (target[row.method] as (...args: unknown[]) => Promise<unknown>).apply(target, args);
}

describe('every operation', () => {
  it.each(rows.map((row) => [row.key, row] as const))(
    '%s calls the documented endpoint and reads the documented answer',
    async (_, row) => {
      const fake = new MyCommFake();

      const result = await call(fake, row);

      const calls = fake.calls(row.operation);
      expect(calls).toHaveLength(1);
      const request = calls[0]!;
      expect(request.method).toBe(row.http);
      expect(request.path).toBe(row.path);
      expect(request.header('Authorization')).toBe('Bearer mc_live_fake');

      if (['POST', 'PUT', 'PATCH'].includes(row.http)) {
        // The API refuses a write without a JSON object or a multipart body.
        if (row.format === 'multipart') {
          expect(request.form).toBeInstanceOf(FormData);
          expect(request.body).toBeUndefined();
        } else {
          expect(request.header('Content-Type')).toBe('application/json');
          expect(typeof JSON.parse(request.body!)).toBe('object');
          expect(Array.isArray(JSON.parse(request.body!))).toBe(false);
        }
      } else {
        expect(request.body).toBeUndefined();
        expect(request.form).toBeUndefined();
      }
      expect(request.header('Idempotency-Key') !== undefined).toBe(row.http === 'POST');

      const example = examples.responses[row.operation];
      switch (row.returns) {
        case 'void':
          expect(result).toBeUndefined();
          break;
        case 'null':
          expect(result).toBeNull();
          break;
        case 'json':
          expect(typeof result).toBe('object');
          break;
        case 'page': {
          const page = result as Page<unknown>;
          expect(page).toBeInstanceOf(Page);
          expect(page.data).toEqual((example!.body as { data: unknown[] }).data);
          expect(page.meta?.requestId).toBeDefined();
          break;
        }
        default: {
          expect(result).toEqual(example!.body);
          expect((result as { _meta: { status: number } })._meta.status).toBe(example!.status);
        }
      }
    },
  );

  it.each(minimal.responses.map((answer) => [`${answer.key} ${answer.status}`, answer] as const))(
    '%s reads the sparsest answer the reference allows',
    async (_, answer) => {
      const fake = new MyCommFake();
      fake.respond(answer.operation, FakeResponse.json(answer.body, answer.status));

      for (const row of rows.filter((row) => row.operation === answer.operation)) {
        const result = await call(fake, row);
        if (row.returns === 'page') {
          expect((result as Page<unknown>).data).toEqual((answer.body as { data: unknown[] }).data);
        } else if (row.returns !== 'void') {
          expect(result).toEqual(answer.body);
        }
      }
    },
  );

  it('covers every operation of both specs', () => {
    expect(rows.length).toBeGreaterThan(150);
    expect(rows.filter((row) => row.resource[0] === 'partner')).toHaveLength(11);
    expect(new Set(rows.map((row) => row.key)).size).toBe(rows.length);
  });
});
