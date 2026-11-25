/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { kv, keyvalue, KVStore } from './keyval';
export { KVOperations } from './constants';
export { getIndexedDB, openDatabase, deleteDatabase, promisifyRequest } from './core';

export type {
  KVKey,
  KVValue,
  KVListener,
  KVOperation,
  KVStoreOptions,
  OpenDatabaseOptions
} from './types';
