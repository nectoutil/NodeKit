// biome-ignore-all lint/suspicious/noExplicitAny: Explicity any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useHover } from '@necto-react/hooks';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

if (
  typeof window !== 'undefined' &&
  typeof window.PointerEvent === 'undefined'
) {
  window.PointerEvent = class PointerEvent {
    constructor(type: string, eventInitDict?: PointerEventInit) {}
  } as any;
}

describe('useHover', () => {
  it('should return isHovered as false initially without empty object', () => {
    const { result } = renderHook(() => useHover());
    expect(result.current.isHovered).toBe(false);
  });

  it('should return isHovered as false initially with empty object', () => {
    const { result } = renderHook(() => useHover({}));
    expect(result.current.isHovered).toBe(false);
  });

  it('should call onHoverStart and set isHovered to true on pointer enter', () => {
    const onHoverStart = vi.fn();
    const onHoverChange = vi.fn();
    const { result } = renderHook(() =>
      useHover({ onHoverStart, onHoverChange })
    );
    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onHoverStart).toHaveBeenCalled();
    expect(onHoverChange).toHaveBeenCalledWith(true);
    expect(result.current.isHovered).toBe(true);
  });

  it('should call onHoverEnd and set isHovered to false on pointer leave', () => {
    const onHoverEnd = vi.fn();
    const onHoverChange = vi.fn();
    const { result } = renderHook(() =>
      useHover({ onHoverEnd, onHoverChange })
    );
    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
      result.current.hoverProps.onPointerLeave?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onHoverEnd).toHaveBeenCalled();
    expect(onHoverChange).toHaveBeenCalledWith(false);
    expect(result.current.isHovered).toBe(false);
  });

  it('should not trigger hover events if isDisabled is true', () => {
    const onHoverStart = vi.fn();
    const onHoverEnd = vi.fn();
    const { result } = renderHook(() =>
      useHover({ isDisabled: true, onHoverStart, onHoverEnd })
    );
    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
      result.current.hoverProps.onPointerLeave?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onHoverStart).not.toHaveBeenCalled();
    expect(onHoverEnd).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(false);
  });

  it('should not trigger hover for pointerType "touch"', () => {
    const onHoverStart = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverStart }));
    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'touch',
        currentTarget: document.body,
        target: document.body
      } as any);
    });
    expect(onHoverStart).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(false);
  });
});
