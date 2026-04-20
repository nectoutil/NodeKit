/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for tests.

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFocusWithin } from '@necto-react/hooks';

function makeEl() {
  const el = document.createElement('button');
  document.body.appendChild(el);
  el.focus();
  return el;
}

function makeFocusEvent(currentTarget: Element, target: Element, relatedTarget: Element | null = null) {
  return { currentTarget, target, relatedTarget, nativeEvent: { target } } as any;
}

describe('useFocusWithin', () => {
  it('returns focusWithinProps', () => {
    const { result } = renderHook(() => useFocusWithin({}));
    expect(result.current).toHaveProperty('focusWithinProps');
  });

  it('returns undefined onFocus and onBlur when isDisabled is true', () => {
    const { result } = renderHook(() => useFocusWithin({ isDisabled: true }));
    expect(result.current.focusWithinProps.onFocus).toBeUndefined();
    expect(result.current.focusWithinProps.onBlur).toBeUndefined();
  });

  it('provides onFocus and onBlur handlers when enabled', () => {
    const { result } = renderHook(() => useFocusWithin({}));
    expect(typeof result.current.focusWithinProps.onFocus).toBe('function');
    expect(typeof result.current.focusWithinProps.onBlur).toBe('function');
  });

  it('calls onFocusWithin when focus enters', () => {
    const onFocusWithin = vi.fn();
    const { result } = renderHook(() => useFocusWithin({ onFocusWithin }));
    const el = makeEl();

    act(() => { result.current.focusWithinProps.onFocus?.(makeFocusEvent(el, el)); });

    expect(onFocusWithin).toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('calls onFocusWithinChange(true) when focus enters', () => {
    const onFocusWithinChange = vi.fn();
    const { result } = renderHook(() => useFocusWithin({ onFocusWithinChange }));
    const el = makeEl();

    act(() => { result.current.focusWithinProps.onFocus?.(makeFocusEvent(el, el)); });

    expect(onFocusWithinChange).toHaveBeenCalledWith(true);
    document.body.removeChild(el);
  });

  it('calls onFocusWithinChange(false) when focus leaves', () => {
    const onFocusWithinChange = vi.fn();
    const { result } = renderHook(() => useFocusWithin({ onFocusWithinChange }));
    const el = makeEl();

    act(() => { result.current.focusWithinProps.onFocus?.(makeFocusEvent(el, el)); });
    act(() => { result.current.focusWithinProps.onBlur?.(makeFocusEvent(el, el, null)); });

    expect(onFocusWithinChange).toHaveBeenCalledWith(false);
    document.body.removeChild(el);
  });

  it('calls onBlurWithin when focus leaves', () => {
    const onBlurWithin = vi.fn();
    const { result } = renderHook(() => useFocusWithin({ onBlurWithin }));
    const el = makeEl();

    act(() => { result.current.focusWithinProps.onFocus?.(makeFocusEvent(el, el)); });
    act(() => { result.current.focusWithinProps.onBlur?.(makeFocusEvent(el, el, null)); });

    expect(onBlurWithin).toHaveBeenCalled();
    document.body.removeChild(el);
  });
});
