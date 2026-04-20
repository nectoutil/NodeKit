/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for tests.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  (window as any).PointerEvent = class PointerEvent extends Event {
    constructor(type: string, init?: PointerEventInit) { super(type, init); }
  };
}
import { renderHook, act } from '@testing-library/react';
import { useLongPress } from '@necto-react/hooks';

describe('useLongPress', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns longPressProps', () => {
    const { result } = renderHook(() => useLongPress());
    expect(result.current).toHaveProperty('longPressProps');
  });

  it('returns empty longPressProps when isDisabled is true', () => {
    const { result } = renderHook(() => useLongPress({ isDisabled: true }));
    expect(result.current.longPressProps).toEqual({});
  });

  it('calls onLongPressStart on pointer down for touch', () => {
    const onLongPressStart = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPressStart }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'touch', currentTarget: document.body
      } as any);
    });

    expect(onLongPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'longpressstart', pointerType: 'touch' })
    );
  });

  it('does not trigger for mouse pointer type', () => {
    const onLongPressStart = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPressStart }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'mouse', currentTarget: document.body
      } as any);
    });

    expect(onLongPressStart).not.toHaveBeenCalled();
  });

  it('does not trigger for non-primary button', () => {
    const onLongPressStart = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPressStart }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 2, pointerType: 'touch', currentTarget: document.body
      } as any);
    });

    expect(onLongPressStart).not.toHaveBeenCalled();
  });

  it('calls onLongPress after the threshold elapses', () => {
    const onLongPress = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);

    const { result } = renderHook(() => useLongPress({ onLongPress, threshold: 500 }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'touch', currentTarget: el
      } as any);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(500); });
    expect(onLongPress).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'longpress' })
    );

    document.body.removeChild(el);
  });

  it('does not call onLongPress if pointer up before threshold', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPress, threshold: 500 }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'touch', currentTarget: document.body
      } as any);
    });
    act(() => { vi.advanceTimersByTime(200); });
    act(() => { result.current.longPressProps.onPointerUp?.({} as any); });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('calls onLongPressEnd when pointer is released before threshold', () => {
    const onLongPressEnd = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPressEnd, threshold: 500 }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'touch', currentTarget: document.body
      } as any);
    });
    act(() => { result.current.longPressProps.onPointerUp?.({} as any); });

    expect(onLongPressEnd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'longpressend' })
    );
  });

  it('calls onLongPressEnd on pointer cancel', () => {
    const onLongPressEnd = vi.fn();
    const { result } = renderHook(() => useLongPress({ onLongPressEnd }));

    act(() => {
      result.current.longPressProps.onPointerDown?.({
        button: 0, pointerType: 'touch', currentTarget: document.body
      } as any);
    });
    act(() => { result.current.longPressProps.onPointerCancel?.({} as any); });

    expect(onLongPressEnd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'longpressend' })
    );
  });

  it('adds aria-description when accessibilityDescription and onLongPress are provided', () => {
    const { result } = renderHook(() =>
      useLongPress({ onLongPress: vi.fn(), accessibilityDescription: 'Hold for options' })
    );
    expect(result.current.longPressProps['aria-description']).toBe('Hold for options');
  });

  it('omits aria-description when onLongPress is not provided', () => {
    const { result } = renderHook(() =>
      useLongPress({ accessibilityDescription: 'Hold for options' })
    );
    expect(result.current.longPressProps['aria-description']).toBeUndefined();
  });
});
