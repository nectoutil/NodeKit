/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import { parseCookie } from '../src/index';

describe('parseCookie', () => {
  it('parses a single cookie', () => {
    expect(parseCookie('foo=bar')).toEqual({ foo: 'bar' });
  });

  it('parses multiple cookies', () => {
    expect(parseCookie('foo=bar; baz=qux; n=1')).toEqual({ foo: 'bar', baz: 'qux', n: '1' });
  });

  it('returns an empty object for empty, null or undefined input', () => {
    expect(parseCookie('')).toEqual({});
    expect(parseCookie(null)).toEqual({});
    expect(parseCookie(undefined)).toEqual({});
  });

  it('returns an object with a null prototype', () => {
    expect(Object.getPrototypeOf(parseCookie('a=1'))).toBeNull();
  });

  it('handles __proto__ safely', () => {
    const result = parseCookie('__proto__=evil; a=1');

    expect(result.__proto__).toBe('evil');
    expect(({} as Record<string, unknown>).evil).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBeNull();
  });

  it('trims spaces and tabs around names and values', () => {
    expect(parseCookie('  foo  =  bar  ;\tbaz\t=\tqux\t')).toEqual({ foo: 'bar', baz: 'qux' });
  });

  it('works without a space after the semicolon', () => {
    expect(parseCookie('a=1;b=2;c=3')).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('keeps the first value when a name is duplicated', () => {
    expect(parseCookie('a=first; a=second')).toEqual({ a: 'first' });
  });

  it('allows empty values', () => {
    expect(parseCookie('a=; b=2')).toEqual({ a: '', b: '2' });
  });

  it('skips empty names', () => {
    expect(parseCookie('=bar; a=1')).toEqual({ a: '1' });
  });

  it('skips segments without "="', () => {
    expect(parseCookie('flag; a=1')).toEqual({ a: '1' });
    expect(parseCookie('a=1; flag; b=2')).toEqual({ a: '1', b: '2' });
    expect(parseCookie('a=1; flag')).toEqual({ a: '1' });
  });

  it('keeps "=" characters inside values', () => {
    expect(parseCookie('token=abc==; b=x=y')).toEqual({ token: 'abc==', b: 'x=y' });
  });

  it('strips surrounding double quotes', () => {
    expect(parseCookie('a="hello world"; b=""')).toEqual({ a: 'hello world', b: '' });
  });

  it('does not strip a lone or unbalanced quote', () => {
    expect(parseCookie('a="; b="x')).toEqual({ a: '"', b: '"x' });
  });

  it('percent-decodes values', () => {
    expect(parseCookie('email=a%40b.com; json=%7B%22x%22%3A1%7D')).toEqual({
      email: 'a@b.com',
      json: '{"x":1}'
    });
  });

  it('returns the raw value when percent-decoding fails', () => {
    expect(parseCookie('bad=%E0%A4%A; ok=1')).toEqual({ bad: '%E0%A4%A', ok: '1' });
  });

  it('does not decode names', () => {
    expect(parseCookie('a%20b=1')).toEqual({ 'a%20b': '1' });
  });

  it('uses a custom decode function', () => {
    expect(parseCookie('a=1; b=2', { decode: (v) => `[${v}]` })).toEqual({ a: '[1]', b: '[2]' });
  });

  it('only calls decode for cookies it keeps', () => {
    const seen: string[] = [];

    parseCookie('a=1; a=2; b=3', {
      decode: (v) => {
        seen.push(v);
        return v;
      }
    });

    expect(seen).toEqual(['1', '3']);
  });

  it('ignores a trailing semicolon', () => {
    expect(parseCookie('a=1;')).toEqual({ a: '1' });
  });
});
