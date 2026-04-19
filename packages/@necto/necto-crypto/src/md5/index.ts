/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { md5Core } from './core';
import { toHex } from './utils';

function compute(data: string | Uint8Array): Uint8Array {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const { createHash } =
      require('node:crypto') as typeof import('node:crypto');
    const buffer = createHash('md5').update(data).digest();
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }
  return md5Core(data);
}

/**
 * Computes the MD5 hash of the given data.
 *
 * MD5 is cryptographically broken — use only for checksums or content fingerprinting,
 * never for security-sensitive operations.
 */
export function md5(data: string | Uint8Array, encoding?: 'hex'): string;
export function md5(data: string | Uint8Array, encoding: 'raw'): Uint8Array;
export function md5(
  data: string | Uint8Array,
  encoding: 'hex' | 'raw' = 'hex'
): string | Uint8Array {
  const digest = compute(data);
  return encoding === 'raw' ? digest : toHex(digest);
}
