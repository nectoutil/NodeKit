/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFocusRing } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@necto-react/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useFocus: vi.fn(),
  };
});
const { useFocus } = require('@necto-react/hooks');

describe('useFocusRing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    let onFocusChange: (focused: boolean) => void = () => {};
    (useFocus).mockImplementation(
      ({
        onFocusChange: handler
      }: {
        onFocusChange: (focused: boolean) => void;
      }) => {
        onFocusChange = handler;
        return { focusProps: {} };
      }
    );

    const { result } = renderHook(() => useFocusRing());

    act(() => {
      onFocusChange(true);
    });
    expect(result.current.isFocused).toBe(true);

    act(() => {
      onFocusChange(false);
    });
    expect(result.current.isFocused).toBe(false);
  });

  it('should update isFocusVisible when useFocusVisibleListener is triggered', () => {
    const { useFocusVisibleListener } = require('../useFocusVisibleListener');
    let focusVisibleListener: (focusVisible: boolean) => void = () => {};
    (useFocusVisibleListener).mockImplementation(
      (listener: (focusVisible: boolean) => void) => {
        focusVisibleListener = listener;
      }
    );

    const { result } = renderHook(() => useFocusRing());

    act(() => {
      focusVisibleListener(true);
    });
    expect(result.current.isFocusVisible).toBe(false);

    const { useFocus } = require('../useFocus');
    let onFocusChange: (focused: boolean) => void = () => {};
    (useFocus).mockImplementation(
      ({
        onFocusChange: handler
      }: {
        onFocusChange: (focused: boolean) => void;
      }) => {
        onFocusChange = handler;
        return { focusProps: {} };
      }
    );

    act(() => {
      onFocusChange(true);
      focusVisibleListener(true);
    });
    expect(result.current.isFocusVisible).toBe(true);

    act(() => {
      focusVisibleListener(false);
    });
    expect(result.current.isFocusVisible).toBe(false);
  });
});
