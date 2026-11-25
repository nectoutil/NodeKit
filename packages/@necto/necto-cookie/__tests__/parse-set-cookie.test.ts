/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import { parseSetCookie, CookiePriority, CookieSameSite } from '../src/index';

describe('parseSetCookie', () => {
  it('parses a bare name=value', () => {
    expect(parseSetCookie('foo=bar')).toEqual({ name: 'foo', value: 'bar' });
  });

  it('returns undefined for empty, null or undefined input', () => {
    expect(parseSetCookie('')).toBeUndefined();
    expect(parseSetCookie(null)).toBeUndefined();
    expect(parseSetCookie(undefined)).toBeUndefined();
  });

  it('returns undefined when the first segment has no "="', () => {
    expect(parseSetCookie('foo')).toBeUndefined();
    expect(parseSetCookie('foo; Path=/')).toBeUndefined();
  });

  it('returns undefined for an empty name', () => {
    expect(parseSetCookie('=bar')).toBeUndefined();
    expect(parseSetCookie('  =bar; Path=/')).toBeUndefined();
  });

  it('parses every attribute', () => {
    const header =
      'session=abc; Path=/app; Domain=example.com; Expires=Wed, 21 Oct 2026 07:28:00 GMT; ' +
      'Max-Age=3600; HttpOnly; Secure; SameSite=Lax; Partitioned; Priority=High';

    expect(parseSetCookie(header)).toEqual({
      name: 'session',
      value: 'abc',
      path: '/app',
      domain: 'example.com',
      expires: new Date('Wed, 21 Oct 2026 07:28:00 GMT'),
      maxAge: 3600,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      partitioned: true,
      priority: 'high'
    });
  });

  it('treats attribute names case-insensitively', () => {
    expect(parseSetCookie('a=1; PATH=/; httponly; SECURE; samesite=STRICT; max-AGE=10')).toEqual({
      name: 'a',
      value: '1',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 10
    });
  });

  it('trims whitespace around names, values and attributes', () => {
    expect(parseSetCookie('  a  =  1  ;  Path = /x ;\tSecure\t')).toEqual({
      name: 'a',
      value: '1',
      path: '/x',
      secure: true
    });
  });

  it('keeps "=" inside the value', () => {
    expect(parseSetCookie('token=abc==; Path=/')).toEqual({
      name: 'token',
      value: 'abc==',
      path: '/'
    });
  });

  it('allows an empty value', () => {
    expect(parseSetCookie('a=; Max-Age=0')).toEqual({ name: 'a', value: '', maxAge: 0 });
  });

  it('strips surrounding double quotes from the value', () => {
    expect(parseSetCookie('a="hello world"')).toEqual({ name: 'a', value: 'hello world' });
  });

  it('percent-decodes the value but not the name', () => {
    expect(parseSetCookie('a%20b=a%40b.com')).toEqual({ name: 'a%20b', value: 'a@b.com' });
  });

  it('returns the raw value when percent-decoding fails', () => {
    expect(parseSetCookie('a=%E0%A4%A')).toEqual({ name: 'a', value: '%E0%A4%A' });
  });

  it('uses a custom decode function', () => {
    expect(parseSetCookie('a=1', { decode: (v) => `[${v}]` })).toEqual({ name: 'a', value: '[1]' });
  });

  it('parses negative and zero Max-Age', () => {
    expect(parseSetCookie('a=1; Max-Age=-1')?.maxAge).toBe(-1);
    expect(parseSetCookie('a=1; Max-Age=0')?.maxAge).toBe(0);
  });

  it('ignores an invalid Max-Age', () => {
    expect(parseSetCookie('a=1; Max-Age=1.5')).toEqual({ name: 'a', value: '1' });
    expect(parseSetCookie('a=1; Max-Age=abc')).toEqual({ name: 'a', value: '1' });
    expect(parseSetCookie('a=1; Max-Age=')).toEqual({ name: 'a', value: '1' });
  });

  it('ignores an invalid Expires', () => {
    expect(parseSetCookie('a=1; Expires=not-a-date')).toEqual({ name: 'a', value: '1' });
  });

  it('strips a leading dot from Domain and lowercases it', () => {
    expect(parseSetCookie('a=1; Domain=.Example.COM')?.domain).toBe('example.com');
  });

  it('ignores an empty Domain', () => {
    expect(parseSetCookie('a=1; Domain=')).toEqual({ name: 'a', value: '1' });
    expect(parseSetCookie('a=1; Domain=.')).toEqual({ name: 'a', value: '1' });
  });

  it('ignores a Path that does not start with "/"', () => {
    expect(parseSetCookie('a=1; Path=app')).toEqual({ name: 'a', value: '1' });
  });

  it('returns values that match the CookieSameSite and CookiePriority constants', () => {
    const cookie = parseSetCookie('a=1; SameSite=None; Priority=Medium');

    expect(cookie?.sameSite).toBe(CookieSameSite.None);
    expect(cookie?.priority).toBe(CookiePriority.Medium);
  });

  it('ignores unknown SameSite and Priority values', () => {
    expect(parseSetCookie('a=1; SameSite=maybe; Priority=urgent')).toEqual({
      name: 'a',
      value: '1'
    });
  });

  it('ignores unknown attributes', () => {
    expect(parseSetCookie('a=1; Foo=bar; Baz')).toEqual({ name: 'a', value: '1' });
  });

  it('lets the last occurrence of an attribute win', () => {
    expect(parseSetCookie('a=1; Path=/one; Path=/two')?.path).toBe('/two');
  });

  it('ignores empty segments and a trailing semicolon', () => {
    expect(parseSetCookie('a=1;; ;Secure;')).toEqual({ name: 'a', value: '1', secure: true });
  });

  it('only reads "=" inside the current attribute', () => {
    expect(parseSetCookie('a=1; Secure; Path=/')).toEqual({
      name: 'a',
      value: '1',
      secure: true,
      path: '/'
    });
  });
});
