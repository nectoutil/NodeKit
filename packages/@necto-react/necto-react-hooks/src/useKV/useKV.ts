/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { kv } from '@necto/idb';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { useEffectEvent } from '../useEffectEvent';

import type { KVStore } from '@necto/idb';
import type { KVEntry, UseKVOptions, UseKVReturn, UseKVSetter, UseKVRemover } from './useKV.types';

const SERVER: KVEntry['snapshot'] = {
  pending: true,
  value: undefined
};

const caches = new WeakMap<KVStore, Map<string, KVEntry>>();

/**
 * React hook that reads, writes and deletes one IndexedDB record, and re-renders when it
 * changes in this component, another component or another tab.
 *
 * The first render is always `pending` with no value, because IndexedDB cannot be read
 * synchronously. Give `defaultValue` to render something in the meantime.
 *
 * @template T The type of the stored value.
 * @template D The type of the default value; when given, the value is never `undefined`.
 * @param {string} key - The record key.
 * @param {UseKVOptions<T, D>} [options] - Default value, server value and store options.
 * @returns {UseKVReturn<T, D>} A `[value, set, remove]` tuple that also carries `pending`.
 */
export function useKV<T = unknown, D extends T | undefined = undefined>(
  key: string,
  options: UseKVOptions<T, D> = {}
): UseKVReturn<T, D> {
  const { serverValue, defaultValue, store = kv } = options;

  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      const entry = entryOf(store, key);

      entry.listeners.add(onChange);

      if (entry.listeners.size === 1) {
        entry.release = store.subscribe(key, (value: unknown): void => commit(entry, value));

        void store.get(key).then((value: unknown): void => commit(entry, value));
      }

      return (): void => {
        entry.listeners.delete(onChange);

        if (!entry.listeners.size) {
          entry.release?.();
          entry.release = undefined;
        }
      };
    },
    [store, key]
  );

  const snapshot: KVEntry['snapshot'] = useSyncExternalStore(
    subscribe,
    () => entryOf(store, key).snapshot,
    () => SERVER
  );

  const stored = (snapshot.pending ? serverValue : snapshot.value) as T | undefined;
  const value = stored ?? defaultValue;

  const set: UseKVSetter<T> = useEffectEvent((next): void => {
    if (typeof next === 'function') {
      void store.update(
        key,
        (prev: unknown): T => (next as (prev: T | undefined) => T)(prev as T | undefined)
      );

      return;
    }

    void store.set(key, next);
  });

  const remove: UseKVRemover = useEffectEvent((): void => {
    void store.delete(key);
  });

  const update: UseKVReturn<T, D>['update'] = useEffectEvent((updater): void => {
    set(updater as (prev: T | undefined) => T);
  });

  return useMemo(
    () =>
      Object.assign([value, set, remove], {
        value,
        set,
        update,
        remove,
        pending: snapshot.pending
      }) as UseKVReturn<T, D>,
    [value, snapshot.pending]
  );
}

/** Returns the shared cache entry for a store and key, creating it when needed. */
function entryOf(store: KVStore, key: string): KVEntry {
  let entries = caches.get(store);

  if (!entries) {
    entries = new Map();
    caches.set(store, entries);
  }

  let entry = entries.get(key);

  if (!entry) {
    entry = {
      snapshot: {
        pending: true,
        value: undefined
      },
      release: undefined,
      listeners: new Set()
    };

    entries.set(key, entry);
  }

  return entry;
}

/** Updates a cached value and notifies subscribers when it changes. */
function commit(entry: KVEntry, value: unknown): void {
  if (!entry.snapshot.pending && Object.is(entry.snapshot.value, value)) {
    return;
  }

  entry.snapshot = {
    value,
    pending: false
  };

  for (const listener of entry.listeners) {
    listener();
  }
}
