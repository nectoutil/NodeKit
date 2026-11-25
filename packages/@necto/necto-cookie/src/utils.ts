/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CHARS } from '@necto/constants';

function isOptionalWhitespace(code: number): boolean {
  return code === CHARS.SPACE || code === CHARS.TAB;
}

function trimStart(str: string, start: number, end: number): number {
  let index: number = start;

  while (index < end && isOptionalWhitespace(str.charCodeAt(index))) {
    index++;
  }

  return index;
}

function trimEnd(str: string, start: number, end: number): number {
  let index: number = end;

  while (index > start && isOptionalWhitespace(str.charCodeAt(index - 1))) {
    index--;
  }

  return index;
}

export function sliceTrimmed(str: string, start: number, end: number): string {
  const from: number = trimStart(str, start, end);

  return str.slice(from, trimEnd(str, from, end));
}

export function sliceUnquoted(str: string, start: number, end: number): string {
  let from: number = trimStart(str, start, end);
  let to: number = trimEnd(str, from, end);

  if (
    to - from >= 2 &&
    str.charCodeAt(from) === CHARS.DOUBLE_QUOTE &&
    str.charCodeAt(to - 1) === CHARS.DOUBLE_QUOTE
  ) {
    from++;
    to--;
  }

  return str.slice(from, to);
}

export function safeDecode(value: string): string {
  if (value.indexOf(String.fromCharCode(CHARS.PERCENT)) === -1) {
    return value;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
