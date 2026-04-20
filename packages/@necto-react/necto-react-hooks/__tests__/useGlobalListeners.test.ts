/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGlobalListeners } from '@necto-react/hooks';

describe('useGlobalListeners', () => {
  it('returns addGlobalListener, removeGlobalListener, and removeAllGlobalListeners', () => {
    const { result } = renderHook(() => useGlobalListeners());
    expect(typeof result.current.addGlobalListener).toBe('function');
    expect(typeof result.current.removeGlobalListener).toBe('function');
    expect(typeof result.current.removeAllGlobalListeners).toBe('function');
  });

  it('fires the listener when the event is dispatched', () => {
    const { result } = renderHook(() => useGlobalListeners());
    const listener = vi.fn();
    const div = document.createElement('div');

    act(() => { result.current.addGlobalListener(div, 'click', listener); });
    div.dispatchEvent(new Event('click'));

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('removes a specific listener', () => {
    const { result } = renderHook(() => useGlobalListeners());
    const listener = vi.fn();
    const div = document.createElement('div');

    act(() => {
      result.current.addGlobalListener(div, 'click', listener);
      result.current.removeGlobalListener(div, 'click', listener);
    });
    div.dispatchEvent(new Event('click'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('removes all listeners at once', () => {
    const { result } = renderHook(() => useGlobalListeners());
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const div = document.createElement('div');

    act(() => {
      result.current.addGlobalListener(div, 'click', listener1);
      result.current.addGlobalListener(div, 'mousemove', listener2);
      result.current.removeAllGlobalListeners();
    });
    div.dispatchEvent(new Event('click'));
    div.dispatchEvent(new Event('mousemove'));

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('cleans up all listeners on unmount', () => {
    const { result, unmount } = renderHook(() => useGlobalListeners());
    const listener = vi.fn();
    const div = document.createElement('div');

    act(() => { result.current.addGlobalListener(div, 'click', listener); });
    unmount();
    div.dispatchEvent(new Event('click'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('can add multiple listeners to the same target', () => {
    const { result } = renderHook(() => useGlobalListeners());
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const div = document.createElement('div');

    act(() => {
      result.current.addGlobalListener(div, 'click', listener1);
      result.current.addGlobalListener(div, 'click', listener2);
    });
    div.dispatchEvent(new Event('click'));

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});
