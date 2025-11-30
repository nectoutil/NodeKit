import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePopper } from '../src/hooks/usePopper';
import type { Middleware } from '@necto/popper';

vi.mock('@necto/popper', () => ({
  computePosition: vi.fn(() =>
    Promise.resolve({
      x: 100,
      y: 200,
      placement: 'bottom',
      strategy: 'absolute',
      middlewareData: {},
    })
  ),
}));

describe('usePopper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state with default values', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    expect(result.current.placement).toBe('bottom');
    expect(result.current.strategy).toBe('absolute');
    expect(result.current.isPositioned).toBe(false);
    expect(result.current.refs).toBeDefined();
    expect(result.current.elements).toBeDefined();
    expect(result.current.floatingStyles).toBeDefined();
  });

  it('should merge custom props with defaults using defu', () => {
    const { result } = renderHook(() =>
      usePopper({
        placement: 'top',
        strategy: 'fixed',
      })
    );

    expect(result.current.placement).toBe('top');
    expect(result.current.strategy).toBe('fixed');
  });

  it('should provide setReference and setFloating callbacks', () => {
    const { result } = renderHook(() => usePopper());

    expect(typeof result.current.refs.setReference).toBe('function');
    expect(typeof result.current.refs.setFloating).toBe('function');
  });

  it('should provide reference and floating refs', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.refs.reference).toBeDefined();
    expect(result.current.refs.reference.current).toBeNull();
    expect(result.current.refs.floating).toBeDefined();
    expect(result.current.refs.floating.current).toBeNull();
  });

  it('should return transform-based styles by default', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.floatingStyles).toEqual({
      position: 'absolute',
      left: 0,
      top: 0,
    });
  });

  it('should return position-based styles when transform is false', () => {
    const { result } = renderHook(() => usePopper({ transform: false }));

    expect(result.current.floatingStyles).toEqual({
      position: 'absolute',
      left: 0,
      top: 0,
    });
  });

  it('should accept middleware array', () => {
    const offsetMiddleware: Middleware = {
      name: 'offset',
      fn: vi.fn(),
    };

    const { result } = renderHook(() =>
      usePopper({
        middleware: [offsetMiddleware],
      })
    );

    expect(result.current).toBeDefined();
  });

  it('should handle open prop', () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePopper({ open }),
      { initialProps: { open: true } }
    );

    expect(result.current.isPositioned).toBe(false);

    rerender({ open: false });
    expect(result.current.isPositioned).toBe(false);
  });

  it('should provide update function', () => {
    const { result } = renderHook(() => usePopper());

    expect(typeof result.current.update).toBe('function');
  });

  it('should accept external reference element', () => {
    const refElement = document.createElement('div');

    const { result } = renderHook(() =>
      usePopper({
        reference: refElement,
      })
    );

    expect(result.current.elements.reference).toBe(refElement);
  });

  it('should accept external floating element', () => {
    const floatingElement = document.createElement('div');

    const { result } = renderHook(() =>
      usePopper({
        floating: floatingElement,
      })
    );

    expect(result.current.elements.floating).toBe(floatingElement);
  });

  it('should call whileElementsMounted when both elements are present', async () => {
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');
    const cleanup = vi.fn();
    const whileElementsMounted = vi.fn(() => cleanup);

    renderHook(() =>
      usePopper({
        reference: refElement,
        floating: floatingElement,
        whileElementsMounted,
      })
    );

    await waitFor(() => {
      expect(whileElementsMounted).toHaveBeenCalledWith(
        refElement,
        floatingElement,
        expect.any(Function)
      );
    });
  });

  it('should memoize refs object', () => {
    const { result, rerender } = renderHook(() => usePopper());

    const firstRefs = result.current.refs;
    rerender();
    const secondRefs = result.current.refs;

    expect(firstRefs).toBe(secondRefs);
  });

  it('should memoize elements object', () => {
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');

    const { result, rerender } = renderHook(() =>
      usePopper({
        reference: refElement,
        floating: floatingElement,
      })
    );

    const firstElements = result.current.elements;
    rerender();
    const secondElements = result.current.elements;

    expect(firstElements).toBe(secondElements);
  });

  it('should update elements when external elements change', () => {
    const refElement1 = document.createElement('div');
    const refElement2 = document.createElement('div');

    const { result, rerender } = renderHook(
      ({ reference }) => usePopper({ reference }),
      { initialProps: { reference: refElement1 } }
    );

    expect(result.current.elements.reference).toBe(refElement1);

    rerender({ reference: refElement2 });
    expect(result.current.elements.reference).toBe(refElement2);
  });
});
