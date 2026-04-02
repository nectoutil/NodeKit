/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { computeCoords } from '../src/utils/getPlacementCoords';
import type { ElementRects } from '../src/types';

// Reference: 100x40 at (200, 300)
// Floating: 80x30
const rects: ElementRects = {
  reference: { x: 200, y: 300, width: 100, height: 40 },
  floating: { x: 0, y: 0, width: 80, height: 30 }
};

describe('computeCoords', () => {
  describe('basic placements (centered)', () => {
    it('should position above for "top"', () => {
      const { x, y } = computeCoords('top', rects);
      // Centered: 200 + 100/2 - 80/2 = 210
      expect(x).toBe(210);
      // Above: 300 - 30 = 270
      expect(y).toBe(270);
    });

    it('should position below for "bottom"', () => {
      const { x, y } = computeCoords('bottom', rects);
      expect(x).toBe(210);
      // Below: 300 + 40 = 340
      expect(y).toBe(340);
    });

    it('should position left for "left"', () => {
      const { x, y } = computeCoords('left', rects);
      // Left: 200 - 80 = 120
      expect(x).toBe(120);
      // Centered vertically: 300 + 40/2 - 30/2 = 305
      expect(y).toBe(305);
    });

    it('should position right for "right"', () => {
      const { x, y } = computeCoords('right', rects);
      // Right: 200 + 100 = 300
      expect(x).toBe(300);
      expect(y).toBe(305);
    });
  });

  describe('aligned placements', () => {
    it('should align start for "top-start"', () => {
      const { x, y } = computeCoords('top-start', rects);
      // Aligned to reference left edge
      expect(x).toBe(200);
      expect(y).toBe(270);
    });

    it('should align end for "top-end"', () => {
      const { x, y } = computeCoords('top-end', rects);
      // Aligned to reference right edge: 200 + 100 - 80 = 220
      expect(x).toBe(220);
      expect(y).toBe(270);
    });

    it('should align start for "bottom-start"', () => {
      const { x, y } = computeCoords('bottom-start', rects);
      expect(x).toBe(200);
      expect(y).toBe(340);
    });

    it('should align end for "bottom-end"', () => {
      const { x, y } = computeCoords('bottom-end', rects);
      expect(x).toBe(220);
      expect(y).toBe(340);
    });

    it('should align start for "left-start"', () => {
      const { x, y } = computeCoords('left-start', rects);
      expect(x).toBe(120);
      // Aligned to reference top edge
      expect(y).toBe(300);
    });

    it('should align end for "left-end"', () => {
      const { x, y } = computeCoords('left-end', rects);
      expect(x).toBe(120);
      // Aligned to reference bottom edge: 300 + 40 - 30 = 310
      expect(y).toBe(310);
    });

    it('should align start for "right-start"', () => {
      const { x, y } = computeCoords('right-start', rects);
      expect(x).toBe(300);
      expect(y).toBe(300);
    });

    it('should align end for "right-end"', () => {
      const { x, y } = computeCoords('right-end', rects);
      expect(x).toBe(300);
      expect(y).toBe(310);
    });
  });

  describe('edge cases', () => {
    it('should handle zero-size floating element', () => {
      const zeroRects: ElementRects = {
        reference: { x: 100, y: 100, width: 50, height: 50 },
        floating: { x: 0, y: 0, width: 0, height: 0 }
      };
      const { x, y } = computeCoords('bottom', zeroRects);
      expect(x).toBe(125); // centered
      expect(y).toBe(150); // below reference
    });

    it('should handle equal-size elements', () => {
      const equalRects: ElementRects = {
        reference: { x: 50, y: 50, width: 100, height: 100 },
        floating: { x: 0, y: 0, width: 100, height: 100 }
      };
      const { x, y } = computeCoords('top', equalRects);
      expect(x).toBe(50); // perfectly aligned
      expect(y).toBe(-50); // above
    });
  });
});
