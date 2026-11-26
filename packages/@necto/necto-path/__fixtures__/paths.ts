/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fc from 'fast-check';

export const PATHS: string[] = [
  '',
  '/',
  '//',
  '///',
  '.',
  '..',
  '...',
  'foo',
  'foo/bar',
  '/foo/bar',
  '/foo/bar/',
  '/foo/bar///',
  'foo/bar/baz.txt',
  '/a/b/c.d.e',
  'file.',
  'file..',
  '.gitignore',
  'a/.b',
  'a/b.',
  'a//b',
  'a///b',
  '/a//b/',
  '//a',
  'index.html',
  'archive.tar.gz',
  '.hidden',
  '..a',
  '.a.b',
  'a..b'
];

const token = fc.constantFrom(
  'a',
  'bb',
  'ccc',
  '.',
  '..',
  '...',
  '/',
  '//',
  '\\',
  ':',
  'C:',
  'x.txt',
  '.hidden',
  ' ',
  ''
);

export const pathArb: fc.Arbitrary<string> = fc
  .array(token, { maxLength: 10 })
  .map((tokens) => tokens.join(''));

export const suffixArb: fc.Arbitrary<string> = fc.constantFrom(
  '.txt',
  '.md',
  '.tar.gz',
  'bar',
  'x',
  ''
);
