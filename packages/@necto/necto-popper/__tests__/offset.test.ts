import { describe, it, expect } from 'vitest';
import { offset } from '../src/middlewares/offset';
import type { MiddlewareState } from '../src/types';

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

describe('offset middleware', () => {
  it('should offset bottom placement by adding to y', async () => {
    const mw = offset(8);
    const result = await mw.fn(makeState({ placement: 'bottom' }));
    expect(result.x).toBe(100);
    expect(result.y).toBe(208);
  });

  it('should offset top placement by subtracting from y', async () => {
    const mw = offset(8);
    const result = await mw.fn(makeState({ placement: 'top', y: 100 }));
    expect(result.y).toBe(92);
  });

  it('should offset right placement by adding to x', async () => {
    const mw = offset(10);
    const result = await mw.fn(makeState({ placement: 'right' }));
    expect(result.x).toBe(110);
    expect(result.y).toBe(200);
  });

  it('should offset left placement by subtracting from x', async () => {
    const mw = offset(10);
    const result = await mw.fn(makeState({ placement: 'left' }));
    expect(result.x).toBe(90);
  });

  it('should accept options object', async () => {
    const mw = offset({ value: 12 });
    const result = await mw.fn(makeState({ placement: 'bottom' }));
    expect(result.y).toBe(212);
  });

  it('should store offset value in data', async () => {
    const mw = offset(5);
    const result = await mw.fn(makeState());
    expect(result.data).toEqual({ offset: 5 });
  });

  it('should handle zero offset', async () => {
    const mw = offset(0);
    const result = await mw.fn(makeState());
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('should handle aligned placements by side', async () => {
    const mw = offset(5);
    const result = await mw.fn(makeState({ placement: 'bottom-start' }));
    expect(result.y).toBe(205);
    expect(result.x).toBe(100); // x unchanged for bottom
  });

  it('should have name "offset"', () => {
    const mw = offset(5);
    expect(mw.name).toBe('offset');
  });
});
