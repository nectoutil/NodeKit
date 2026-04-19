import { describe, it, expect, vi } from 'vitest';
import { supportsPreventScroll, scrollIntoView } from '../src/scroll';

describe('supportsPreventScroll', () => {
  it('returns a boolean in browser environment', () => {
    expect(typeof supportsPreventScroll()).toBe('boolean');
  });
});

describe('scrollIntoView', () => {
  function makeRects(
    container: { top: number; bottom: number; left: number; right: number; height: number; width: number },
    element: { top: number; bottom: number; left: number; right: number; height: number; width: number }
  ) {
    const toRect = (r: typeof container) =>
      ({ ...r, x: r.left, y: r.top, toJSON: () => {} }) as DOMRect;
    return { containerRect: toRect(container), elementRect: toRect(element) };
  }

  it('scrolls down when element is below the container', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 0, bottom: 100, left: 0, right: 200, height: 100, width: 200 },
      { top: 150, bottom: 200, left: 0, right: 200, height: 50, width: 200 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollTop = 0;
    scrollIntoView(container, element);

    // nearest: elementRect.bottom - containerRect.bottom = 200 - 100 = 100
    expect(container.scrollTop).toBe(100);
  });

  it('scrolls up when element is above the container', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 100, bottom: 300, left: 0, right: 200, height: 200, width: 200 },
      { top: 50, bottom: 80, left: 0, right: 200, height: 30, width: 200 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollTop = 100;
    scrollIntoView(container, element);

    // nearest: 100 + (50 - 100) = 50
    expect(container.scrollTop).toBe(50);
  });

  it('does not scroll when element is already fully visible', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 0, bottom: 200, left: 0, right: 200, height: 200, width: 200 },
      { top: 50, bottom: 150, left: 0, right: 200, height: 100, width: 200 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollTop = 0;
    scrollIntoView(container, element);

    expect(container.scrollTop).toBe(0);
  });

  it('centers vertically with block: center', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 0, bottom: 200, left: 0, right: 200, height: 200, width: 200 },
      { top: 300, bottom: 340, left: 0, right: 200, height: 40, width: 200 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollTop = 0;
    scrollIntoView(container, element, { block: 'center' });

    // containerCenter=100, elementCenter=320 → 0 + (320 - 100) = 220
    expect(container.scrollTop).toBe(220);
  });

  it('scrolls right when element is to the right of the container', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 0, bottom: 200, left: 0, right: 200, height: 200, width: 200 },
      { top: 50, bottom: 150, left: 250, right: 350, height: 100, width: 100 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollLeft = 0;
    scrollIntoView(container, element);

    // nearest: 350 - 200 = 150
    expect(container.scrollLeft).toBe(150);
  });

  it('centers horizontally with inline: center', () => {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const { containerRect, elementRect } = makeRects(
      { top: 0, bottom: 200, left: 0, right: 200, height: 200, width: 200 },
      { top: 50, bottom: 150, left: 300, right: 360, height: 100, width: 60 }
    );
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(containerRect);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(elementRect);

    container.scrollLeft = 0;
    scrollIntoView(container, element, { inline: 'center' });

    // containerCenter=100, elementCenter=330 → 0 + (330 - 100) = 230
    expect(container.scrollLeft).toBe(230);
  });
});
