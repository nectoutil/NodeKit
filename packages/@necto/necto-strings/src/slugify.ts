/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CHAR_MAP, LOCALE_MAP } from '@necto/constants';

import type { CharMap, LocaleMap, SlugifyOptions } from './types/slugify';

const charMap = CHAR_MAP as CharMap;
const localeMap = LOCALE_MAP as LocaleMap;

const SEPARATOR_REGEX: RegExp = /[\s\-_~]+/g;
const ESCAPE_REGEX: RegExp = /[.*+?^${}()|[\]\\]/g;
const COMBINING_MARKS_REGEX: RegExp = /[\u0300-\u036f]/g;

export function slugify(input: string, options: SlugifyOptions = {}): string {
  const {
    remove,
    locale,
    trim = true,
    lower = true,
    strict = false,
    replacement = '-'
  } = options;

  const localeCharMap: CharMap | undefined = locale
    ? localeMap[locale]
    : undefined;
  const escaped: string = replacement.replace(ESCAPE_REGEX, '\\$&');

  let slug: string = '';

  for (const char of input) {
    if (localeCharMap && char in localeCharMap) {
      slug += localeCharMap[char];
    } else if (char in charMap) {
      slug += charMap[char];
    } else {
      slug += char;
    }
  }

  slug = slug.normalize('NFKD').replace(COMBINING_MARKS_REGEX, '');

  if (replacement) {
    slug = slug.replace(SEPARATOR_REGEX, replacement);
    slug = slug.replace(new RegExp(`${escaped}{2,}`, 'g'), replacement);
  } else {
    slug = slug.replace(SEPARATOR_REGEX, '');
  }

  if (remove) {
    slug = slug.replace(remove, '');
  }

  if (strict) {
    slug = slug.replace(new RegExp(`[^a-zA-Z0-9${escaped}]`, 'g'), '');

    if (replacement) {
      slug = slug.replace(new RegExp(`${escaped}{2,}`, 'g'), replacement);
    }
  }

  if (lower) {
    slug = slug.toLocaleLowerCase(locale);
  }

  if (trim && replacement) {
    slug = slug.replace(new RegExp(`^${escaped}+|${escaped}+$`, 'g'), '');
  }

  return slug;
}
