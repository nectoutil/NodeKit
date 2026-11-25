/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function promisifyRequest(request: IDBTransaction): Promise<void>;
export function promisifyRequest<T>(request: IDBRequest<T>): Promise<T>;
export function promisifyRequest<T>(request: IDBRequest<T> | IDBTransaction): Promise<T | void> {
  return new Promise((resolve, reject): void => {
    if (request instanceof IDBTransaction) {
      request.oncomplete = (): void => resolve();
      request.onabort = request.onerror = (): void => reject(request.error);
      return;
    }

    request.onsuccess = (): void => resolve(request.result);
    request.onerror = (): void => reject(request.error);
  });
}
