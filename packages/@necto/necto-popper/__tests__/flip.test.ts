/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { flip } from '../src/middlewares/flip';
import type { MiddlewareState } from '../src/types';

// Mock @necto/dom to control boundary detection
vi.mock('@necto/dom', () => ({
  getContainmentRect: () => ({
    top: 0,
    right: 800,
    bottom: 600,
    left: 0
  }),
  isNode: () => true,
  getOwnerWindow: () => window,
  getOwnerDocument: () => document
}));

function makeState(overrides: Partial<MiddlewareState> = {}): MiddlewareState {
  return {
    x: 100,
    y: 200,
    placement: 'bottom',
    strategy: 'absolute',
    rects: {
      reference: { x: 100, y: 150, width: 80, height: 40 },
      floating: { x: 0, y: 0, width: 80, height: 30 }
    },
    elements: {
      reference: document.createElement('div'),
      floating: document.createElement('div')
    },
    ...overrides
  };
}

describe('flip middleware', () => {
  it('should have name "flip"', () => {
    const mw = flip();
    expect(mw.name).toBe('flip');
  });

  it('should not flip when there is no overflow', async () => {
    const mw = flip();
    // Floating is well within viewport (0,0,800,600)
    const result = await mw.fn(makeState());
    expect(result.placement).toBeUndefined();
    expect(result.reset).toBeUndefined();
  });

  it('should flip bottom to top when overflowing bottom', async () => {
    const mw = flip();
    // Floating rect overflows bottom of viewport (600)
    const result = await mw.fn(
      makeState({
        placement: 'bottom',
        rects: {
          reference: { x: 100, y: 550, width: 80, height: 40 },
          floating: { x: 0, y: 0, width: 80, height: 30 }
        }
      })
    );
    // Floating at y=0, height=30, bottom overflow = 0+30 - 600 = negative, no overflow
    // But the floating rect itself: y=0, height=30 → bottom = 30 < 600
    // Let's try a floating that actually overflows
    const result2 = await mw.fn(
      makeState({
        placement: 'bottom',
        rects: {
          reference: { x: 100, y: 550, width: 80, height: 40 },
          floating: { x: 0, y: 580, width: 80, height: 30 }
        }
      })
    );
    expect(result2.placement).toBe('top');
    expect(result2.reset).toBe(true);
  });

  it('should flip top to bottom when overflowing top', async () => {
    const mw = flip();
    const result = await mw.fn(
      makeState({
        placement: 'top',
        rects: {
          reference: { x: 100, y: 10, width: 80, height: 40 },
          floating: { x: 0, y: -20, width: 80, height: 30 }
        }
      })
    );
    expect(result.placement).toBe('bottom');
    expect(result.reset).toBe(true);
  });

  it('should flip left to right when overflowing left', async () => {
    const mw = flip();
    const result = await mw.fn(
      makeState({
        placement: 'left',
        rects: {
          reference: { x: 20, y: 200, width: 80, height: 40 },
          floating: { x: -10, y: 0, width: 80, height: 30 }
        }
      })
    );
    expect(result.placement).toBe('right');
    expect(result.reset).toBe(true);
  });

  it('should flip right to left when overflowing right', async () => {
    const mw = flip();
    const result = await mw.fn(
      makeState({
        placement: 'right',
        rects: {
          reference: { x: 700, y: 200, width: 80, height: 40 },
          floating: { x: 750, y: 0, width: 80, height: 30 }
        }
      })
    );
    expect(result.placement).toBe('left');
    expect(result.reset).toBe(true);
  });

  it('should preserve alignment when flipping', async () => {
    const mw = flip();
    const result = await mw.fn(
      makeState({
        placement: 'bottom-start',
        rects: {
          reference: { x: 100, y: 550, width: 80, height: 40 },
          floating: { x: 0, y: 580, width: 80, height: 30 }
        }
      })
    );
    expect(result.placement).toBe('top-start');
  });

  it('should store flip data', async () => {
    const mw = flip();
    const result = await mw.fn(
      makeState({
        placement: 'top',
        rects: {
          reference: { x: 100, y: 10, width: 80, height: 40 },
          floating: { x: 0, y: -20, width: 80, height: 30 }
        }
      })
    );
    expect(result.data).toEqual({
      flipped: true,
      originalPlacement: 'top'
    });
  });
});
