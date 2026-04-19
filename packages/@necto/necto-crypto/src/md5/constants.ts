/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** Per-round sine-derived constants from RFC 1321 §3.4. */
export const T = new Int32Array(64);

for (let i = 0; i < 64; i++) {
  T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}

export const SHIFTS: ReadonlyArray<ReadonlyArray<number>> = [
  [7, 12, 17, 22], // Round 1
  [5, 9, 14, 20], // Round 2
  [4, 11, 16, 23], // Round 3
  [6, 10, 15, 21] // Round 4
];
