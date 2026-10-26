import { describe, expect, it } from 'vitest';
import { FakeResponse, MyCommFake } from '../src/testing/index.js';

const message = (id: string) => ({ id, status: 'delivered' });

describe('pages', () => {
  it('iterates one page and knows whether more follow', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.list', FakeResponse.page([message('a'), message('b')], 'c2'));

    const page = await fake.client.messages.list({ limit: 2 });

    expect([...page].map((item) => item.id)).toEqual(['a', 'b']);
    expect(page.length).toBe(2);
    expect(page.next_cursor).toBe('c2');
    expect(page.hasMore()).toBe(true);
    expect(page.meta?.requestId).toBeDefined();
  });

  it('follows the cursor with the same filters through all()', async () => {
    const fake = new MyCommFake();
    fake
      .respondOnce('messages.list', FakeResponse.page([message('a'), message('b')], 'c2'))
      .respondOnce('messages.list', FakeResponse.page([message('c')], null));

    const ids: string[] = [];
    for await (const item of fake.client.messages.all({ status: 'delivered', limit: 2 })) {
      ids.push(item.id);
    }

    expect(ids).toEqual(['a', 'b', 'c']);
    const calls = fake.calls('messages.list');
    expect(calls.map((call) => call.query)).toEqual([
      { status: 'delivered', limit: '2' },
      { status: 'delivered', limit: '2', cursor: 'c2' },
    ]);
  });

  it('fetches lazily: a loop that stops early makes no further call', async () => {
    const fake = new MyCommFake();
    fake.respond('messages.list', FakeResponse.page([message('a'), message('b')], 'c2'));

    for await (const item of fake.client.messages.all()) {
      expect(item.id).toBe('a');
      break;
    }

    fake.assertCalledTimes('messages.list', 1);
  });

  it('pages a nested list with its path argument', async () => {
    const fake = new MyCommFake();
    fake
      .respondOnce('groups.members.list', FakeResponse.page([{ id: 'm1' }], 'n'))
      .respondOnce('groups.members.list', FakeResponse.page([{ id: 'm2' }], null));

    const first = await fake.client.groups.members.list('g-1');
    const second = await first.next();

    expect(second?.data.map((item) => item.id)).toEqual(['m2']);
    expect(await second?.next()).toBeNull();
    expect(fake.calls('groups.members.list').map((call) => call.path)).toEqual([
      '/v1/groups/g-1/members',
      '/v1/groups/g-1/members',
    ]);
  });

  it('returns a list without a cursor as a page that has no next', async () => {
    const fake = new MyCommFake();

    const page = await fake.client.channels.types();

    expect(page.data.length).toBeGreaterThan(0);
    expect(page.hasMore()).toBe(false);
    expect(await page.next()).toBeNull();
  });
});
