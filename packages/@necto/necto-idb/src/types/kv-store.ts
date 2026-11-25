/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { KVOperations as KVOperationsMap } from '../constants';

export type KVListener<T> = (value: T | undefined) => void;
export type KVOperation = (typeof KVOperationsMap)[keyof typeof KVOperationsMap];
export type KVKey<Schema> = [Schema] extends [never] ? IDBValidKey : keyof Schema & string;

export type KVValue<Schema, K> = [Schema] extends [never]
  ? unknown
  : K extends keyof Schema
    ? Schema[K]
    : never;

export interface KVStoreOptions {
  database?: string;

  store?: string;

  prefix?: string | false;

  scope?: string;

  onError?: (error: DOMException, operation: KVOperation) => void;
}
