/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePopper } from '../src/hooks/usePopper';
import type { Middleware } from '@necto/popper';

vi.mock('@necto/popper', () => ({
  computePosition: vi.fn(() =>
    Promise.resolve({
      x: 100,
      y: 200,
      placement: 'bottom',
      strategy: 'absolute',
      middlewareData: {}
    })
  )
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

  it('should merge custom props with defaults', () => {
    const { result } = renderHook(() =>
      usePopper({ placement: 'top', strategy: 'fixed' })
    );

    expect(result.current.placement).toBe('top');
    expect(result.current.strategy).toBe('fixed');
  });

  it('should provide setReference and setFloating callbacks', () => {
    const { result } = renderHook(() => usePopper());

    expect(typeof result.current.refs.setReference).toBe('function');
    expect(typeof result.current.refs.setFloating).toBe('function');
  });

  it('should provide reference and floating refs initialized to null', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.refs.reference.current).toBeNull();
    expect(result.current.refs.floating.current).toBeNull();
  });

  it('should return transform-based floatingStyles by default', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.floatingStyles.position).toBe('absolute');
    expect(result.current.floatingStyles.left).toBe(0);
    expect(result.current.floatingStyles.top).toBe(0);
  });

  it('should include visibility hidden when not positioned', () => {
    const floatingElement = document.createElement('div');
    const { result } = renderHook(() => usePopper({ floating: floatingElement }));

    expect(result.current.floatingStyles.visibility).toBe('hidden');
  });

  it('should accept external reference element', () => {
    const refElement = document.createElement('div');
    const { result } = renderHook(() => usePopper({ reference: refElement }));

    expect(result.current.elements.reference).toBe(refElement);
  });

  it('should accept external floating element', () => {
    const floatingElement = document.createElement('div');
    const { result } = renderHook(() => usePopper({ floating: floatingElement }));

    expect(result.current.elements.floating).toBe(floatingElement);
  });

  it('should call computePosition when both elements are provided', async () => {
    const { computePosition } = await import('@necto/popper');
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');

    renderHook(() =>
      usePopper({ reference: refElement, floating: floatingElement })
    );

    await waitFor(() => {
      expect(computePosition).toHaveBeenCalledWith(
        refElement,
        floatingElement,
        expect.objectContaining({
          placement: 'bottom',
          strategy: 'absolute'
        })
      );
    });
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
        whileElementsMounted
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

  it('should memoize refs object across rerenders', () => {
    const { result, rerender } = renderHook(() => usePopper());

    const firstRefs = result.current.refs;
    rerender();

    expect(firstRefs).toBe(result.current.refs);
  });

  it('should memoize elements object when elements unchanged', () => {
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');

    const { result, rerender } = renderHook(() =>
      usePopper({ reference: refElement, floating: floatingElement })
    );

    const firstElements = result.current.elements;
    rerender();

    expect(firstElements).toBe(result.current.elements);
  });

  it('should update elements when external elements change', () => {
    const ref1 = document.createElement('div');
    const ref2 = document.createElement('div');

    const { result, rerender } = renderHook(
      ({ reference }) => usePopper({ reference }),
      { initialProps: { reference: ref1 } }
    );

    expect(result.current.elements.reference).toBe(ref1);

    rerender({ reference: ref2 });
    expect(result.current.elements.reference).toBe(ref2);
  });

  it('should accept middleware array', () => {
    const mw: Middleware = { name: 'test', fn: vi.fn() };
    const { result } = renderHook(() => usePopper({ middleware: [mw] }));

    expect(result.current).toBeDefined();
  });

  it('should handle open=false by setting isPositioned to false', () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePopper({ open }),
      { initialProps: { open: true } }
    );

    rerender({ open: false });
    expect(result.current.isPositioned).toBe(false);
  });

  it('should provide an update function', () => {
    const { result } = renderHook(() => usePopper());
    expect(typeof result.current.update).toBe('function');
  });

  it('should return left/top styles when transform is false', () => {
    const { result } = renderHook(() => usePopper({ transform: false }));

    expect(result.current.floatingStyles.position).toBe('absolute');
    expect(result.current.floatingStyles.left).toBe(0);
    expect(result.current.floatingStyles.top).toBe(0);
    expect(result.current.floatingStyles.transform).toBeUndefined();
  });

  it('should update refs.reference.current and elements.reference when setReference is called', () => {
    const { result } = renderHook(() => usePopper());
    const el = document.createElement('div');

    act(() => {
      result.current.refs.setReference(el);
    });

    expect(result.current.refs.reference.current).toBe(el);
    expect(result.current.elements.reference).toBe(el);
  });

  it('should be a no-op when setReference is called with the same node', () => {
    const { result } = renderHook(() => usePopper());
    const el = document.createElement('div');

    act(() => {
      result.current.refs.setReference(el);
    });

    const firstElements = result.current.elements;

    act(() => {
      result.current.refs.setReference(el);
    });

    expect(result.current.elements).toBe(firstElements);
  });

  it('should accept null via setReference to clear the reference', () => {
    const { result } = renderHook(() => usePopper());
    const el = document.createElement('div');

    act(() => {
      result.current.refs.setReference(el);
    });

    act(() => {
      result.current.refs.setReference(null);
    });

    expect(result.current.refs.reference.current).toBeNull();
    expect(result.current.elements.reference).toBeNull();
  });

  it('should update refs.floating.current and elements.floating when setFloating is called', () => {
    const { result } = renderHook(() => usePopper());
    const el = document.createElement('div');

    act(() => {
      result.current.refs.setFloating(el);
    });

    expect(result.current.refs.floating.current).toBe(el);
    expect(result.current.elements.floating).toBe(el);
  });

  it('should be a no-op when setFloating is called with the same node', () => {
    const { result } = renderHook(() => usePopper());
    const el = document.createElement('div');

    act(() => {
      result.current.refs.setFloating(el);
    });

    const firstElements = result.current.elements;

    act(() => {
      result.current.refs.setFloating(el);
    });

    expect(result.current.elements).toBe(firstElements);
  });

  it('should return left/top styles with a floating element when transform is false', () => {
    const floatingElement = document.createElement('div');
    const { result } = renderHook(() =>
      usePopper({ floating: floatingElement, transform: false })
    );

    expect(result.current.floatingStyles.position).toBe('absolute');
    expect(result.current.floatingStyles.transform).toBeUndefined();
    expect(result.current.floatingStyles.left).toBe(0);
    expect(result.current.floatingStyles.top).toBe(0);
    expect(result.current.floatingStyles.visibility).toBe('hidden');
  });

  it('should add willChange: transform when devicePixelRatio is 1.5 or higher', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2
    });

    try {
      const floatingElement = document.createElement('div');
      const { result } = renderHook(() =>
        usePopper({ floating: floatingElement })
      );

      expect(result.current.floatingStyles.willChange).toBe('transform');
    } finally {
      Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        value: originalDpr
      });
    }
  });

  it('should not add willChange when devicePixelRatio is below 1.5', () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1
    });

    try {
      const floatingElement = document.createElement('div');
      const { result } = renderHook(() =>
        usePopper({ floating: floatingElement })
      );

      expect(result.current.floatingStyles.willChange).toBeUndefined();
    } finally {
      Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        value: originalDpr
      });
    }
  });

  it('should mark isPositioned true after computePosition resolves with elements', async () => {
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');

    const { result } = renderHook(() =>
      usePopper({
        open: true,
        reference: refElement,
        floating: floatingElement
      })
    );

    await waitFor(() => {
      expect(result.current.isPositioned).toBe(true);
    });
  });

  it('should clear isPositioned when transitioning from open to closed after positioning', async () => {
    const refElement = document.createElement('div');
    const floatingElement = document.createElement('div');

    const { result, rerender } = renderHook(
      ({ open }) =>
        usePopper({
          open,
          reference: refElement,
          floating: floatingElement
        }),
      { initialProps: { open: true } }
    );

    await waitFor(() => {
      expect(result.current.isPositioned).toBe(true);
    });

    rerender({ open: false });

    expect(result.current.isPositioned).toBe(false);
  });
});
