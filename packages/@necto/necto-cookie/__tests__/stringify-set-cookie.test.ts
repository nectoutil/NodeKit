/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import { stringifySetCookie, parseSetCookie, CookieSameSite, CookiePriority } from '../src/index';

import type { SetCookie } from '../src/index';

describe('stringifySetCookie', () => {
  it('stringifies a bare name=value', () => {
    expect(stringifySetCookie({ name: 'foo', value: 'bar' })).toBe('foo=bar');
  });

  it('stringifies every attribute in a fixed order', () => {
    const expires = new Date('2026-10-21T07:28:00Z');

    expect(
      stringifySetCookie({
        name: 'session',
        value: 'abc',
        path: '/',
        domain: 'example.com',
        expires,
        maxAge: 3600,
        httpOnly: true,
        secure: true,
        sameSite: CookieSameSite.Lax,
        partitioned: true,
        priority: CookiePriority.High
      })
    ).toBe(
      'session=abc; Max-Age=3600; Domain=example.com; Path=/; Expires=Wed, 21 Oct 2026 07:28:00 GMT; ' +
        'HttpOnly; Secure; Partitioned; Priority=High; SameSite=Lax'
    );
  });

  it('percent-encodes the value by default', () => {
    expect(stringifySetCookie({ name: 'a', value: 'hello world; x' })).toBe(
      'a=hello%20world%3B%20x'
    );
  });

  it('uses a custom encode function', () => {
    expect(stringifySetCookie({ name: 'a', value: 'x' }, { encode: (v) => v.toUpperCase() })).toBe(
      'a=X'
    );
  });

  it('maps sameSite true to Strict and omits false', () => {
    expect(stringifySetCookie({ name: 'a', value: '1', sameSite: true })).toBe(
      'a=1; SameSite=Strict'
    );
    expect(stringifySetCookie({ name: 'a', value: '1', sameSite: false })).toBe('a=1');
  });

  it('omits false boolean attributes', () => {
    expect(stringifySetCookie({ name: 'a', value: '1', httpOnly: false, secure: false })).toBe(
      'a=1'
    );
  });

  it('allows Max-Age=0 and negative values', () => {
    expect(stringifySetCookie({ name: 'a', value: '', maxAge: 0 })).toBe('a=; Max-Age=0');
    expect(stringifySetCookie({ name: 'a', value: '', maxAge: -1 })).toBe('a=; Max-Age=-1');
  });

  it('round-trips through parseSetCookie', () => {
    const cookie: SetCookie = {
      name: 'a',
      value: 'x y',
      path: '/p',
      domain: 'example.com',
      maxAge: 10,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      priority: 'low'
    };

    expect(parseSetCookie(stringifySetCookie(cookie))).toEqual(cookie);
  });

  describe('validation', () => {
    it('rejects invalid names', () => {
      expect(() => stringifySetCookie({ name: '', value: '1' })).toThrow(TypeError);
      expect(() => stringifySetCookie({ name: 'a b', value: '1' })).toThrow(TypeError);
      expect(() => stringifySetCookie({ name: 'a;b', value: '1' })).toThrow(TypeError);
      expect(() => stringifySetCookie({ name: 'a=b', value: '1' })).toThrow(TypeError);
    });

    it('rejects an encoded value with invalid characters', () => {
      expect(() => stringifySetCookie({ name: 'a', value: 'x;y' }, { encode: (v) => v })).toThrow(
        TypeError
      );
    });

    it('rejects cookies over 4096 bytes', () => {
      expect(() => stringifySetCookie({ name: 'a', value: 'x'.repeat(4095) })).toThrow(TypeError);
      expect(() => stringifySetCookie({ name: 'a', value: 'x'.repeat(4094) })).not.toThrow();
    });

    it('rejects a non-integer Max-Age', () => {
      expect(() => stringifySetCookie({ name: 'a', value: '1', maxAge: 1.5 })).toThrow(TypeError);
      expect(() => stringifySetCookie({ name: 'a', value: '1', maxAge: Number.NaN })).toThrow(
        TypeError
      );
    });

    it('rejects an invalid Domain', () => {
      expect(() => stringifySetCookie({ name: 'a', value: '1', domain: 'exa mple.com' })).toThrow(
        TypeError
      );
      expect(() =>
        stringifySetCookie({ name: 'a', value: '1', domain: '.example.com' })
      ).not.toThrow();
    });

    it('rejects an invalid Path', () => {
      expect(() => stringifySetCookie({ name: 'a', value: '1', path: '/a;b' })).toThrow(TypeError);
    });

    it('rejects an invalid Expires', () => {
      expect(() =>
        stringifySetCookie({ name: 'a', value: '1', expires: new Date('nope') })
      ).toThrow(TypeError);
    });

    it('requires Secure for SameSite=None', () => {
      expect(() => stringifySetCookie({ name: 'a', value: '1', sameSite: 'none' })).toThrow(
        TypeError
      );
      expect(() =>
        stringifySetCookie({ name: 'a', value: '1', sameSite: 'none', secure: true })
      ).not.toThrow();
    });

    it('requires Secure for Partitioned', () => {
      expect(() => stringifySetCookie({ name: 'a', value: '1', partitioned: true })).toThrow(
        TypeError
      );
    });

    it('enforces the __Secure- prefix rules', () => {
      expect(() => stringifySetCookie({ name: '__Secure-a', value: '1' })).toThrow(TypeError);
      expect(() =>
        stringifySetCookie({ name: '__Secure-a', value: '1', secure: true })
      ).not.toThrow();
    });

    it('enforces the __Host- prefix rules', () => {
      const base = { name: '__Host-a', value: '1', secure: true, path: '/' };

      expect(() => stringifySetCookie(base)).not.toThrow();
      expect(() => stringifySetCookie({ ...base, secure: false })).toThrow(TypeError);
      expect(() => stringifySetCookie({ ...base, path: '/app' })).toThrow(TypeError);
      expect(() => stringifySetCookie({ ...base, domain: 'example.com' })).toThrow(TypeError);
    });
  });
});
