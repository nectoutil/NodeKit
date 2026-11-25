/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, expectTypeOf, vi, afterEach } from 'vitest';

import { kv, KVStore, deleteDatabase, openDatabase } from '../src/index';

let counter = 0;
const created: string[] = [];

function createStore<Schema = never>(
  options: { store?: string; database?: string; scope?: string } = {}
): KVStore<Schema> {
  const store = new KVStore<Schema>({ database: `test-${Date.now()}-${counter++}`, ...options });
  created.push(store.databaseName);
  return store;
}

afterEach(async () => {
  await kv.clear();
  await Promise.all(created.splice(0).map((name) => deleteDatabase(name)));
});

describe('KVStore', () => {
  describe('naming', () => {
    it('prefixes database names with __necto', () => {
      expect(kv.databaseName).toBe('__necto:keyval');
      expect(kv.storeName).toBe('keyval');
      expect(new KVStore({ database: 'app', store: 'drafts' }).databaseName).toBe('__necto:app');
    });

    it('supports a custom prefix or no prefix', () => {
      expect(new KVStore({ database: 'app', prefix: 'acme' }).databaseName).toBe('acme:app');
      expect(new KVStore({ database: 'app', prefix: false }).databaseName).toBe('app');
    });

    it('creates the database under the prefixed name', async () => {
      const store = createStore();
      await store.set('a', 1);

      const database = await openDatabase(store.databaseName);

      expect(database.objectStoreNames.contains('keyval')).toBe(true);

      database.close();
    });
  });

  describe('get and set', () => {
    it('returns undefined for a missing key', async () => {
      expect(await createStore().get('missing')).toBeUndefined();
    });

    it('stores and reads a value', async () => {
      const store = createStore();
      await store.set('theme', 'dark');

      expect(await store.get('theme')).toBe('dark');
    });

    it('stores structured-cloneable values', async () => {
      const store = createStore();
      const date = new Date('2026-01-01T00:00:00Z');
      const value = { date, map: new Map([['a', 1]]), list: [1, 2, 3], nested: { ok: true } };

      await store.set('complex', value);

      expect(await store.get('complex')).toEqual(value);
    });

    it('supports non-string keys', async () => {
      const store = createStore();
      await store.set(1, 'number');
      await store.set(['a', 1], 'array');
      await store.set(new Date(0), 'date');

      expect(await store.get(1)).toBe('number');
      expect(await store.get(['a', 1])).toBe('array');
      expect(await store.get(new Date(0))).toBe('date');
    });

    it('works on the default kv instance', async () => {
      await kv.set('a', 1);

      expect(await kv.get('a')).toBe(1);
    });
  });

  describe('many', () => {
    it('sets, gets and deletes many keys', async () => {
      const store = createStore();
      await store.setMany({ a: 1, b: 2, c: 3 });

      expect(await store.getMany(['a', 'b', 'x'])).toEqual([1, 2, undefined]);

      await store.delete('a', 'b');

      expect(await store.keys()).toEqual(['c']);
    });
  });

  describe('update', () => {
    it('updates from the previous value and returns the new value', async () => {
      const store = createStore<{ n: number }>();

      expect(await store.update('n', (prev = 0) => prev + 1)).toBe(1);
      expect(await store.update('n', (prev = 0) => prev + 1)).toBe(2);
      expect(await store.get('n')).toBe(2);
    });

    it('does not lose concurrent updates', async () => {
      const store = createStore<{ n: number }>();

      await Promise.all(
        Array.from({ length: 20 }, () => store.update('n', (prev = 0) => prev + 1))
      );

      expect(await store.get('n')).toBe(20);
    });

    it('rejects and leaves the value unchanged when the updater throws', async () => {
      const store = createStore();
      await store.set('n', 1);

      await expect(
        store.update('n', () => {
          throw new Error('nope');
        })
      ).rejects.toThrow('nope');

      expect(await store.get('n')).toBe(1);
    });
  });

  describe('delete and clear', () => {
    it('deletes a key', async () => {
      const store = createStore();
      await store.set('a', 1);
      await store.delete('a');

      expect(await store.get('a')).toBeUndefined();
    });

    it('clears the store', async () => {
      const store = createStore();
      await store.setMany({ a: 1, b: 2 });
      await store.clear();

      expect(await store.keys()).toEqual([]);
    });
  });

  describe('keys, values and entries', () => {
    it('lists keys, values and entries in key order', async () => {
      const store = createStore();
      await store.setMany({ b: 2, a: 1 });

      expect(await store.keys()).toEqual(['a', 'b']);
      expect(await store.values()).toEqual([1, 2]);
      expect(await store.entries()).toEqual([
        ['a', 1],
        ['b', 2]
      ]);
    });
  });

  describe('multiple stores', () => {
    it('keeps separate databases isolated', async () => {
      const first = createStore();
      const second = createStore();

      await first.set('a', 1);

      expect(await second.get('a')).toBeUndefined();
    });

    it('adds a second store to an existing database', async () => {
      const database = `shared-${Date.now()}`;
      const drafts = createStore({ database, store: 'drafts' });
      const settings = new KVStore({ database, store: 'settings' });

      await drafts.set('a', 'draft');
      await settings.set('a', 'setting');

      expect(await drafts.get('a')).toBe('draft');
      expect(await settings.get('a')).toBe('setting');
    });
  });

  describe('subscribe', () => {
    it('calls the listener with the new value after set and delete', async () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe('theme', listener);

      await store.set('theme', 'dark');
      await vi.waitFor(() => expect(listener).toHaveBeenLastCalledWith('dark'));

      await store.delete('theme');
      await vi.waitFor(() => expect(listener).toHaveBeenLastCalledWith(undefined));

      unsubscribe();
    });

    it('notifies on update and clear', async () => {
      const store = createStore<{ n: number }>();
      const listener = vi.fn();
      const unsubscribe = store.subscribe('n', listener);

      await store.update('n', (prev = 0) => prev + 5);
      await vi.waitFor(() => expect(listener).toHaveBeenLastCalledWith(5));

      await store.clear();
      await vi.waitFor(() => expect(listener).toHaveBeenLastCalledWith(undefined));

      unsubscribe();
    });

    it('notifies subscribers of another instance for the same store', async () => {
      const store = createStore();
      const other = new KVStore({ database: store.databaseName, prefix: false });
      const listener = vi.fn();
      const unsubscribe = other.subscribe('a', listener);

      await store.set('a', 1);

      await vi.waitFor(() => expect(listener).toHaveBeenCalledWith(1));

      unsubscribe();
    });

    it('does not notify for other keys or other stores', async () => {
      const store = createStore();
      const other = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe('a', listener);

      await store.set('b', 1);
      await other.set('a', 1);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(listener).not.toHaveBeenCalled();

      unsubscribe();
    });

    it('stops after unsubscribe', async () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe('a', listener);

      unsubscribe();
      await store.set('a', 1);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(listener).not.toHaveBeenCalled();
    });

    it('matches non-string keys', async () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(['user', 1], listener);

      await store.set(['user', 1], 'ada');

      await vi.waitFor(() => expect(listener).toHaveBeenCalledWith('ada'));

      unsubscribe();
    });

    it('picks up writes broadcast from another tab', async () => {
      const store = createStore();
      await store.keys(); // creates the database and store

      const listener = vi.fn();
      const unsubscribe = store.subscribe('a', listener);

      const database = await openDatabase(store.databaseName);
      const tx = database.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').put('from-other-tab', 'a');
      await new Promise((resolve) => (tx.oncomplete = resolve));
      database.close();

      const otherTab = new BroadcastChannel('necto:idb');
      otherTab.postMessage({ scope: `${store.databaseName}/keyval`, key: 'a' });

      await vi.waitFor(() => expect(listener).toHaveBeenCalledWith('from-other-tab'));

      otherTab.close();
      unsubscribe();
    });
  });

  describe('subscribeAll', () => {
    it('runs after any change in the store', async () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribeAll(listener);

      await store.set('a', 1);
      await store.setMany({ b: 2 });
      await store.clear();

      expect(listener).toHaveBeenCalledTimes(3);

      unsubscribe();
    });
  });

  describe('has', () => {
    it('reports presence without reading the value', async () => {
      const store = createStore();
      await store.set('a', 1);

      expect(await store.has('a')).toBe(true);
      expect(await store.has('missing')).toBe(false);
    });

    it('is true for a stored undefined', async () => {
      const store = createStore();
      await store.set('a', undefined);

      expect(await store.get('a')).toBeUndefined();
      expect(await store.has('a')).toBe(true);
    });
  });

  describe('scope', () => {
    it('keeps sibling scopes apart in one object store', async () => {
      const store = createStore();
      const first = store.scope('one');
      const second = store.scope('two');

      await first.set('a', 1);
      await second.set('a', 2);

      expect(await first.get('a')).toBe(1);
      expect(await second.get('a')).toBe(2);
      expect(await store.get('a')).toBeUndefined();
    });

    it('lists only its own keys, unprefixed', async () => {
      const store = createStore();
      const scoped = store.scope('one');

      await scoped.setMany({ b: 2, a: 1 });
      await store.scope('two').set('c', 3);

      expect(await scoped.keys()).toEqual(['a', 'b']);
      expect(await scoped.values()).toEqual([1, 2]);
      expect(await scoped.entries()).toEqual([
        ['a', 1],
        ['b', 2]
      ]);
    });

    it('clears only its own keys', async () => {
      const store = createStore();
      const scoped = store.scope('one');
      const other = store.scope('two');

      await scoped.set('a', 1);
      await other.set('a', 2);

      await scoped.clear();

      expect(await scoped.get('a')).toBeUndefined();
      expect(await other.get('a')).toBe(2);
    });

    it('nests', async () => {
      const store = createStore();
      const nested = store.scope('one').scope('two');

      await nested.set('a', 1);

      expect(nested.scopeName).toBe('one:two:');
      expect(await nested.get('a')).toBe(1);
      expect(await store.scope('one').get('a')).toBeUndefined();
    });

    it('refuses a non-string key', async () => {
      const scoped = createStore().scope('one');

      await expect(scoped.set(1, 'nope')).rejects.toThrow(TypeError);
    });

    it('notifies the unscoped parent and the scope that changed', async () => {
      const store = createStore();
      const scoped = store.scope('one');

      const everything = vi.fn();
      const mine = vi.fn();

      const unsubscribeAll = store.subscribeAll(everything);
      const unsubscribe = scoped.subscribe('a', mine);

      await scoped.set('a', 1);

      await vi.waitFor(() => expect(mine).toHaveBeenCalledWith(1));
      await vi.waitFor(() => expect(everything).toHaveBeenCalledWith('one:a'));

      unsubscribe();
      unsubscribeAll();
    });
  });

  describe('onError', () => {
    it('reports and resolves empty instead of rejecting', async () => {
      const onError = vi.fn();
      const store = new KVStore({ database: `test-${Date.now()}-${counter++}`, onError });

      created.push(store.databaseName);

      // A function cannot be structured-cloned, so the write fails inside the transaction.
      expect(await store.set('a', () => undefined)).toBe(false);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0]?.[1]).toBe('write');

      expect(await store.get('a')).toBeUndefined();
    });

    it('rejects when it is not given', async () => {
      const store = createStore();

      await expect(store.set('a', () => undefined)).rejects.toThrow();
    });

    it('returns true from a write that lands', async () => {
      const store = createStore();

      expect(await store.set('a', 1)).toBe(true);
      expect(await store.delete('a')).toBe(true);
      expect(await store.clear()).toBe(true);
    });
  });

  describe('schema', () => {
    it('narrows each key to its own value type', async () => {
      const store = createStore<{ count: number; label: string }>();

      await store.setMany({ count: 1, label: 'a' });

      const [count, label] = await store.getMany(['count', 'label']);

      expectTypeOf(count).toEqualTypeOf<number | undefined>();
      expectTypeOf(label).toEqualTypeOf<string | undefined>();

      expect(count).toBe(1);
      expect(label).toBe('a');
    });

    it('leaves values unknown and keys open without one', async () => {
      const store = createStore();

      expectTypeOf(store.get).parameter(0).toEqualTypeOf<IDBValidKey>();
      expectTypeOf(await store.get('a')).toEqualTypeOf<unknown>();
    });
  });

  describe('connection', () => {
    it('reopens after the database is deleted elsewhere', async () => {
      const store = createStore();
      await store.set('a', 1);

      await deleteDatabase(store.databaseName);

      await store.set('b', 2);

      expect(await store.get('a')).toBeUndefined();
      expect(await store.get('b')).toBe(2);
    });
  });
});
