import { describe, expect, it } from 'vitest';
import {
  APIError,
  AuthenticationError,
  BadRequestError,
  ConflictError,
  ConnectionError,
  InvalidHeaderError,
  MyComm,
  MyCommError,
  NotFoundError,
  PayloadTooLargeError,
  PermissionDeniedError,
  RateLimitError,
  ServerError,
  UnexpectedResponseError,
  UnprocessableError,
  UnsupportedMediaTypeError,
  ValidationError,
  toFile,
} from '../src/index.js';
import { MESSAGE, error, json, offline, scripted } from './helpers.js';

describe('requests', () => {
  it('authenticates and identifies itself', async () => {
    const { client, transport } = scripted([json(202, MESSAGE)]);

    await client.messages.send({ to: '+923001234567', body: 'Hi' });

    const request = transport.requests[0]!;
    expect(request.url).toBe('https://mycomm.cogneer.tech/v1/messages');
    expect(request.header('authorization')).toBe('Bearer mc_live_test');
    expect(request.header('Accept')).toBe('application/json');
    expect(request.header('User-Agent')).toMatch(/^mycomm-node\/\d+\.\d+\.\d+ node\/v\d+/);
  });

  it.each(['POST', 'PATCH'])('sends an empty JSON object on a %s without fields', async (method) => {
    const { client, transport } = scripted([json(200, MESSAGE)]);

    await (method === 'POST' ? client.conversations.read('c-1') : client.account.update({}));

    expect(transport.requests[0]!.body).toBe('{}');
    expect(transport.requests[0]!.header('Content-Type')).toBe('application/json');
  });

  it('encodes the body as JSON without escaping slashes or unicode, and dates as ISO 8601', async () => {
    const { client, transport } = scripted([json(202, MESSAGE)]);

    await client.messages.send({
      to: '+923001234567',
      body: 'سلام https://x.test/a',
      send_after: new Date(Date.UTC(2026, 9, 1, 9, 15, 2)),
    });

    expect(transport.requests[0]!.body).toBe(
      '{"to":"+923001234567","body":"سلام https://x.test/a","send_after":"2026-10-01T09:15:02.000Z"}',
    );
  });

  it('clears a field with null and leaves it alone when left out', async () => {
    const { client, transport } = scripted([json(200, { id: 'p-1' })]);

    await client.pairingCodes.create({ device_name: null });
    await client.pairingCodes.create({});
    await client.pairingCodes.create({ device_name: undefined });

    expect(transport.requests.map((request) => request.body)).toEqual(['{"device_name":null}', '{}', '{}']);
  });

  it('builds the query string and leaves out what was not given', async () => {
    const { client, transport } = scripted([json(200, { data: [], next_cursor: null })]);

    await client.messages.list({
      status: ['queued', 'sent'],
      created_after: new Date(Date.UTC(2026, 9, 1)),
      limit: 50,
      cursor: undefined,
      reference_id: 'a b+c',
    });

    const request = transport.requests[0]!;
    expect(request.query).toEqual({
      status: 'queued,sent',
      created_after: '2026-10-01T00:00:00.000Z',
      limit: '50',
      reference_id: 'a b+c',
    });
    expect(request.url).toContain('reference_id=a%20b%2Bc');
    expect(request.url).toContain('status=queued%2Csent');
  });

  it('escapes path arguments', async () => {
    const { client, transport } = scripted([json(200, MESSAGE)]);

    await client.messages.show('a/b?c');

    expect(transport.requests[0]!.path).toBe('/v1/messages/a%2Fb%3Fc');
  });

  it('refuses an empty path argument, which would reach another endpoint', async () => {
    const { client, transport } = scripted([json(200, MESSAGE)]);

    await expect(client.contacts.show('')).rejects.toThrow('id must be a non-empty string.');
    await expect(client.contacts.show(undefined as unknown as string)).rejects.toThrow(MyCommError);
    expect(transport.requests).toHaveLength(0);
  });

  it('gives every POST an idempotency key and keeps it across retries', async () => {
    const { client, transport } = scripted([error(503, 'UNAVAILABLE'), json(202, MESSAGE)]);

    await client.messages.send({ to: '+923001234567', body: 'Hi' });

    const keys = transport.requests.map((request) => request.header('Idempotency-Key'));
    expect(keys).toHaveLength(2);
    expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(keys[1]).toBe(keys[0]);
  });

  it('uses the idempotency key and headers of the request options', async () => {
    const { client, transport } = scripted([json(202, MESSAGE)], { defaultHeaders: { 'X-Team': 'ops' } });

    await client.messages.send({ to: '+923001234567', body: 'Hi' }, { idempotencyKey: 'order-7', headers: { 'X-Trace': 't-1' } });

    const request = transport.requests[0]!;
    expect(request.header('Idempotency-Key')).toBe('order-7');
    expect(request.header('X-Trace')).toBe('t-1');
    expect(request.header('X-Team')).toBe('ops');
  });

  it('acts as a managed account on /v1 only', async () => {
    const { client, transport } = scripted([json(200, { id: 'acc' })], { apiKey: 'mc_partner_x' });
    const managed = client.forAccount('acc-1');

    await managed.account.get();
    await managed.partner.accounts.get('acc-1');

    expect(transport.requests[0]!.header('MyComm-Account')).toBe('acc-1');
    expect(transport.requests[1]!.path).toBe('/partner/v1/accounts/acc-1');
    expect(transport.requests[1]!.header('MyComm-Account')).toBeUndefined();
    expect(transport.requests[1]!.header('Authorization')).toBe('Bearer mc_partner_x');
  });

  it.each(['https://api.test', 'https://api.test/', 'https://api.test/v1', 'https://api.test/partner/v1/'])(
    'accepts the base URL %s with or without the version path',
    async (baseUrl) => {
      const { client, transport } = scripted([json(200, { id: 'acc' })], { baseUrl });

      await client.account.get();

      expect(transport.requests[0]!.url).toBe('https://api.test/v1/account');
    },
  );

  it('encodes a multipart body with files and plain fields', async () => {
    const { client, transport } = scripted([json(202, { id: 'imp-1' })]);

    await client.imports.createFromFile({
      file: toFile('phone\n+923001234567\n', 'contacts.csv', 'text/csv'),
      type: 'contacts_csv',
    });

    const request = transport.requests[0]!;
    expect(request.header('Content-Type')).toBeUndefined();
    const file = request.form!.get('file') as File;
    expect(file.name).toBe('contacts.csv');
    expect(file.type).toBe('text/csv');
    expect(await file.text()).toBe('phone\n+923001234567\n');
    expect(request.form!.get('type')).toBe('contacts_csv');
  });

  it('sends an import as JSON or as an upload', async () => {
    const { client, transport } = scripted([json(202, { id: 'imp-1' })]);

    await client.imports.create({ type: 'phone_history', channel_id: MESSAGE.id, options: { days: 30 } });
    await client.imports.createFromFile({ file: new Blob(['x']), type: 'contacts_csv' });

    expect(transport.requests[0]!.operation).toBe('imports.create');
    expect(transport.requests[0]!.header('Content-Type')).toBe('application/json');
    expect(transport.requests[1]!.operation).toBe('imports.create');
    expect((transport.requests[1]!.form!.get('file') as File).name).toBe('file');
  });
});

describe('retries', () => {
  it('waits as long as Retry-After says on a 429', async () => {
    const { client, waits } = scripted([error(429, 'RATE_LIMITED', { 'Retry-After': '7' }), json(202, MESSAGE)]);

    await client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(waits).toEqual([7]);
  });

  it('caps a long Retry-After at a minute', async () => {
    const { client, waits } = scripted([error(429, 'RATE_LIMITED', { 'Retry-After': '3600' }), json(202, MESSAGE)]);

    await client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(waits).toEqual([60]);
  });

  it('backs off exponentially without Retry-After', async () => {
    const { client, waits } = scripted([error(500, 'INTERNAL'), error(502, 'BAD_GATEWAY'), json(200, MESSAGE)]);

    await client.messages.show('m-1');

    expect(waits).toHaveLength(2);
    expect(waits[0]).toBeGreaterThanOrEqual(0.375);
    expect(waits[0]).toBeLessThanOrEqual(0.625);
    expect(waits[1]).toBeGreaterThanOrEqual(0.75);
    expect(waits[1]).toBeLessThanOrEqual(1.25);
  });

  it('retries after a network error', async () => {
    const { client, transport } = scripted([offline(), json(200, MESSAGE)]);

    const message = await client.messages.show('m-1');

    expect(message.id).toBe(MESSAGE.id);
    expect(transport.requests).toHaveLength(2);
  });

  it('waits a second while the first request with the same key is still running', async () => {
    const { client, waits } = scripted([error(409, 'IDEMPOTENCY_IN_PROGRESS'), json(202, MESSAGE)]);

    await client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(waits).toEqual([1]);
  });

  it('gives up after the configured retries', async () => {
    const { client, transport } = scripted([error(503, 'UNAVAILABLE')], { maxRetries: 3 });

    await expect(client.messages.show('m-1')).rejects.toBeInstanceOf(ServerError);
    expect(transport.requests).toHaveLength(4);
  });

  it('lets the request options override the retries', async () => {
    const { client, transport } = scripted([offline()]);

    await expect(client.messages.show('m-1', { maxRetries: 0 })).rejects.toBeInstanceOf(ConnectionError);
    expect(transport.requests).toHaveLength(1);
  });

  it.each([
    [400, 'MALFORMED_REQUEST'],
    [401, 'UNAUTHENTICATED'],
    [404, 'NOT_FOUND'],
    [409, 'NOT_CANCELLABLE'],
    [422, 'RECIPIENT_OPTED_OUT'],
  ])('never retries a %i %s, which would be the same again', async (status, code) => {
    const { client, transport } = scripted([error(status, code)]);

    await expect(client.messages.send({ to: '+923001234567', body: 'Hi' })).rejects.toBeInstanceOf(APIError);
    expect(transport.requests).toHaveLength(1);
  });

  it('stops waiting when the caller aborts', async () => {
    const controller = new AbortController();
    const { client, transport } = scripted([error(503, 'UNAVAILABLE')], {
      sleep: async () => {
        controller.abort(new Error('stop'));
        throw controller.signal.reason;
      },
    });

    await expect(client.messages.show('m-1', { signal: controller.signal })).rejects.toThrow('stop');
    expect(transport.requests).toHaveLength(1);
  });
});

describe('errors', () => {
  it.each([
    [400, 'MALFORMED_REQUEST', BadRequestError],
    [400, 'INVALID_HEADER', InvalidHeaderError],
    [401, 'UNAUTHENTICATED', AuthenticationError],
    [403, 'FORBIDDEN', PermissionDeniedError],
    [404, 'NOT_FOUND', NotFoundError],
    [409, 'NOT_CANCELLABLE', ConflictError],
    [413, 'PAYLOAD_TOO_LARGE', PayloadTooLargeError],
    [415, 'UNSUPPORTED_MEDIA_TYPE', UnsupportedMediaTypeError],
    [422, 'RECIPIENT_OPTED_OUT', UnprocessableError],
    [422, 'VALIDATION_FAILED', ValidationError],
    [429, 'RATE_LIMITED', RateLimitError],
    [500, 'INTERNAL', ServerError],
    [418, 'TEAPOT', APIError],
  ] as const)('throws for %i %s the error that matches', async (status, code, Class) => {
    const { client } = scripted([error(status, code, { 'Retry-After': '0' }, { channel_id: 'c-1' })], { maxRetries: 0 });

    const thrown = await client.messages.show('m-1').catch((caught: unknown) => caught);

    expect(thrown).toBeInstanceOf(Class);
    expect(thrown).toBeInstanceOf(APIError);
    const failure = thrown as APIError;
    expect(failure.status).toBe(status);
    expect(failure.code).toBe(code);
    expect(failure.message).toBe(`${code} happened.`);
    expect(failure.details).toEqual({ channel_id: 'c-1' });
    expect(failure.requestId).toBe('req-1');
    expect(failure.name).toBe(Class.name);
  });

  it('falls back on the status for an error without the envelope', async () => {
    const { client } = scripted([
      new (await import('../src/core/http.js')).MyCommResponse(404, { 'MyComm-Request-Id': 'r-9' }, '<html>'),
    ]);

    const thrown = (await client.messages.show('m-1').catch((caught: unknown) => caught)) as APIError;

    expect(thrown).toBeInstanceOf(NotFoundError);
    expect(thrown.code).toBe('');
    expect(thrown.message).toBe('The MyComm API answered with HTTP 404.');
    expect(thrown.requestId).toBe('r-9');
  });

  it('compares the error code', async () => {
    const { client } = scripted([error(422, 'RECIPIENT_OPTED_OUT')]);

    const thrown = (await client.messages
      .send({ to: '+923001234567', body: 'Hi' })
      .catch((caught: unknown) => caught)) as APIError;

    expect(thrown.is('RECIPIENT_OPTED_OUT')).toBe(true);
    expect(thrown.is('CHANNEL_INACTIVE')).toBe(false);
    expect(thrown.isAnyOf('CHANNEL_INACTIVE', 'RECIPIENT_OPTED_OUT')).toBe(true);
  });

  it('refuses a success answer that is not JSON', async () => {
    const { client } = scripted([new (await import('../src/core/http.js')).MyCommResponse(200, {}, '<html>proxy</html>')]);

    await expect(client.messages.show('m-1')).rejects.toBeInstanceOf(UnexpectedResponseError);
  });

  it('refuses an empty API key', () => {
    expect(() => new MyComm({ apiKey: ' ' })).toThrow('The MyComm API key is missing');
  });
});

describe('answers', () => {
  it('reads the response metadata and keeps it out of the payload', async () => {
    const { client } = scripted([
      json(202, MESSAGE, {
        'MyComm-Request-Id': 'req-7',
        'RateLimit-Limit': '600',
        'RateLimit-Remaining': '598',
        'RateLimit-Reset': '42',
        'Idempotent-Replayed': 'true',
        Deprecation: '@1767225600',
        Sunset: 'Wed, 01 Jul 2027 00:00:00 GMT',
      }),
    ]);

    const message = await client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(message._meta).toMatchObject({
      status: 202,
      requestId: 'req-7',
      rateLimitLimit: 600,
      rateLimitRemaining: 598,
      rateLimitReset: 42,
      idempotentReplayed: true,
      deprecation: '@1767225600',
      sunset: 'Wed, 01 Jul 2027 00:00:00 GMT',
    });
    expect(JSON.parse(JSON.stringify(message))).toEqual(MESSAGE);
    expect(Object.keys(message)).toEqual(Object.keys(MESSAGE));
    expect({ ...message }).toEqual(MESSAGE);
  });

  it('keeps fields and enum values this version does not know', async () => {
    const { client } = scripted([json(200, { ...MESSAGE, status: 'teleported', added_later: { x: 1 } })]);

    const message = await client.messages.show('m-1');

    expect(message.status).toBe('teleported');
    expect((message as unknown as Record<string, unknown>).added_later).toEqual({ x: 1 });
  });

  it('returns null for an answer without a body where the reference allows one', async () => {
    const { client } = scripted([new (await import('../src/core/http.js')).MyCommResponse(204, {}, '')]);

    expect(await client.contacts.delete('c-1')).toBeNull();
  });
});

describe('the default transport', () => {
  it('sends through fetch and reads the answer', async () => {
    const seen: Array<{ url: string; init: RequestInit }> = [];
    const client = new MyComm({
      apiKey: 'mc_live_test',
      fetch: async (url, init) => {
        seen.push({ url, init });
        return new Response(JSON.stringify(MESSAGE), { status: 202, headers: { 'MyComm-Request-Id': 'req-1' } });
      },
    });

    const message = await client.messages.send({ to: '+923001234567', body: 'Hi' });

    expect(message._meta.requestId).toBe('req-1');
    expect(seen[0]!.url).toBe('https://mycomm.cogneer.tech/v1/messages');
    expect(seen[0]!.init.method).toBe('POST');
    expect(seen[0]!.init.body).toBe('{"to":"+923001234567","body":"Hi"}');
    expect((seen[0]!.init.headers as Record<string, string>)['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('turns a failed fetch into a connection error after its retries', async () => {
    let calls = 0;
    const client = new MyComm({
      apiKey: 'mc_live_test',
      maxRetries: 1,
      fetch: async () => {
        calls++;
        throw new TypeError('fetch failed', { cause: new Error('getaddrinfo ENOTFOUND mycomm.cogneer.tech') });
      },
    });

    const thrown = await client.messages.show('m-1').catch((caught: unknown) => caught);

    expect(thrown).toBeInstanceOf(ConnectionError);
    expect((thrown as Error).message).toBe('Could not reach MyComm: getaddrinfo ENOTFOUND mycomm.cogneer.tech');
    expect(calls).toBe(2);
  }, 10_000);

  it('times out an attempt', async () => {
    const client = new MyComm({
      apiKey: 'mc_live_test',
      maxRetries: 0,
      timeout: 20,
      fetch: (_, init) =>
        new Promise((_resolve, reject) => {
          init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
        }),
    });

    await expect(client.messages.show('m-1')).rejects.toThrow('Could not reach MyComm: the request timed out.');
  });

  it('passes the abort of the caller through, without retrying', async () => {
    let calls = 0;
    const controller = new AbortController();
    const client = new MyComm({
      apiKey: 'mc_live_test',
      fetch: (_, init) =>
        new Promise((_resolve, reject) => {
          calls++;
          init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
          controller.abort(new Error('user gave up'));
        }),
    });

    await expect(client.messages.show('m-1', { signal: controller.signal })).rejects.toThrow('user gave up');
    expect(calls).toBe(1);
  });
});
