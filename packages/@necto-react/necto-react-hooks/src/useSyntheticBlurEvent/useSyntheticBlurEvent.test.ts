// biome-ignore-all lint/suspicious/noExplicitAny: Explicity any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { vi, describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyntheticBlurEvent } from './useSyntheticBlurEvent';

describe('useSyntheticBlurEvent', () => {
  it('should call onBlur when a blur event occurs on a supported element', () => {
    const onBlur = vi.fn();
    const { result } = renderHook(() => useSyntheticBlurEvent({ onBlur: onBlur }));

    // Create a mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);

    // Simulate focus event
    act(() => {
      result.current({
        target: input,
        currentTarget: input,
        nativeEvent: new FocusEvent('focus'),
      } as any);
    });

    // Simulate blur event
    act(() => {
      const blurEvent = new FocusEvent('focusout', { bubbles: true });
      input.dispatchEvent(blurEvent);
    });

    expect(onBlur).not.toHaveBeenCalled(); // Not called unless disabled

    // Now disable the input and trigger MutationObserver
    act(() => {
      input.disabled = true;
      // MutationObserver callback is synchronous in JSDOM
      const blurEvent = new FocusEvent('focusout', { bubbles: true });
      input.dispatchEvent(blurEvent);
    });

    expect(onBlur).toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('does not call onBlur for unsupported elements', () => {
    const onBlur = vi.fn();
    const { result } = renderHook(() => useSyntheticBlurEvent({ onBlur: onBlur }));

    // Create a div (not a supported element)
    const div = document.createElement('div');
    document.body.appendChild(div);

    act(() => {
      result.current({
        target: div,
        currentTarget: div,
        nativeEvent: new FocusEvent('focus'),
      } as any);
    });

    act(() => {
      const blurEvent = new FocusEvent('focusout', { bubbles: true });
      div.dispatchEvent(blurEvent);
    });

    expect(onBlur).not.toHaveBeenCalled();
    document.body.removeChild(div);
  });
});
