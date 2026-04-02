/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { shift } from '../src/middlewares/shift';
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

describe('shift middleware', () => {
  it('should have name "shift"', () => {
    const mw = shift();
    expect(mw.name).toBe('shift');
  });

  it('should not shift when no overflow', async () => {
    const mw = shift();
    const result = await mw.fn(makeState({ x: 100, y: 100 }));
    // No overflow → empty result
    expect(result).toEqual({});
  });

  it('should shift right when overflowing left', async () => {
    const mw = shift();
    const result = await mw.fn(makeState({ x: -20, y: 100 }));
    expect(result.x).toBe(0);
    expect(result.data).toEqual({ shifted: { x: 20, y: 0 } });
  });

  it('should shift left when overflowing right', async () => {
    const mw = shift();
    // x=750 + width=80 = 830, overflows right by 30
    const result = await mw.fn(makeState({ x: 750, y: 100 }));
    expect(result.x).toBe(720);
    expect(result.data).toEqual({ shifted: { x: -30, y: 0 } });
  });

  it('should shift down when overflowing top', async () => {
    const mw = shift();
    const result = await mw.fn(makeState({ x: 100, y: -10 }));
    expect(result.y).toBe(0);
  });

  it('should shift up when overflowing bottom', async () => {
    const mw = shift();
    // y=580 + height=30 = 610, overflows bottom by 10
    const result = await mw.fn(makeState({ x: 100, y: 580 }));
    expect(result.y).toBe(570);
  });

  it('should respect maxShift option', async () => {
    const mw = shift({ maxShift: 5 });
    // Overflows left by 20, but maxShift limits to 5
    const result = await mw.fn(makeState({ x: -20, y: 100 }));
    expect(result.x).toBe(-15);
  });

  it('should only shift x axis when axis is "x"', async () => {
    const mw = shift({ axis: 'x' });
    // Overflows both left and top
    const result = await mw.fn(makeState({ x: -20, y: -10 }));
    expect(result.x).toBe(0);
    // y stays unchanged (returned as-is since shifted data only tracks diff)
    expect(result.y).toBe(-10);
  });

  it('should only shift y axis when axis is "y"', async () => {
    const mw = shift({ axis: 'y' });
    const result = await mw.fn(makeState({ x: -20, y: -10 }));
    expect(result.x).toBe(-20);
    expect(result.y).toBe(0);
  });
});
