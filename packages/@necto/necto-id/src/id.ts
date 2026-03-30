/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { assert } from '@necto/assert';
import { ALPHABET } from '@necto/constants';
import { randomBytes } from '@necto/crypto';

/**
 * Generates a random ID of the specified length using the provided character set.
 * @param length - The length of the ID to generate.
 * @param charset - The character set to use for generating the ID (default: ALPHABET_COMBINED).
 * @returns A randomly generated ID string.
 */
export function id(
  length = 21,
  charset: string[] = Array.from([
    ...ALPHABET.LOWERCASE,
    ...ALPHABET.CAPITALIZED
  ])
): string {
  assert(length > 0, 'Length must be a positive integer.');

  const randomValues: Uint8Array = randomBytes(length);
  return Array.from(randomValues as Iterable<number>)
    .map((value: number): string => charset[value % charset.length])
    .join('');
}
