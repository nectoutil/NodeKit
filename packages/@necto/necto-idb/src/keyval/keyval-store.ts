/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { notify, subscribe } from './emitter';
import { openDatabase } from '../core/open-database';
import { promisifyRequest } from '../core/promisify-request';
import { DATABASE_PREFIX, DEFAULT_DATABASE_NAME, DEFAULT_STORE_NAME } from '../constants';

import type { KeyValListener, KeyValStoreOptions } from '../types';

export class KeyValStore {
  /** Full IndexedDB database name, including the prefix (e.g. `necto:keyval`). */
  public readonly databaseName: string;

  /** Object store name inside the database. */
  public readonly storeName: string;

  private readonly scope: string;
  private connection: Promise<IDBDatabase> | null = null;

  public constructor(options: KeyValStoreOptions = {}) {
    const {
      prefix = DATABASE_PREFIX,
      store = DEFAULT_STORE_NAME,
      database = DEFAULT_DATABASE_NAME
    } = options;

    this.storeName = store;
    this.databaseName = prefix === false ? database : `${prefix}:${database}`;
    this.scope = `${this.databaseName}/${this.storeName}`;
  }

  public get = async <T = unknown>(key: IDBValidKey): Promise<T | undefined> => {
    const store = await this.store('readonly');

    return promisifyRequest<T | undefined>(store.get(key));
  };

  public getMany = async <T = unknown>(keys: IDBValidKey[]): Promise<(T | undefined)[]> => {
    const store = await this.store('readonly');

    return Promise.all(keys.map((key) => promisifyRequest<T | undefined>(store.get(key))));
  };

  public keys = async (): Promise<IDBValidKey[]> => {
    const store = await this.store('readonly');

    return promisifyRequest(store.getAllKeys());
  };

  public values = async <T = unknown>(): Promise<T[]> => {
    const store = await this.store('readonly');

    return promisifyRequest<T[]>(store.getAll());
  };

  public entries = async <T = unknown>(): Promise<[IDBValidKey, T][]> => {
    const store = await this.store('readonly');

    // Both requests share one transaction, so keys and values line up.
    const [keys, values] = await Promise.all([
      promisifyRequest(store.getAllKeys()),
      promisifyRequest<T[]>(store.getAll())
    ]);

    return keys.map((key, index): [IDBValidKey, T] => [key, values[index]]);
  };

  public set = <T = unknown>(key: IDBValidKey, value: T): Promise<void> => {
    return this.write([key], (store) => store.put(value, key));
  };

  public setMany = (entries: [IDBValidKey, unknown][]): Promise<void> => {
    return this.write(
      entries.map(([key]) => key),
      (store) => entries.forEach(([key, value]) => store.put(value, key))
    );
  };

  // Reads and writes in one transaction, so concurrent updates never overwrite each other.
  public update = async <T = unknown>(
    key: IDBValidKey,
    updater: (prev: T | undefined) => T
  ): Promise<T> => {
    let next!: T;

    await this.write([key], async (store) => {
      next = updater(await promisifyRequest<T | undefined>(store.get(key)));
      store.put(next, key);
    });

    return next;
  };

  public delete = (key: IDBValidKey): Promise<void> => {
    return this.write([key], (store) => store.delete(key));
  };

  public deleteMany = (keys: IDBValidKey[]): Promise<void> => {
    return this.write(keys, (store) => keys.forEach((key) => store.delete(key)));
  };

  public clear = (): Promise<void> => {
    return this.write(null, (store) => store.clear());
  };

  public subscribe = <T = unknown>(key: IDBValidKey, listener: KeyValListener<T>): (() => void) => {
    return subscribe(this.scope, key, () => void this.get<T>(key).then(listener));
  };

  /** Runs `listener` after any change to this store. */
  public subscribeAll = (listener: () => void): (() => void) => {
    return subscribe(this.scope, null, listener);
  };

  private async store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const database = await this.getDatabase();

    return database.transaction(this.storeName, mode).objectStore(this.storeName);
  }

  // Runs a readwrite transaction, waits for it to commit, then notifies subscribers (`null` = every key).
  private async write(
    keys: IDBValidKey[] | null,
    callback: (store: IDBObjectStore) => unknown
  ): Promise<void> {
    const store = await this.store('readwrite');
    const committed = promisifyRequest(store.transaction);

    try {
      await callback(store);
    } catch (error) {
      committed.catch(() => {});
      store.transaction.abort();
      throw error;
    }

    await committed;

    if (keys === null) {
      notify(this.scope);
    } else {
      keys.forEach((key) => notify(this.scope, key));
    }
  }

  private getDatabase(): Promise<IDBDatabase> {
    this.connection ??= this.open().catch((error: unknown) => {
      this.connection = null;
      throw error;
    });

    return this.connection;
  }

  private async open(): Promise<IDBDatabase> {
    const options = {
      upgrade: (database: IDBDatabase): void => {
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName);
        }
      },
      blocking: (database: IDBDatabase): void => {
        database.close();
        this.connection = null;
      }
    };

    let database = await openDatabase(this.databaseName, options);

    // Another store created this database first: bump the version so ours gets added.
    if (!database.objectStoreNames.contains(this.storeName)) {
      database.close();
      database = await openDatabase(this.databaseName, {
        ...options,
        version: database.version + 1
      });
    }

    // Reopen next time if the browser closes the connection (e.g. storage was cleared).
    database.onclose = (): void => {
      this.connection = null;
    };

    return database;
  }
}
