/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';

import { openDatabase, deleteDatabase, promisifyRequest } from '../src/index';

let counter = 0;
const uniqueName = (): string => `test-core-${Date.now()}-${counter++}`;

describe('promisifyRequest', () => {
  it('resolves a request with its result', async () => {
    const name = uniqueName();
    const database = await openDatabase(name, { upgrade: (db) => db.createObjectStore('s') });

    const tx = database.transaction('s', 'readwrite');
    await promisifyRequest(tx.objectStore('s').put('v', 'k'));
    await promisifyRequest(tx);

    const value = await promisifyRequest(database.transaction('s').objectStore('s').get('k'));

    expect(value).toBe('v');

    database.close();
    await deleteDatabase(name);
  });

  it('rejects when the request fails', async () => {
    const name = uniqueName();
    const database = await openDatabase(name, { upgrade: (db) => db.createObjectStore('s') });

    const store = database.transaction('s', 'readwrite').objectStore('s');
    await promisifyRequest(store.add('a', 'k'));

    await expect(promisifyRequest(store.add('b', 'k'))).rejects.toBeDefined();

    database.close();
    await deleteDatabase(name);
  });
});

describe('openDatabase', () => {
  it('runs upgrade with the old and new versions', async () => {
    const name = uniqueName();
    const upgrade = vi.fn((db: IDBDatabase, _old: number, _new: number | null) =>
      db.createObjectStore('s')
    );

    const database = await openDatabase(name, { version: 3, upgrade });

    expect(upgrade).toHaveBeenCalledTimes(1);
    expect(upgrade.mock.calls[0][1]).toBe(0);
    expect(upgrade.mock.calls[0][2]).toBe(3);
    expect(database.version).toBe(3);
    expect(database.objectStoreNames.contains('s')).toBe(true);

    database.close();
    await deleteDatabase(name);
  });

  it('closes an open connection when another connection upgrades', async () => {
    const name = uniqueName();
    const first = await openDatabase(name, { version: 1 });
    const second = await openDatabase(name, { version: 2 });

    expect(second.version).toBe(2);

    first.close();
    second.close();
    await deleteDatabase(name);
  });

  it('calls blocking instead of closing when given', async () => {
    const name = uniqueName();
    const blocking = vi.fn((db: IDBDatabase) => db.close());
    const first = await openDatabase(name, { version: 1, blocking });
    const second = await openDatabase(name, { version: 2 });

    expect(blocking).toHaveBeenCalledWith(first);

    second.close();
    await deleteDatabase(name);
  });
});

describe('deleteDatabase', () => {
  it('deletes a database', async () => {
    const name = uniqueName();
    const database = await openDatabase(name, { upgrade: (db) => db.createObjectStore('s') });
    database.close();

    await deleteDatabase(name);

    const reopened = await openDatabase(name);
    expect(reopened.objectStoreNames.length).toBe(0);

    reopened.close();
    await deleteDatabase(name);
  });
});
