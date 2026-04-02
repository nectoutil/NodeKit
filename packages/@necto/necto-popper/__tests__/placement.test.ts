/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  isSide,
  isAlignment,
  isPlacement,
  getSide,
  getAlignment,
  getAxis,
  getOppositeSide,
  getOppositeAlignment
} from '../src/types/placement';

describe('placement utilities', () => {
  describe('isSide', () => {
    it('should return true for valid sides', () => {
      expect(isSide('top')).toBe(true);
      expect(isSide('right')).toBe(true);
      expect(isSide('bottom')).toBe(true);
      expect(isSide('left')).toBe(true);
    });

    it('should return false for invalid sides', () => {
      expect(isSide('center')).toBe(false);
      expect(isSide('start')).toBe(false);
      expect(isSide('')).toBe(false);
    });
  });

  describe('isAlignment', () => {
    it('should return true for valid alignments', () => {
      expect(isAlignment('start')).toBe(true);
      expect(isAlignment('end')).toBe(true);
    });

    it('should return false for invalid alignments', () => {
      expect(isAlignment('center')).toBe(false);
      expect(isAlignment('top')).toBe(false);
    });
  });

  describe('isPlacement', () => {
    it('should accept bare sides', () => {
      expect(isPlacement('top')).toBe(true);
      expect(isPlacement('bottom')).toBe(true);
      expect(isPlacement('left')).toBe(true);
      expect(isPlacement('right')).toBe(true);
    });

    it('should accept side-alignment combos', () => {
      expect(isPlacement('top-start')).toBe(true);
      expect(isPlacement('top-end')).toBe(true);
      expect(isPlacement('bottom-start')).toBe(true);
      expect(isPlacement('right-end')).toBe(true);
    });

    it('should reject invalid placements', () => {
      expect(isPlacement('top-center')).toBe(false);
      expect(isPlacement('middle')).toBe(false);
      expect(isPlacement('top-start-end')).toBe(false);
      expect(isPlacement('')).toBe(false);
    });
  });

  describe('getSide', () => {
    it('should extract side from placement', () => {
      expect(getSide('top')).toBe('top');
      expect(getSide('bottom-start')).toBe('bottom');
      expect(getSide('left-end')).toBe('left');
    });
  });

  describe('getAlignment', () => {
    it('should return alignment when present', () => {
      expect(getAlignment('top-start')).toBe('start');
      expect(getAlignment('bottom-end')).toBe('end');
    });

    it('should return undefined for bare sides', () => {
      expect(getAlignment('top')).toBeUndefined();
      expect(getAlignment('left')).toBeUndefined();
    });
  });

  describe('getAxis', () => {
    it('should return y for top/bottom', () => {
      expect(getAxis('top')).toBe('y');
      expect(getAxis('bottom')).toBe('y');
    });

    it('should return x for left/right', () => {
      expect(getAxis('left')).toBe('x');
      expect(getAxis('right')).toBe('x');
    });
  });

  describe('getOppositeSide', () => {
    it('should return opposite sides', () => {
      expect(getOppositeSide('top')).toBe('bottom');
      expect(getOppositeSide('bottom')).toBe('top');
      expect(getOppositeSide('left')).toBe('right');
      expect(getOppositeSide('right')).toBe('left');
    });
  });

  describe('getOppositeAlignment', () => {
    it('should return opposite alignments', () => {
      expect(getOppositeAlignment('start')).toBe('end');
      expect(getOppositeAlignment('end')).toBe('start');
    });
  });
});
