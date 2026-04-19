/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFocusRing } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('useFocusRing', () => {
  const focusEvt = {
    target: document.body,
    currentTarget: document.body,
    nativeEvent: { target: document.body }
  } as any;

  it('should return isFocused and isFocusVisible as false by default', () => {
    const { result } = renderHook(() => useFocusRing());
    expect(result.current.isFocused).toBe(false);
    expect(result.current.isFocusVisible).toBe(false);
    expect(result.current.focusProps).toBeDefined();
  });

  it('should return isFocusVisible as true if autoFocus is true', () => {
    const { result } = renderHook(() => useFocusRing({ autoFocus: true }));
    expect(result.current.isFocusVisible).toBe(true);
  });

  it('should provide focusWithinProps if within is true', () => {
    const { result } = renderHook(() => useFocusRing({ within: true }));
    expect(result.current.focusProps).toHaveProperty('onFocus');
    expect(result.current.focusProps).toHaveProperty('onBlur');
  });

  it('should update isFocused and isFocusVisible on focus change', () => {
    const { result } = renderHook(() => useFocusRing());

    act(() => {
      result.current.focusProps?.onFocus?.(focusEvt);
    });
    expect(result.current.isFocused).toBe(true);

    act(() => {
      result.current.focusProps?.onBlur?.(focusEvt);
    });
    expect(result.current.isFocused).toBe(false);
  });

  it('should update isFocusVisible when useFocusVisibleListener is triggered', () => {
    const { result } = renderHook(() => useFocusRing());

    expect(result.current.isFocusVisible).toBe(false);

    act(() => {
      result.current.focusProps?.onFocus?.(focusEvt);
    });
    expect(result.current.isFocusVisible).toBe(true);

    act(() => {
      result.current.focusProps?.onBlur?.(focusEvt);
    });
    expect(result.current.isFocusVisible).toBe(false);
  });
});
