/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useScrollLock } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('returns isLocked as false initially', () => {
    const { result } = renderHook(() => useScrollLock());
    expect(result.current.isLocked).toBe(false);
  });

  it('returns lock and unlock functions', () => {
    const { result } = renderHook(() => useScrollLock());
    expect(typeof result.current.lock).toBe('function');
    expect(typeof result.current.unlock).toBe('function');
  });

  it('sets isLocked to true when lock is called', () => {
    const { result } = renderHook(() => useScrollLock());
    act(() => { result.current.lock(); });
    expect(result.current.isLocked).toBe(true);
  });

  it('sets isLocked to false when unlock is called', () => {
    const { result } = renderHook(() => useScrollLock());
    act(() => { result.current.lock(); });
    act(() => { result.current.unlock(); });
    expect(result.current.isLocked).toBe(false);
  });

  it('sets overflow hidden on document.body when locked', () => {
    const { result } = renderHook(() => useScrollLock());
    act(() => { result.current.lock(); });
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores original overflow on document.body when unlocked', () => {
    document.body.style.overflow = 'auto';
    const { result } = renderHook(() => useScrollLock());
    act(() => { result.current.lock(); });
    act(() => { result.current.unlock(); });
    expect(document.body.style.overflow).toBe('auto');
  });

  it('auto-locks on mount when autoLock is true', () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: true }));
    act(() => {});
    expect(result.current.isLocked).toBe(true);
  });

  it('unlocks and restores body style on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock({ autoLock: true }));
    act(() => {});
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('targets a custom element by selector', () => {
    const div = document.createElement('div');
    div.id = 'scroll-target';
    document.body.appendChild(div);

    const { result } = renderHook(() => useScrollLock({ target: '#scroll-target' }));
    act(() => { result.current.lock(); });
    expect(div.style.overflow).toBe('hidden');

    document.body.removeChild(div);
  });
});
