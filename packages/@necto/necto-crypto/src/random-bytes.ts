/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  if (typeof process !== 'undefined' && process.versions?.node) {
    const nodeCrypto = require('node:crypto') as typeof import('node:crypto');
    const buf: Buffer<ArrayBuffer> = nodeCrypto.randomBytes(size);

    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  const bytes = new Uint8Array(size);

  if (size > 0) {
    const MAX_BYTES = 65536;

    if (size > MAX_BYTES) {
      for (let offset: number = 0; offset < size; offset += MAX_BYTES) {
        const slice: Uint8Array<ArrayBuffer> = bytes.subarray(
          offset,
          Math.min(offset + MAX_BYTES, size)
        );
        crypto.getRandomValues(slice);
      }
    } else {
      crypto.getRandomValues(bytes);
    }
  }

  return bytes;
}
