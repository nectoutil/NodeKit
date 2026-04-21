/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import { useDismiss } from '../src/hooks/useDismiss/useDismiss';

import type { UserEvent } from '@testing-library/user-event';

type RefFn = (node: Element | null) => void;
type PointerFn = () => void;

describe('useDismiss', () => {
  let onOpenChange: ReturnType<typeof vi.fn>;
  let user: UserEvent;

  beforeEach(() => {
    onOpenChange = vi.fn();
    user = userEvent.setup();
  });

  it('should return reference and floating prop objects', () => {
    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    expect(result.current.reference).toBeDefined();
    expect(result.current.floating).toBeDefined();
  });

  it('should close on Escape key', async () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not close on Escape when escapeKey is false', async () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, escapeKey: false })
    );

    await user.keyboard('{Escape}');

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should close on outside click', async () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    await user.click(document.body);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not close on outside click when outsidePress is false', async () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, outsidePress: false })
    );

    await user.click(document.body);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should not fire when not open', async () => {
    renderHook(() => useDismiss({ open: false, onOpenChange }));

    await user.keyboard('{Escape}');
    await user.click(document.body);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should not fire when disabled', async () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, enabled: false })
    );

    await user.keyboard('{Escape}');

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

  it('should not close on non-Escape keys', async () => {
    renderHook(() => useDismiss({ open: true, onOpenChange }));

    await user.keyboard('{Enter}');

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
    renderHook(() =>
      useDismiss({
        open: true,
        onOpenChange,
        bubbles: { escapeKey: true }
      })
    );

    const evt = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const stopSpy = vi.spyOn(evt, 'stopPropagation');

    act(() => {
      document.dispatchEvent(evt);
    });

    expect(stopSpy).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should default escapeKey bubble to false when bubbles is empty object', () => {
    renderHook(() => useDismiss({ open: true, onOpenChange, bubbles: {} }));

    const evt = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const stopSpy = vi.spyOn(evt, 'stopPropagation');

    act(() => {
      document.dispatchEvent(evt);
    });

    expect(stopSpy).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should read outsidePress flag from bubbles object', () => {
    renderHook(() =>
      useDismiss({
        open: true,
        onOpenChange,
        bubbles: { outsidePress: true }
      })
    );

    const evt = new MouseEvent('mousedown', { bubbles: true });
    const stopSpy = vi.spyOn(evt, 'stopPropagation');

    act(() => {
      document.dispatchEvent(evt);
    });

    expect(stopSpy).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should stopPropagation for outside press when bubbles is false', () => {
    renderHook(() =>
      useDismiss({ open: true, onOpenChange, bubbles: false })
    );

    const evt = new MouseEvent('mousedown', { bubbles: true });
    const stopSpy = vi.spyOn(evt, 'stopPropagation');

    act(() => {
      document.dispatchEvent(evt);
    });

    expect(stopSpy).toHaveBeenCalled();
  });

  it('should not close when click target is inside the floating element', async () => {
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

    await user.click(child);

    expect(onOpenChange).not.toHaveBeenCalled();

    document.body.removeChild(floatingEl);
  });

  it('should not close when click is inside the reference by default', async () => {
    const referenceEl = document.createElement('button');
    document.body.appendChild(referenceEl);

    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange })
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    await user.click(referenceEl);

    expect(onOpenChange).not.toHaveBeenCalled();

    document.body.removeChild(referenceEl);
  });

  it('should close when click is inside the reference and referencePress is true', async () => {
    const referenceEl = document.createElement('button');
    document.body.appendChild(referenceEl);

    const { result } = renderHook(() =>
      useDismiss({ open: true, onOpenChange, referencePress: true })
    );

    act(() => {
      (result.current.reference.ref as RefFn)(referenceEl);
    });

    await user.click(referenceEl);

    expect(onOpenChange).toHaveBeenCalledWith(false);

    document.body.removeChild(referenceEl);
  });

  it('should not close when outsidePress predicate returns false', async () => {
    const outsidePress = vi.fn(() => false);

    renderHook(() => useDismiss({ open: true, onOpenChange, outsidePress }));

    await user.click(document.body);

    expect(outsidePress).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should close when outsidePress predicate returns true', async () => {
    const outsidePress = vi.fn(() => true);

    renderHook(() => useDismiss({ open: true, onOpenChange, outsidePress }));

    await user.click(document.body);

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
