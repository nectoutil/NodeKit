/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for tests.

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from '@necto-react/hooks';

describe('useKeyboard', () => {
  it('returns keyboardProps', () => {
    const { result } = renderHook(() => useKeyboard({}));
    expect(result.current).toHaveProperty('keyboardProps');
  });

  it('returns empty keyboardProps when isDisabled is true', () => {
    const { result } = renderHook(() =>
      useKeyboard({ isDisabled: true, onKeyDown: vi.fn(), onKeyUp: vi.fn() })
    );
    expect(result.current.keyboardProps).toEqual({});
  });

  it('calls onKeyDown with the native keyboard event', () => {
    const onKeyDown = vi.fn();
    const { result } = renderHook(() => useKeyboard({ onKeyDown }));

    const nativeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    act(() => {
      result.current.keyboardProps.onKeyDown?.({
        nativeEvent,
        currentTarget: document.body,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as any);
    });

    expect(onKeyDown).toHaveBeenCalledWith(nativeEvent);
  });

  it('calls onKeyUp with the native keyboard event', () => {
    const onKeyUp = vi.fn();
    const { result } = renderHook(() => useKeyboard({ onKeyUp }));

    const nativeEvent = new KeyboardEvent('keyup', { key: ' ' });
    act(() => {
      result.current.keyboardProps.onKeyUp?.({
        nativeEvent,
        currentTarget: document.body,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as any);
    });

    expect(onKeyUp).toHaveBeenCalledWith(nativeEvent);
  });

  it('omits onKeyDown when not provided', () => {
    const { result } = renderHook(() => useKeyboard({ onKeyUp: vi.fn() }));
    expect(result.current.keyboardProps.onKeyDown).toBeUndefined();
  });

  it('omits onKeyUp when not provided', () => {
    const { result } = renderHook(() => useKeyboard({ onKeyDown: vi.fn() }));
    expect(result.current.keyboardProps.onKeyUp).toBeUndefined();
  });

  it('does not call onKeyDown when disabled', () => {
    const onKeyDown = vi.fn();
    const { result } = renderHook(() =>
      useKeyboard({ isDisabled: true, onKeyDown })
    );
    expect(result.current.keyboardProps.onKeyDown).toBeUndefined();
    expect(onKeyDown).not.toHaveBeenCalled();
  });
});
