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

import type { KVKey, KVValue, KVListener, KVOperation, KVStoreOptions } from '../types';

const supported = (): boolean => typeof indexedDB !== 'undefined';

const connections: Map<string, Promise<IDBDatabase>> = new Map();

export class KVStore<Schema = never> {
  readonly storeName: string;
  readonly scopeName: string;
  readonly databaseName: string;

  private readonly channel: string;
  private readonly options: KVStoreOptions;
  private readonly onError: KVStoreOptions['onError'];

  constructor(options: KVStoreOptions = {}) {
    const {
      onError,
      scope = '',
      prefix = DATABASE_PREFIX,
      store = DEFAULT_STORE_NAME,
      database = DEFAULT_DATABASE_NAME
    } = options;

    this.options = options;
    this.onError = onError;
    this.storeName = store;
    this.databaseName = prefix === false ? database : `${prefix}:${database}`;
    this.scopeName = !scope || scope.endsWith(':') ? scope : `${scope}:`;
    this.channel = `${this.databaseName}/${this.storeName}`;
  }

  get = async <K extends KVKey<Schema>>(key: K): Promise<KVValue<Schema, K> | undefined> => {
    const at: IDBValidKey = this.at(key);

    return this.guard('read', undefined, async (): Promise<KVValue<Schema, K> | undefined> => {
      const store: IDBObjectStore = await this.open('readonly');

      return promisifyRequest<KVValue<Schema, K> | undefined>(store.get(at));
    });
  };

  getMany = async <const K extends ReadonlyArray<KVKey<Schema>>>(
    keys: K
  ): Promise<{ -readonly [I in keyof K]: KVValue<Schema, K[I]> | undefined }> => {
    type Found = { -readonly [I in keyof K]: KVValue<Schema, K[I]> | undefined };

    const at: IDBValidKey[] = keys.map((key): IDBValidKey => this.at(key));

    return this.guard('read', keys.map((): undefined => undefined) as Found, async () => {
      const store: IDBObjectStore = await this.open('readonly');

      return Promise.all(at.map((key) => promisifyRequest(store.get(key)))) as Promise<Found>;
    });
  };

  has = async <K extends KVKey<Schema>>(key: K): Promise<boolean> => {
    const at: IDBValidKey = this.at(key);

    return this.guard('read', false, async (): Promise<boolean> => {
      const store: IDBObjectStore = await this.open('readonly');

      return (await promisifyRequest(store.getKey(at))) !== undefined;
    });
  };

  keys = (): Promise<Array<KVKey<Schema>>> =>
    this.guard('read', [], async (): Promise<Array<KVKey<Schema>>> => {
      const store: IDBObjectStore = await this.open('readonly');

      const found = await promisifyRequest(store.getAllKeys(this.range()));

      return found.map((key): KVKey<Schema> => this.bare(key) as KVKey<Schema>);
    });

  values = (): Promise<Array<KVValue<Schema, KVKey<Schema>>>> =>
    this.guard('read', [], async (): Promise<Array<KVValue<Schema, KVKey<Schema>>>> => {
      const store: IDBObjectStore = await this.open('readonly');

      return promisifyRequest<Array<KVValue<Schema, KVKey<Schema>>>>(store.getAll(this.range()));
    });

  entries = (): Promise<Array<[KVKey<Schema>, KVValue<Schema, KVKey<Schema>>]>> =>
    this.guard(
      'read',
      [],
      async (): Promise<Array<[KVKey<Schema>, KVValue<Schema, KVKey<Schema>>]>> => {
        const store: IDBObjectStore = await this.open('readonly');
        const range: IDBKeyRange | undefined = this.range();

        const [keys, values] = await Promise.all([
          promisifyRequest(store.getAllKeys(range)),
          promisifyRequest<Array<KVValue<Schema, KVKey<Schema>>>>(store.getAll(range))
        ]);

        return keys.map((key, index): [KVKey<Schema>, KVValue<Schema, KVKey<Schema>>] => [
          this.bare(key) as KVKey<Schema>,
          values[index]!
        ]);
      }
    );

  set = async <K extends KVKey<Schema>>(key: K, value: KVValue<Schema, K>): Promise<boolean> => {
    const at: IDBValidKey = this.at(key);

    return this.commit('write', [at], (store) => store.put(value, at));
  };

  setMany = async (entries: Partial<Record<KVKey<Schema> & string, unknown>>): Promise<boolean> => {
    const pairs: Array<[IDBValidKey, unknown]> = Object.entries(entries).map(
      ([key, value]): [IDBValidKey, unknown] => [this.at(key as KVKey<Schema>), value]
    );

    return this.commit(
      'write',
      pairs.map(([key]) => key),
      (store) => pairs.forEach(([key, value]) => store.put(value, key))
    );
  };

  update = async <K extends KVKey<Schema>>(
    key: K,
    updater: (prev: KVValue<Schema, K> | undefined) => KVValue<Schema, K>
  ): Promise<KVValue<Schema, K> | undefined> => {
    const at: IDBValidKey = this.at(key);

    let next: KVValue<Schema, K> | undefined;

    const written: boolean = await this.commit('write', [at], async (store) => {
      next = updater(await promisifyRequest<KVValue<Schema, K> | undefined>(store.get(at)));

      store.put(next, at);
    });

    return written ? next : undefined;
  };

  delete = async (...keys: Array<KVKey<Schema>>): Promise<boolean> => {
    const at: IDBValidKey[] = keys.map((key): IDBValidKey => this.at(key));

    return this.commit('delete', at, (store) => at.forEach((key) => store.delete(key)));
  };

  clear = (): Promise<boolean> => {
    const range: IDBKeyRange | undefined = this.range();

    return this.commit('clear', null, (store) => (range ? store.delete(range) : store.clear()));
  };

  subscribe = <K extends KVKey<Schema>>(
    key: K,
    listener: KVListener<KVValue<Schema, K>>
  ): (() => void) => {
    const at: IDBValidKey = this.at(key);

    return subscribe(this.channel, at, () => void this.get(key).then(listener));
  };

  subscribeAll = (listener: (key?: KVKey<Schema>) => void): (() => void) => {
    return subscribe(this.channel, null, (key?: IDBValidKey): void =>
      listener(key === undefined ? undefined : (this.bare(key) as KVKey<Schema>))
    );
  };

  scope = (name: string): KVStore<Schema> => {
    return new KVStore<Schema>({
      ...this.options,
      scope: `${this.scopeName}${name}`
    });
  };

  private at(key: IDBValidKey): IDBValidKey {
    if (!this.scopeName) {
      return key;
    }

    if (typeof key !== 'string') {
      throw new TypeError(`a scoped store takes string keys, received ${typeof key}`);
    }

    return `${this.scopeName}${key}`;
  }

  private bare(key: IDBValidKey): IDBValidKey {
    return this.scopeName && typeof key === 'string' ? key.slice(this.scopeName.length) : key;
  }

  private range(): IDBKeyRange | undefined {
    return this.scopeName ? IDBKeyRange.bound(this.scopeName, `${this.scopeName}￿`) : undefined;
  }

  private guard = async <T>(
    operation: KVOperation,
    fallback: T,
    run: () => Promise<T>
  ): Promise<T> => {
    if (!supported()) {
      return fallback;
    }

    if (!this.onError) {
      return run();
    }

    try {
      return await run();
    } catch (error) {
      this.onError(error as DOMException, operation);

      return fallback;
    }
  };

  private async open(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const database: IDBDatabase = await this.connect();

    return database.transaction(this.storeName, mode).objectStore(this.storeName);
  }

  private commit(
    operation: KVOperation,
    keys: IDBValidKey[] | null,
    callback: (store: IDBObjectStore) => unknown
  ): Promise<boolean> {
    return this.guard(operation, false, async (): Promise<boolean> => {
      const store: IDBObjectStore = await this.open('readwrite');
      const committed: Promise<void> = promisifyRequest(store.transaction);

      try {
        await callback(store);
      } catch (error) {
        committed.catch(() => {});
        store.transaction.abort();
        throw error;
      }

      await committed;

      if (keys === null) {
        notify(this.channel);
      } else {
        keys.forEach((key) => notify(this.channel, key));
      }

      return true;
    });
  }

  private async connect(): Promise<IDBDatabase> {
    const held: Promise<IDBDatabase> | undefined = connections.get(this.databaseName);

    if (!held) {
      return this.establish();
    }

    const database: IDBDatabase = await held;

    if (database.objectStoreNames.contains(this.storeName)) {
      return database;
    }

    database.close();
    connections.delete(this.databaseName);

    return this.establish(database.version + 1);
  }

  private establish(version?: number): Promise<IDBDatabase> {
    const opening: Promise<IDBDatabase> = openDatabase(this.databaseName, {
      version,
      upgrade: (database: IDBDatabase): void => {
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName);
        }
      },
      blocking: (database: IDBDatabase): void => {
        database.close();
        connections.delete(this.databaseName);
      }
    })
      .then((database: IDBDatabase): IDBDatabase => {
        database.onclose = (): void => {
          connections.delete(this.databaseName);
        };

        return database;
      })
      .catch((error: unknown) => {
        connections.delete(this.databaseName);

        throw error;
      });

    connections.set(this.databaseName, opening);

    return opening;
  }
}
