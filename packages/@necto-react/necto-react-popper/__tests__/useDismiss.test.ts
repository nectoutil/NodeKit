import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDismiss } from '../src/hooks/useDismiss/useDismiss';

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
});
