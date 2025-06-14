// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { vi, describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyntheticBlurEvent } from '@necto-react/hooks';

describe('useSyntheticBlurEvent', () => {
  it('should call onBlur when a blur event occurs on a supported element', async () => {
    const onBlur = vi.fn();
    const { result } = renderHook(() => useSyntheticBlurEvent({ onBlur }));

    const input = document.createElement('input');
    document.body.appendChild(input);

    act(() => {
      result.current({
        target: input,
        currentTarget: input,
        nativeEvent: new FocusEvent('focus')
      } as any);
    });

    expect(onBlur).not.toHaveBeenCalled();

    act(() => {
      input.disabled = true;
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onBlur).toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('does not call onBlur for unsupported elements', () => {
    const onBlur = vi.fn();
    const { result } = renderHook(() => useSyntheticBlurEvent({ onBlur }));

    const div = document.createElement('div');
    document.body.appendChild(div);

    act(() => {
      result.current({
        target: div,
        currentTarget: div,
        nativeEvent: new FocusEvent('focus')
      } as any);
    });

    act(() => {
      const blurEvent = new FocusEvent('blur', { bubbles: true });
      div.dispatchEvent(blurEvent);
    });

    expect(onBlur).not.toHaveBeenCalled();
    document.body.removeChild(div);
  });
});
