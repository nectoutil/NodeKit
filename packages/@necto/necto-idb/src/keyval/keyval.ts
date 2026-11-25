/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { KVStore } from './kv-store';

export const kv = new KVStore();

export { kv as keyvalue };
