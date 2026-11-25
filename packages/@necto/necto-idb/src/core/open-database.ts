/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getIndexedDB } from './get-indexed-db';
import { promisifyRequest } from './promisify-request';

import type { OpenDatabaseOptions } from '../types';

export async function openDatabase(
  name: string,
  options: OpenDatabaseOptions = {}
): Promise<IDBDatabase> {
  const { version, upgrade, blocked, blocking } = options;

  const request: IDBOpenDBRequest = getIndexedDB().open(name, version);

  request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    upgrade?.(
      request.result,
      event.oldVersion,
      event.newVersion,
      request.transaction as IDBTransaction
    );
  };

  request.onblocked = (): void => blocked?.();

  const database: IDBDatabase = await promisifyRequest(request);

  database.onversionchange = (): void => {
    if (blocking) {
      blocking(database);
    } else {
      database.close();
    }
  };

  return database;
}
