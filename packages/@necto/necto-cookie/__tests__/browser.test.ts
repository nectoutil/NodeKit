/**
 * @vitest-environment jsdom
 */

/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

import { cookies, CookieClient } from '../src/browser';

function clearCookies(): void {
  for (const name of Object.keys(cookies.getAll())) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
  }
}

afterEach(() => {
  clearCookies();
  vi.unstubAllGlobals();
});

describe('cookies (default client)', () => {
  it('sets and gets a cookie', () => {
    cookies.set('theme', 'dark', { path: '/' });

    expect(cookies.get('theme')).toBe('dark');
    expect(document.cookie).toContain('theme=dark');
  });

  it('returns undefined for a missing cookie', () => {
    expect(cookies.get('missing')).toBeUndefined();
  });

  it('encodes and decodes values', () => {
    cookies.set('email', 'a@b.com; x', { path: '/' });

    expect(document.cookie).toContain('email=a%40b.com%3B%20x');
    expect(cookies.get('email')).toBe('a@b.com; x');
  });

  it('reports whether a cookie exists', () => {
    cookies.set('a', '1', { path: '/' });

    expect(cookies.has('a')).toBe(true);
    expect(cookies.has('b')).toBe(false);
  });

  it('returns every cookie from getAll', () => {
    cookies.set('a', '1', { path: '/' });
    cookies.set('b', '2', { path: '/' });

    expect(cookies.getAll()).toEqual({ a: '1', b: '2' });
  });

  it('deletes a cookie', () => {
    cookies.set('a', '1', { path: '/' });
    cookies.delete('a', { path: '/' });

    expect(cookies.get('a')).toBeUndefined();
  });

  it('throws when setting an HttpOnly cookie', () => {
    expect(() => cookies.set('a', '1', { httpOnly: true })).toThrow(TypeError);
  });

  it('throws for invalid cookies', () => {
    expect(() => cookies.set('bad name', '1')).toThrow(TypeError);
  });
});

describe('CookieClient', () => {
  it('applies default attributes to set and delete', () => {
    const client = new CookieClient({ attributes: { path: '/' } });
    const spy = vi.spyOn(document, 'cookie', 'set');

    client.set('a', '1');
    client.delete('a');

    expect(spy).toHaveBeenNthCalledWith(1, 'a=1; Path=/');
    expect(spy).toHaveBeenNthCalledWith(2, 'a=; Max-Age=0; Path=/');

    spy.mockRestore();
  });

  it('lets per-call attributes override defaults', () => {
    const client = new CookieClient({ attributes: { path: '/', maxAge: 60 } });
    const spy = vi.spyOn(document, 'cookie', 'set');

    client.set('a', '1', { maxAge: 10 });

    expect(spy).toHaveBeenCalledWith('a=1; Max-Age=10; Path=/');

    spy.mockRestore();
  });

  it('creates a new client with merged attributes from withAttributes', () => {
    const base = new CookieClient({ attributes: { path: '/' } });
    const scoped = base.withAttributes({ maxAge: 5 });
    const spy = vi.spyOn(document, 'cookie', 'set');

    scoped.set('a', '1');
    base.set('b', '2');

    expect(spy).toHaveBeenNthCalledWith(1, 'a=1; Max-Age=5; Path=/');
    expect(spy).toHaveBeenNthCalledWith(2, 'b=2; Path=/');

    spy.mockRestore();
  });

  it('uses custom encode and decode', () => {
    const client = new CookieClient({
      attributes: { path: '/' },
      encode: (v) => btoa(v),
      decode: (v) => atob(v)
    });

    client.set('a', 'hello');

    expect(document.cookie).toContain(`a=${btoa('hello')}`);
    expect(client.get('a')).toBe('hello');
  });
});

describe('subscribe', () => {
  it('notifies on set and delete in the same tab', () => {
    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    cookies.set('theme', 'dark', { path: '/' });
    cookies.delete('theme', { path: '/' });

    expect(listener).toHaveBeenNthCalledWith(1, 'dark');
    expect(listener).toHaveBeenNthCalledWith(2, undefined);

    unsubscribe();
  });

  it('notifies subscribers of a different client', () => {
    const listener = vi.fn();
    const unsubscribe = new CookieClient().subscribe('theme', listener);

    new CookieClient({ attributes: { path: '/' } }).set('theme', 'dark');

    expect(listener).toHaveBeenCalledWith('dark');

    unsubscribe();
  });

  it('does not notify when the value is unchanged', () => {
    cookies.set('theme', 'dark', { path: '/' });

    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    cookies.set('theme', 'dark', { path: '/' });

    expect(listener).not.toHaveBeenCalled();

    unsubscribe();
  });

  it('does not notify for other cookie names', () => {
    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    cookies.set('other', '1', { path: '/' });

    expect(listener).not.toHaveBeenCalled();

    unsubscribe();
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    unsubscribe();
    cookies.set('theme', 'dark', { path: '/' });

    expect(listener).not.toHaveBeenCalled();
  });

  it('picks up changes broadcast from another tab', async () => {
    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    // Simulate another tab: it writes the cookie and broadcasts the name.
    document.cookie = 'theme=blue; Path=/';
    const otherTab = new BroadcastChannel('necto-cookie');
    otherTab.postMessage('theme');

    await vi.waitFor(() => expect(listener).toHaveBeenCalledWith('blue'));

    otherTab.close();
    unsubscribe();
  });

  it('re-checks cookies when the window regains focus', () => {
    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    document.cookie = 'theme=green; Path=/';
    window.dispatchEvent(new Event('focus'));

    expect(listener).toHaveBeenCalledWith('green');

    unsubscribe();
  });

  it('uses the Cookie Store API when available', () => {
    const store = new EventTarget();
    vi.stubGlobal('cookieStore', store);

    const listener = vi.fn();
    const unsubscribe = cookies.subscribe('theme', listener);

    document.cookie = 'theme=red; Path=/';
    store.dispatchEvent(
      Object.assign(new Event('change'), { changed: [{ name: 'theme' }], deleted: [] })
    );

    expect(listener).toHaveBeenCalledWith('red');

    unsubscribe();
  });
});

describe('CookieClient methods', () => {
  it('keep working when destructured', () => {
    const { set, get } = new CookieClient({ attributes: { path: '/' } });

    set('a', '1');

    expect(get('a')).toBe('1');
  });
});
