/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDismiss } from '../src/hooks/useDismiss/useDismiss';

type RefFn = (node: Element | null) => void;
type PointerFn = () => void;

describe('useDismiss', () => {
  let onOpenChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onOpenChange = vi.fn();
  });

  it('should return reference and floating prop objects', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(result.current.reference).toBeDefined();
    expect(result.current.floating).toBeDefined();
  });

  it('should close on Escape key', () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not close on Escape when escapeKey is false', () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, escapeKey: false })
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should close on outside click', () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true })
      );
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not close on outside click when outsidePress is false', () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, outsidePress: false })
    );

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should not fire when not open', () => {
    renderHook(() => useDismiss({ open: false, onOpenChange }));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
      document.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should not fire when disabled', () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, enabled: false })
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should return empty props when disabled', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange, enabled: false })
    );

    expect(result.current.reference).toEqual({});
    expect(result.current.floating).toEqual({});
  });

  it('should provide ref callbacks when enabled', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(typeof result.current.reference.ref).toBe('function');
    expect(typeof result.current.floating.ref).toBe('function');
  });

  it('should provide onPointerDown on floating for inside tree detection', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(typeof result.current.floating.onPointerDown).toBe('function');
  });

  it('should not close on non-Escape keys', () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(addSpy).toHaveBeenCalled();

    unmount();

    expect(removeSpy).toHaveBeenCalled();

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('should read escapeKey flag from bubbles object', () => {
    const stopSpy = vi.spyOn(KeyboardEvent.prototype, 'stopPropagation');

    renderHook(() =>
      useDismiss({
        open: true,
        onOpenChange,
        bubbles: { escapeKey: true }
      })
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });

    expect(stopSpy).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);

    stopSpy.mockRestore();
  });

  it('should default escapeKey bubble to false when bubbles is empty object', () => {
    const stopSpy = vi.spyOn(KeyboardEvent.prototype, 'stopPropagation');

    renderHook(() => useDismiss({ open: true, onOpenChange, bubbles: {} }));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });

    expect(stopSpy).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);

    stopSpy.mockRestore();
  });

  it('should read outsidePress flag from bubbles object', () => {
    const stopSpy = vi.spyOn(MouseEvent.prototype, 'stopPropagation');

    renderHook(() =>
      useDismiss({
        open: true,
        onOpenChange,
        bubbles: { outsidePress: true }
      })
    );

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(stopSpy).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);

    stopSpy.mockRestore();
  });

  it('should stopPropagation for outside press when bubbles is false', () => {
    const stopSpy = vi.spyOn(MouseEvent.prototype, 'stopPropagation');

    renderHook(() =>
      useDismiss({ open: true, onOpenChange, bubbles: false })
    );

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(stopSpy).toHaveBeenCalled();

    stopSpy.mockRestore();
  });

  it('should not close when click target is inside the floating element', () => {
    const floatingEl = document.createElement('div');
    const child = document.createElement('span');
    floatingEl.appendChild(child);
    document.body.appendChild(floatingEl);

    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    act(() => {
      (result.current.floating.ref as RefFn)(floatingEl);
    });

    act(() => {
      child.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).not.toHaveBeenCalled();

    document.body.removeChild(floatingEl);
  });

  it('should not close when click is inside the reference by default', () => {
    const referenceEl = document.createElement('button');
    document.body.appendChild(referenceEl);

    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    act(() => {
      referenceEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).not.toHaveBeenCalled();

    document.body.removeChild(referenceEl);
  });

  it('should close when click is inside the reference and referencePress is true', () => {
    const referenceEl = document.createElement('button');
    document.body.appendChild(referenceEl);

    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange, referencePress: true })
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    act(() => {
      referenceEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    document.body.removeChild(referenceEl);
  });

  it('should not close when outsidePress predicate returns false', () => {
    const outsidePress = vi.fn(() => false);

    renderHook(() => useDismiss({ open: true, onOpenChange, outsidePress }));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(outsidePress).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should close when outsidePress predicate returns true', () => {
    const outsidePress = vi.fn(() => true);

    renderHook(() => useDismiss({ open: true, onOpenChange, outsidePress }));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(outsidePress).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should skip close once after onPointerDown marks the tree as inside', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    act(() => {
      (result.current.floating.onPointerDown as PointerFn)();
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).not.toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should close on ancestor element scroll when ancestorScroll is true', () => {
    const parent = document.createElement('div');
    const referenceEl = document.createElement('button');
    parent.appendChild(referenceEl);
    document.body.appendChild(parent);

    const { result, rerender } = renderHook(
      ({ open }) =>
        useDismiss({ open, onOpenChange, ancestorScroll: true }),
      { initialProps: { open: false } }
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    rerender({ open: true });

    act(() => {
      parent.dispatchEvent(new Event('scroll'));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    document.body.removeChild(parent);
  });

  it('should close on window scroll when ancestorScroll is true', () => {
    const referenceEl = document.createElement('button');
    document.body.appendChild(referenceEl);

    const { result, rerender } = renderHook(
      ({ open }) =>
        useDismiss({ open, onOpenChange, ancestorScroll: true }),
      { initialProps: { open: false } }
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    rerender({ open: true });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    document.body.removeChild(referenceEl);
  });

  it('should not close on scroll when ancestorScroll is false', () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should store the element when reference.ref is invoked', () => {
    const el = document.createElement('div');
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(() => {
      act(() => {
        (result.current.reference.ref as RefFn)(el);
      });
    }).not.toThrow();
  });

  it('should store the element when floating.ref is invoked', () => {
    const el = document.createElement('div');
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(() => {
      act(() => {
        (result.current.floating.ref as RefFn)(el);
      });
    }).not.toThrow();
  });
});
