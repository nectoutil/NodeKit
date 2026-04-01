import { describe, it, expect, vi } from 'vitest';
import { computePosition } from '../src/core/computePosition';
import { createMiddleware } from '../src/types';

// Mock getElementRects to return controlled values
vi.mock('../src/core/getElementRects', () => ({
  getElementRects: () => ({
    reference: { x: 200, y: 300, width: 100, height: 40 },
    floating: { x: 0, y: 0, width: 80, height: 30 }
  })
}));

describe('computePosition', () => {
  const reference = document.createElement('div');
  const floating = document.createElement('div');

  it('should return default bottom placement coords', async () => {
    const result = await computePosition(reference, floating);
    expect(result.placement).toBe('bottom');
    expect(result.strategy).toBe('absolute');
    // bottom center: x=200+50-40=210, y=300+40=340
    expect(result.x).toBe(210);
    expect(result.y).toBe(340);
  });

  it('should respect placement option', async () => {
    const result = await computePosition(reference, floating, {
      placement: 'top'
    });
    expect(result.placement).toBe('top');
    expect(result.y).toBe(270); // 300 - 30
  });

  it('should respect strategy option', async () => {
    const result = await computePosition(reference, floating, {
      strategy: 'fixed'
    });
    expect(result.strategy).toBe('fixed');
  });

  it('should apply middleware that modifies x/y', async () => {
    const nudge = createMiddleware('nudge', () => ({
      x: 999,
      y: 888
    }));

    const result = await computePosition(reference, floating, {
      middleware: [nudge]
    });
    expect(result.x).toBe(999);
    expect(result.y).toBe(888);
  });

  it('should apply middleware that changes placement', async () => {
    const forceTop = createMiddleware('forceTop', () => ({
      placement: 'top' as const
    }));

    const result = await computePosition(reference, floating, {
      placement: 'bottom',
      middleware: [forceTop]
    });
    expect(result.placement).toBe('top');
  });

  it('should recalculate coords on middleware reset', async () => {
    const flipToTop = createMiddleware('flipToTop', (state) => {
      if (state.placement === 'bottom') {
        return { placement: 'top' as const, reset: true };
      }
      return {};
    });

    const result = await computePosition(reference, floating, {
      placement: 'bottom',
      middleware: [flipToTop]
    });
    expect(result.placement).toBe('top');
    // After reset, coords should be recalculated for 'top'
    expect(result.y).toBe(270);
  });

  it('should accumulate middleware data', async () => {
    const mw1 = createMiddleware('first', () => ({
      data: { a: 1 }
    }));
    const mw2 = createMiddleware('second', () => ({
      data: { b: 2 }
    }));

    const result = await computePosition(reference, floating, {
      middleware: [mw1, mw2]
    });
    expect(result.middlewareData).toEqual({
      first: { a: 1 },
      second: { b: 2 }
    });
  });

  it('should run middleware sequentially', async () => {
    const order: string[] = [];
    const mw1 = createMiddleware('first', () => {
      order.push('first');
      return { x: 50 };
    });
    const mw2 = createMiddleware('second', (state) => {
      order.push('second');
      // Should see the x from mw1
      return { x: state.x + 10 };
    });

    const result = await computePosition(reference, floating, {
      middleware: [mw1, mw2]
    });
    expect(order).toEqual(['first', 'second']);
    expect(result.x).toBe(60);
  });

  it('should handle async middleware', async () => {
    const asyncMw = createMiddleware('async', async () => {
      return { x: 42, y: 24 };
    });

    const result = await computePosition(reference, floating, {
      middleware: [asyncMw]
    });
    expect(result.x).toBe(42);
    expect(result.y).toBe(24);
  });

  it('should handle empty middleware array', async () => {
    const result = await computePosition(reference, floating, {
      middleware: []
    });
    expect(result.x).toBe(210);
    expect(result.y).toBe(340);
  });
});
