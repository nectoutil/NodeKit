/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function getIndexedDB(): IDBFactory {
  if (typeof indexedDB === 'undefined') {
    throw new Error(
      __DEV__
        ? '[necto.idb] NT0241: IndexedDB is not available in this environment'
        : '[necto.idb] NT0241: https://necto.dev/errors/NT0241'
    );
  }

  return indexedDB;
}
