/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NUMERIC_DIGITS } from "./numeric";

export const ALPHABET_CAPITALIZED: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const ALPHABET_LOWERCASE: string[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

export const ALPHABET_COMBINED: string[] = [
  ...ALPHABET_CAPITALIZED,
  ...ALPHABET_LOWERCASE
];

export const ALPHABET_CAPITALIZED_STRING: string = ALPHABET_CAPITALIZED.join('');
export const ALPHABET_LOWERCASE_STRING: string = ALPHABET_LOWERCASE.join('');

export const ALPHANUMERIC: string[] = [
  ...ALPHABET_CAPITALIZED,
  ...ALPHABET_LOWERCASE,
  ...NUMERIC_DIGITS
];

export const VOWELS: string[] = ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'];
export const CONSONANTS: string[] = ALPHABET_COMBINED.filter((char) => !VOWELS.includes(char));