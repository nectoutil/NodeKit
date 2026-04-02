/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { resolvePadding, hasAnyOverflow, clamp } from '../src/types/geometry';

describe('geometry utilities', () => {
  describe('resolvePadding', () => {
    it('should resolve a number to all four sides', () => {
      expect(resolvePadding(10)).toEqual({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      });
    });

    it('should resolve 0 by default', () => {
      expect(resolvePadding()).toEqual({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });
    });

    it('should resolve partial padding object', () => {
      expect(resolvePadding({ top: 5, left: 10 })).toEqual({
        top: 5,
        right: 0,
        bottom: 0,
        left: 10
      });
    });

    it('should resolve full padding object', () => {
      expect(resolvePadding({ top: 1, right: 2, bottom: 3, left: 4 })).toEqual({
        top: 1,
        right: 2,
        bottom: 3,
        left: 4
      });
    });
  });

  describe('hasAnyOverflow', () => {
    it('should return false when no overflow', () => {
      expect(hasAnyOverflow({ top: 0, right: 0, bottom: 0, left: 0 })).toBe(false);
    });

    it('should return false for negative values', () => {
      expect(hasAnyOverflow({ top: -10, right: -5, bottom: -3, left: -1 })).toBe(false);
    });

    it('should return true when any side overflows', () => {
      expect(hasAnyOverflow({ top: 1, right: 0, bottom: 0, left: 0 })).toBe(true);
      expect(hasAnyOverflow({ top: 0, right: 5, bottom: 0, left: 0 })).toBe(true);
      expect(hasAnyOverflow({ top: 0, right: 0, bottom: 10, left: 0 })).toBe(true);
      expect(hasAnyOverflow({ top: 0, right: 0, bottom: 0, left: 3 })).toBe(true);
    });
  });

  describe('clamp', () => {
    it('should clamp within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should clamp to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle min equal to max', () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });
  });
});
