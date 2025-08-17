// biome-ignore-all lint/suspicious/noExplicitAny: Explicity any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFocus } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useFocus', () => {
  let onFocus: any, onBlur: any, onFocusChange: any;

  beforeEach(() => {
    onFocus = vi.fn();
    onBlur = vi.fn();
    onFocusChange = vi.fn();
  });

  it('should return focusProps with onFocus and onBlur if not disabled', () => {
    const { result } = renderHook(() =>
      useFocus({ onFocus, onBlur, onFocusChange })
    );
    expect(result.current.focusProps).toHaveProperty('onFocus');
    expect(result.current.focusProps).toHaveProperty('onBlur');
  });

  it('should not return onFocus/onBlur if isDisabled is true', () => {
    const { result } = renderHook(() =>
      useFocus({ isDisabled: true, onFocus, onBlur, onFocusChange })
    );
    expect(result.current.focusProps).not.toHaveProperty('onFocus');
    expect(result.current.focusProps).not.toHaveProperty('onBlur');
  });

  it('should call onFocus and onFocusChange(true) on focus event', () => {
    const { result } = renderHook(() =>
      useFocus({ onFocus, onBlur, onFocusChange })
    );
    const evt = {
      target: document.body,
      currentTarget: document.body,
      nativeEvent: { target: document.body }
    } as any;
    act(() => {
      result.current.focusProps?.onFocus?.(evt);
    });
    expect(onFocus).toHaveBeenCalledWith(evt);
    expect(onFocusChange).toHaveBeenCalledWith(true);
  });

  it('should call onBlur and onFocusChange(false) on blur event', () => {
    const { result } = renderHook(() =>
      useFocus({ onFocus, onBlur, onFocusChange })
    );
    const evt = {
      target: document.body,
      currentTarget: document.body,
      nativeEvent: { target: document.body }
    } as any;
    act(() => {
      result.current.focusProps?.onBlur?.(evt);
    });
    expect(onBlur).toHaveBeenCalledWith(evt);
    expect(onFocusChange).toHaveBeenCalledWith(false);
  });

  it('should not call onFocus if event.target !== event.currentTarget', () => {
    const { result } = renderHook(() => useFocus({ onFocus, onFocusChange }));
    const evt = {
      target: document.createElement('div'),
      currentTarget: document.body,
      nativeEvent: { target: document.body }
    } as any;
    act(() => {
      result.current.focusProps?.onFocus?.(evt);
    });
    expect(onFocus).not.toHaveBeenCalled();
    expect(onFocusChange).not.toHaveBeenCalled();
  });

  it('should not call onBlur if event.target !== event.currentTarget', () => {
    const { result } = renderHook(() => useFocus({ onBlur, onFocusChange }));
    const evt = {
      target: document.createElement('div'),
      currentTarget: document.body,
      nativeEvent: { target: document.body }
    } as any;
    act(() => {
      result.current.focusProps?.onBlur?.(evt);
    });
    expect(onBlur).not.toHaveBeenCalled();
    expect(onFocusChange).not.toHaveBeenCalled();
  });
});
