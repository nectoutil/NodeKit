/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { T, SHIFTS } from './constants';
import { rotl, toBytes } from './utils';

function pad(bytes: Uint8Array): Uint8Array {
  const messageLength = bytes.length;
  const paddingLength =
    messageLength % 64 < 56
      ? 56 - (messageLength % 64)
      : 120 - (messageLength % 64);

  const buffer = new Uint8Array(messageLength + paddingLength + 8);
  buffer.set(bytes);
  buffer[messageLength] = 0x80;

  const view = new DataView(buffer.buffer);
  const bitLength = messageLength * 8;
  view.setUint32(messageLength + paddingLength, bitLength >>> 0, true);
  view.setUint32(
    messageLength + paddingLength + 4,
    Math.floor(bitLength / 0x100000000),
    true
  );

  return buffer;
}

function processBlock(
  block: DataView,
  offset: number,
  stateA: number,
  stateB: number,
  stateC: number,
  stateD: number
): [number, number, number, number] {
  const words = Array.from({ length: 16 }, (_, i) =>
    block.getUint32(offset + i * 4, true)
  );

  let [a, b, c, d] = [stateA, stateB, stateC, stateD];

  // Round 1: F(b,c,d) = (b & c) | (~b & d)
  for (let step = 0; step < 16; step++) {
    const mixed =
      rotl(
        a + ((b & c) | (~b & d)) + words[step] + T[step],
        SHIFTS[0][step % 4]
      ) + b;
    [a, b, c, d] = [d, mixed, b, c];
  }

  // Round 2: G(b,c,d) = (b & d) | (c & ~d)
  for (let step = 0; step < 16; step++) {
    const wordIndex = (5 * step + 1) % 16;
    const mixed =
      rotl(
        a + ((b & d) | (c & ~d)) + words[wordIndex] + T[16 + step],
        SHIFTS[1][step % 4]
      ) + b;
    [a, b, c, d] = [d, mixed, b, c];
  }

  // Round 3: H(b,c,d) = b ^ c ^ d
  for (let step = 0; step < 16; step++) {
    const wordIndex = (3 * step + 5) % 16;
    const mixed =
      rotl(
        a + (b ^ c ^ d) + words[wordIndex] + T[32 + step],
        SHIFTS[2][step % 4]
      ) + b;
    [a, b, c, d] = [d, mixed, b, c];
  }

  // Round 4: I(b,c,d) = c ^ (b | ~d)
  for (let step = 0; step < 16; step++) {
    const wordIndex = (7 * step) % 16;
    const mixed =
      rotl(
        a + (c ^ (b | ~d)) + words[wordIndex] + T[48 + step],
        SHIFTS[3][step % 4]
      ) + b;
    [a, b, c, d] = [d, mixed, b, c];
  }

  return [
    (a + stateA) >>> 0,
    (b + stateB) >>> 0,
    (c + stateC) >>> 0,
    (d + stateD) >>> 0
  ];
}

/** Pure-JS MD5 implementation for non-Node environments (RFC 1321). */
export function md5Core(data: string | Uint8Array): Uint8Array {
  const padded = pad(toBytes(data));
  const view = new DataView(padded.buffer);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let blockOffset = 0; blockOffset < padded.length; blockOffset += 64) {
    [a, b, c, d] = processBlock(view, blockOffset, a, b, c, d);
  }

  const digest = new Uint8Array(16);
  const digestView = new DataView(digest.buffer);
  digestView.setUint32(0, a, true);
  digestView.setUint32(4, b, true);
  digestView.setUint32(8, c, true);
  digestView.setUint32(12, d, true);
  return digest;
}
