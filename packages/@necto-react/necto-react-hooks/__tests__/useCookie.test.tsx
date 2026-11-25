/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCookie } from '@necto-react/hooks';
import { renderToString } from 'react-dom/server';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { cookies, CookieClient } from '@necto/cookie/browser';

function clearCookies(): void {
  for (const name of Object.keys(cookies.getAll())) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
  }
}

describe('useCookie', () => {
  afterEach(() => {
    clearCookies();
  });

  it('should return undefined when the cookie is not set', () => {
    const { result } = renderHook(() => useCookie('theme'));

    expect(result.current[0]).toBeUndefined();
  });

  it('should return the default value when the cookie is not set', () => {
    const { result } = renderHook(() => useCookie('theme', { defaultValue: 'light' }));

    expect(result.current[0]).toBe('light');
  });

  it('should read an existing cookie', () => {
    cookies.set('theme', 'dark', { path: '/' });

    const { result } = renderHook(() => useCookie('theme'));

    expect(result.current[0]).toBe('dark');
  });

  it('should set the cookie and re-render', () => {
    const { result } = renderHook(() => useCookie('theme', { attributes: { path: '/' } }));

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');
    expect(cookies.get('theme')).toBe('dark');
  });

  it('should support updater functions that build on each other', () => {
    const { result } = renderHook(() =>
      useCookie('count', {
        defaultValue: 0,
        parse: Number,
        attributes: { path: '/' }
      })
    );

    act(() => {
      result.current[1]((prev) => (prev ?? 0) + 1);
      result.current[1]((prev) => (prev ?? 0) + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(cookies.get('count')).toBe('2');
  });

  it('should remove the cookie', () => {
    cookies.set('theme', 'dark', { path: '/' });

    const { result } = renderHook(() =>
      useCookie('theme', { defaultValue: 'light', attributes: { path: '/' } })
    );

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('light');
    expect(cookies.get('theme')).toBeUndefined();
  });

  it('should parse and serialize typed values', () => {
    const { result } = renderHook(() =>
      useCookie('count', {
        defaultValue: 0,
        parse: Number,
        serialize: String,
        attributes: { path: '/' }
      })
    );

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(cookies.get('count')).toBe('42');
  });

  it('should keep the parsed object reference until the cookie changes', () => {
    cookies.set('prefs', JSON.stringify({ a: 1 }), { path: '/' });

    const { result, rerender } = renderHook(() =>
      useCookie<{ a: number }>('prefs', {
        parse: JSON.parse,
        serialize: JSON.stringify,
        attributes: { path: '/' }
      })
    );

    const first = result.current[0];
    rerender();

    expect(result.current[0]).toBe(first);

    act(() => {
      result.current[1]({ a: 2 });
    });

    expect(result.current[0]).toEqual({ a: 2 });
    expect(result.current[0]).not.toBe(first);
  });

  it('should fall back to the default value when parsing fails', () => {
    cookies.set('prefs', 'not-json', { path: '/' });

    const { result } = renderHook(() =>
      useCookie('prefs', { defaultValue: { a: 0 }, parse: JSON.parse })
    );

    expect(result.current[0]).toEqual({ a: 0 });
  });

  it('should keep setter and remover identities across renders', () => {
    const { result, rerender } = renderHook(() =>
      useCookie('theme', { attributes: { path: '/' } })
    );

    const [, set, remove] = result.current;
    rerender();

    expect(result.current[1]).toBe(set);
    expect(result.current[2]).toBe(remove);
  });

  it('should sync every hook using the same cookie', () => {
    const first = renderHook(() => useCookie('theme', { attributes: { path: '/' } }));
    const second = renderHook(() => useCookie('theme'));

    act(() => {
      first.result.current[1]('dark');
    });

    expect(second.result.current[0]).toBe('dark');
  });

  it('should update when the cookie is changed through the client', () => {
    const { result } = renderHook(() => useCookie('theme'));

    act(() => {
      cookies.set('theme', 'dark', { path: '/' });
    });

    expect(result.current[0]).toBe('dark');
  });

  it('should not update for other cookie names', () => {
    let renders = 0;

    renderHook(() => {
      renders++;
      return useCookie('theme');
    });

    const before = renders;

    act(() => {
      cookies.set('other', '1', { path: '/' });
    });

    expect(renders).toBe(before);
  });

  it('should use a custom client', () => {
    const client = new CookieClient({ attributes: { path: '/' } });

    const { result } = renderHook(() => useCookie('theme', { client }));

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');

    act(() => {
      result.current[2]();
    });

    expect(cookies.get('theme')).toBeUndefined();
  });

  it('should let per-call attributes override hook attributes', () => {
    const { result } = renderHook(() => useCookie('theme', { attributes: { path: '/nowhere' } }));

    act(() => {
      result.current[1]('dark', { path: '/' });
    });

    expect(cookies.get('theme')).toBe('dark');
  });

  it('should throw when setting an HttpOnly cookie', () => {
    const { result } = renderHook(() => useCookie('theme'));

    expect(() => result.current[1]('dark', { httpOnly: true })).toThrow(TypeError);
  });

  it('should render the server value during SSR', () => {
    function Theme() {
      const [theme] = useCookie('theme', { serverValue: 'from-server', defaultValue: 'light' });
      return <span>{theme}</span>;
    }

    expect(renderToString(<Theme />)).toContain('from-server');
  });

  it('should render the default value during SSR without a server value', () => {
    function Theme() {
      const [theme] = useCookie('theme', { defaultValue: 'light' });
      return <span>{theme}</span>;
    }

    expect(renderToString(<Theme />)).toContain('light');
  });

  describe('object API', () => {
    it('should expose value, set and remove on the result', () => {
      const { result } = renderHook(() =>
        useCookie('theme', { defaultValue: 'light', attributes: { path: '/' } })
      );

      expect(result.current.value).toBe('light');

      act(() => {
        result.current.set('dark');
      });

      expect(result.current.value).toBe('dark');
      expect(result.current[0]).toBe('dark');

      act(() => {
        result.current.remove();
      });

      expect(result.current.value).toBe('light');
      expect(cookies.get('theme')).toBeUndefined();
    });

    it('should update via a function of the current value', () => {
      const { result } = renderHook(() =>
        useCookie('count', { defaultValue: 0, parse: Number, attributes: { path: '/' } })
      );

      act(() => {
        result.current.update((prev) => prev + 1);
        result.current.update((prev) => prev + 1);
      });

      expect(result.current.value).toBe(2);
    });

    it('should share the same functions between the tuple and the object', () => {
      const { result } = renderHook(() => useCookie('theme'));

      expect(result.current.set).toBe(result.current[1]);
      expect(result.current.remove).toBe(result.current[2]);
    });

    it('should keep the result identity when nothing changed', () => {
      const { result, rerender } = renderHook(() =>
        useCookie('theme', { attributes: { path: '/' } })
      );

      const first = result.current;
      rerender();

      expect(result.current).toBe(first);
    });
  });
});
