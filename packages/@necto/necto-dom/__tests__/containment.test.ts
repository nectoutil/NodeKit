import { describe, it, expect, vi } from 'vitest';
import { getContainmentRect } from '../src/containment';

describe('getContainmentRect', () => {
  it('returns the bounding rect of a containment element', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 10, left: 20, bottom: 110, right: 220,
      width: 200, height: 100, x: 20, y: 10, toJSON: () => {}
    } as DOMRect);

    expect(getContainmentRect(el)).toEqual({ top: 10, left: 20, bottom: 110, right: 220 });
  });

  it('returns viewport dimensions when containment is null', () => {
    const rect = getContainmentRect(null);
    expect(rect.top).toBe(0);
    expect(rect.left).toBe(0);
    expect(typeof rect.bottom).toBe('number');
    expect(typeof rect.right).toBe('number');
  });

  it('returns viewport dimensions when containment is undefined', () => {
    const rect = getContainmentRect(undefined);
    expect(rect.top).toBe(0);
    expect(rect.left).toBe(0);
  });

  it('uses fallbackElement owner window for viewport dimensions', () => {
    const fallback = document.createElement('div');
    document.body.appendChild(fallback);

    const rect = getContainmentRect(null, fallback);
    expect(rect.top).toBe(0);
    expect(rect.left).toBe(0);
    expect(rect.bottom).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeGreaterThanOrEqual(0);

    document.body.removeChild(fallback);
  });

  it('returns zero rect in SSR when no window or document', () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    // @ts-expect-error — simulating SSR
    delete globalThis.document;
    // @ts-expect-error — simulating SSR
    delete globalThis.window;

    const rect = getContainmentRect(null);
    expect(rect).toEqual({ top: 0, left: 0, bottom: 0, right: 0 });

    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  });
});
