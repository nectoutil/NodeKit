/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { keyval, KeyValStore } from './keyval';
export { getIndexedDB, openDatabase, deleteDatabase, promisifyRequest } from './core';

export type {
  IdbIndex,
  IdbTable,
  IdbTableSchema,
  KeyValListener,
  KeyValStoreOptions,
  OpenDatabaseOptions
} from './types';
