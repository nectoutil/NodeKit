/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { webcrypto } from 'node:crypto';
import { ALPHABET_COMBINED } from '@necto/constants';

/**
 * Generates a random ID of the specified length using the provided character set.
 * @param length - The length of the ID to generate.
 * @param charset - The character set to use for generating the ID (default: ALPHABET_COMBINED).
 * @returns A randomly generated ID string.
 */
export function id(length: number = 21, charset: string[] = ALPHABET_COMBINED): string {
  if (length <= 0) {
    throw new Error('Length must be a positive integer.');
  }

  const charsetLength = charset.length;
  const randomValues = new Uint8Array(length);
  webcrypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((value) => charset[value % charsetLength])
    .join('');
}