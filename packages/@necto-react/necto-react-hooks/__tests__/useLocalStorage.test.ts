/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useLocalStorage } from '@necto-react/hooks';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the initial value when the key is unset', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('supports a lazy initializer', () => {
    const { result } = renderHook(() => useLocalStorage('missing', () => 'lazy'));

    expect(result.current[0]).toBe('lazy');
  });

  it('reads an existing stored value', () => {
    window.localStorage.setItem('user', JSON.stringify({ name: 'ada' }));

    const { result } = renderHook(() => useLocalStorage('user', { name: '' }));

    expect(result.current[0]).toEqual({ name: 'ada' });
  });

  it('passes an empty stored string to a custom deserializer', () => {
    window.localStorage.setItem('empty', '');
    const { result } = renderHook(() =>
      useLocalStorage('empty', 'fallback', { deserializer: (raw) => `[${raw}]` })
    );

    expect(result.current[0]).toBe('[]');
  });

  it('keeps the value and does not notify when removal fails', () => {
    window.localStorage.setItem('protected', '"stored"');
    const { result } = renderHook(() => useLocalStorage('protected', 'fallback'));
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const listener = vi.fn();
    window.addEventListener('necto:local-storage', listener);

    try {
      expect(() => act(() => result.current[2]())).not.toThrow();
      expect(result.current[0]).toBe('stored');
      expect(listener).not.toHaveBeenCalled();
      expect(warning).toHaveBeenCalledWith(expect.stringContaining('NT0203'));
    } finally {
      remove.mockRestore();
      warning.mockRestore();
      window.removeEventListener('necto:local-storage', listener);
    }
  });

  it('writes the value and persists it as JSON', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
    expect(window.localStorage.getItem('count')).toBe('5');
  });

  it('supports updater functions that build on each other', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem('count')).toBe('2');
  });

  it('removes the value and resets to the initial value', () => {
    window.localStorage.setItem('theme', JSON.stringify('dark'));

    const { result } = renderHook(() => useLocalStorage('theme', 'light'));

    expect(result.current[0]).toBe('dark');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('light');
    expect(window.localStorage.getItem('theme')).toBeNull();
  });

  it('honors a custom serializer and deserializer', () => {
    const { result } = renderHook(() =>
      useLocalStorage('when', new Date(0), {
        serializer: (value) => String(value.getTime()),
        deserializer: (raw) => new Date(Number(raw))
      })
    );

    act(() => {
      result.current[1](new Date(1000));
    });

    expect(window.localStorage.getItem('when')).toBe('1000');
    expect(result.current[0]).toBeInstanceOf(Date);
    expect(result.current[0].getTime()).toBe(1000);
  });

  it('reads the stored value after mount when initializeWithValue is false', () => {
    window.localStorage.setItem('deferred', JSON.stringify('stored'));

    const { result } = renderHook(() =>
      useLocalStorage('deferred', 'initial', { initializeWithValue: false })
    );

    expect(result.current[0]).toBe('stored');
  });

  it('syncs instances sharing a key within the same tab', () => {
    const { result: a } = renderHook(() => useLocalStorage('shared', 'x'));
    const { result: b } = renderHook(() => useLocalStorage('shared', 'x'));

    act(() => {
      a.current[1]('y');
    });

    expect(a.current[0]).toBe('y');
    expect(b.current[0]).toBe('y');
  });

  it('throws in development when the stored JSON is corrupt', () => {
    window.localStorage.setItem('broken', 'not-json{');

    expect(() => renderHook(() => useLocalStorage('broken', 'init'))).toThrow(/NT0201/);
  });
});
