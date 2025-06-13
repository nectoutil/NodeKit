// biome-ignore-all lint/suspicious/noExplicitAny: Explicity any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { describe, it, expect, vi } from 'vitest';
import { usePress } from '@necto-react-hooks/usePress';
import { renderHook, act } from '@testing-library/react';

describe('usePress', () => {
  it('should return isPressed as false initially without empty object', () => {
    const { result } = renderHook(() => usePress());
    expect(result.current.isPressed).toBe(false);
  });

  it('should return isPressed as false initially with empty object', () => {
    const { result } = renderHook(() => usePress({}));
    expect(result.current.isPressed).toBe(false);
  });

  it('should call onPressStart and set isPressed to true on mouse down', () => {
    const onPressStart = vi.fn();
    const { result } = renderHook(() => usePress({ onPressStart }));
    act(() => {
      result.current.pressProps.onMouseDown?.({
        button: 0,
        currentTarget: document.body,
        preventDefault: () => {}
      } as any);
    });
    expect(onPressStart).toHaveBeenCalled();
    expect(result.current.isPressed).toBe(true);
  });

  it('should not trigger press events if isDisabled is true', () => {
    const onPressStart = vi.fn();
    const onPressEnd = vi.fn();
    const { result } = renderHook(() =>
      usePress({ isDisabled: true, onPressStart, onPressEnd })
    );
    act(() => {
      result.current.pressProps.onMouseDown?.({
        button: 0,
        currentTarget: document.body,
        preventDefault: () => {}
      } as any);
      result.current.pressProps.onMouseUp?.({
        button: 0,
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onPressStart).not.toHaveBeenCalled();
    expect(onPressEnd).not.toHaveBeenCalled();
    expect(result.current.isPressed).toBe(false);
  });

  it('should call onPress when mouse up occurs over the target', () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => usePress({ onPress }));
    act(() => {
      result.current.pressProps.onMouseDown?.({
        button: 0,
        currentTarget: document.body,
        preventDefault: () => {}
      } as any);
      result.current.pressProps.onMouseUp?.({
        button: 0,
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onPress).toHaveBeenCalled();
  });

  it('should call onClick if not disabled', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() => usePress({ onClick }));
    act(() => {
      result.current.pressProps.onClick?.({ preventDefault: () => {} } as any);
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('should prevent onClick if disabled', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() =>
      usePress({ isDisabled: true, onClick })
    );
    const preventDefault = vi.fn();
    act(() => {
      result.current.pressProps.onClick?.({ preventDefault } as any);
    });
    expect(onClick).not.toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });
});
