/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { KVStore } from '@necto/idb';

export type UseKVSetter<T> = (value: T | ((prev: T | undefined) => T)) => void;

export type UseKVRemover = () => void;

export type UseKVValue<T, D extends T | undefined = undefined> = undefined extends D
  ? T | undefined
  : T;

export interface KVEntry {
  /** The value last read, and whether the record has been read at all yet. */
  snapshot: { value: unknown; pending: boolean };

  /** The subscribers to notify when the snapshot changes. */
  listeners: Set<() => void>;

  /** Releases the store subscription, held while at least one listener is registered. */
  release: (() => void) | undefined;
}

export interface UseKVOptions<T = unknown, D extends T | undefined = T | undefined> {
  /** The value to use when the record does not exist. */
  defaultValue?: D;

  /** The value to use before the record has been read, so the server and first client render agree. */
  serverValue?: T;

  /** The store to read from. Defaults to the shared `kv` instance. */
  store?: KVStore;
}

export type UseKVReturn<T, D extends T | undefined = undefined> = [
  value: UseKVValue<T, D>,
  set: UseKVSetter<T>,
  remove: UseKVRemover
] & {
  /** The stored value. */
  value: UseKVValue<T, D>;

  /** Writes a value to the record. */
  set: UseKVSetter<T>;

  /** Deletes the record. */
  remove: UseKVRemover;

  /** Derives a new value from the previous one, reading and writing in one transaction. */
  update: (updater: (prev: UseKVValue<T, D>) => T) => void;

  /** Whether the record has not been read yet. IndexedDB cannot be read synchronously. */
  pending: boolean;
};
