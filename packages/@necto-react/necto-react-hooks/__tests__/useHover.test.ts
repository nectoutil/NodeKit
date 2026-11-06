/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useHover } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  window.PointerEvent = class PointerEvent {
    constructor(type: string, eventInitDict?: PointerEventInit) {}
  } as any;
}

describe('useHover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
    const { result } = renderHook(() => useHover({ onHoverStart, onHoverChange }));
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
    const { result } = renderHook(() => useHover({ onHoverEnd, onHoverChange }));
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
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onHoverEnd).toHaveBeenCalled();
    expect(onHoverChange).toHaveBeenCalledWith(false);
    expect(result.current.isHovered).toBe(false);
  });

  it('should not trigger hover events if isDisabled is true', () => {
    const onHoverStart = vi.fn();
    const onHoverEnd = vi.fn();
    const { result } = renderHook(() => useHover({ isDisabled: true, onHoverStart, onHoverEnd }));

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

  it('should wait for openDelay before starting hover', () => {
    const onHoverStart = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverStart, openDelay: 100 }));

    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: document.body,
        target: document.body
      } as any);
      vi.advanceTimersByTime(99);
    });

    expect(onHoverStart).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onHoverStart).toHaveBeenCalledTimes(1);
    expect(result.current.isHovered).toBe(true);
  });

  it('should cancel a delayed hover start when the pointer leaves early', () => {
    const onHoverStart = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverStart, openDelay: 100 }));

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
      vi.advanceTimersByTime(100);
    });

    expect(onHoverStart).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(false);
  });

  it('should wait for closeDelay before ending hover', () => {
    const onHoverEnd = vi.fn();
    const { result } = renderHook(() => useHover({ onHoverEnd, closeDelay: 100 }));

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

    expect(onHoverEnd).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(true);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onHoverEnd).toHaveBeenCalledTimes(1);
    expect(result.current.isHovered).toBe(false);
  });

  it('should remain hovered while another target is still hovered', () => {
    const onHoverEnd = vi.fn();
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');
    const { result } = renderHook(() => useHover({ onHoverEnd }));

    act(() => {
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: firstTarget,
        target: firstTarget
      } as any);
      result.current.hoverProps.onPointerEnter?.({
        pointerType: 'mouse',
        currentTarget: secondTarget,
        target: secondTarget
      } as any);
      result.current.hoverProps.onPointerLeave?.({
        pointerType: 'mouse',
        currentTarget: firstTarget,
        target: firstTarget
      } as any);
      vi.advanceTimersByTime(0);
    });

    expect(onHoverEnd).not.toHaveBeenCalled();
    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onPointerLeave?.({
        pointerType: 'mouse',
        currentTarget: secondTarget,
        target: secondTarget
      } as any);
      vi.advanceTimersByTime(0);
    });

    expect(onHoverEnd).toHaveBeenCalledTimes(1);
    expect(result.current.isHovered).toBe(false);
  });
});
