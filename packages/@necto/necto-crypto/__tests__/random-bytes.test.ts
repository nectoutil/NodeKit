/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { randomBytes as stablelibRandomBytes } from '@stablelib/random';

import { randomBytes } from '../src/index';

describe('randomBytes', () => {
  it('should return a Uint8Array of the requested size', () => {
    const result = randomBytes(16);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).toHaveLength(16);
  });

  it('should return an empty Uint8Array for size 0', () => {
    expect(randomBytes(0)).toHaveLength(0);
  });

  it('should return different values on consecutive calls', () => {
    expect(randomBytes(32)).not.toEqual(randomBytes(32));
  });

  it('should handle sizes larger than 65536', () => {
    const result = randomBytes(70000);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result).toHaveLength(70000);
  });

  it('should match @stablelib/random output shape for any size', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1024 }), (size) => {
        const ours = randomBytes(size);
        const ref = stablelibRandomBytes(size);
        return (
          ours instanceof Uint8Array &&
          ref instanceof Uint8Array &&
          ours.length === ref.length
        );
      })
    );
  });

  it('should produce output where all byte values are in range 0–255', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 256 }), (size) => {
        return randomBytes(size).every((b) => b >= 0 && b <= 255);
      })
    );
  });
});
