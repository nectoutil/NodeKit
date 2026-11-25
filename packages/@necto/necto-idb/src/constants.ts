/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const KVOperations = {
  Read: 'read',
  Write: 'write',
  Clear: 'clear',
  Delete: 'delete'
} as const;

export const DATABASE_PREFIX: string = 'necto';
export const DEFAULT_STORE_NAME: string = 'keyval';
export const DEFAULT_DATABASE_NAME: string = 'keyval';
export const BROADCAST_CHANNEL_NAME: string = 'necto:idb';
