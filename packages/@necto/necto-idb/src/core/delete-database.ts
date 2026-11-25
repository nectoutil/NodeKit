/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getIndexedDB } from './get-indexed-db';
import { promisifyRequest } from './promisify-request';

export async function deleteDatabase(name: string): Promise<void> {
  await promisifyRequest(getIndexedDB().deleteDatabase(name));
}
