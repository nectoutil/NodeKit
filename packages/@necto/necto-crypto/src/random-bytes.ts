/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { min } from '@necto/math';

/**
 * Generates cryptographically secure random bytes.
 *
 * Uses Node.js `crypto.randomBytes` when available for optimal performance,
 * otherwise falls back to the Web Crypto API (`crypto.getRandomValues`).
 *
 * @param size - The number of random bytes to generate.
 * @returns A Uint8Array of cryptographically secure random bytes.
 */
export function randomBytes(size: number): Uint8Array {
  const maxBytes: number = 65_536;
  const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(size);

  for (let offset: number = 0; offset < size; offset += maxBytes) {
    globalThis.crypto.getRandomValues(
      bytes.subarray(offset, min(offset + maxBytes, size))
    );
  }

  return bytes;
}