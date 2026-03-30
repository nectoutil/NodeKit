/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface SlugifyOptions {
  /** Character to replace spaces/separators with. Defaults to `'-'`. */
  replacement?: string;

  /** Regex pattern — matching characters are removed. */
  remove?: RegExp;

  /** Convert to lowercase. Defaults to `true`. */
  lower?: boolean;

  /** Strip all characters that aren't alphanumeric or the replacement. Defaults to `false`. */
  strict?: boolean;

  /** BCP 47 locale tag used for transliteration (e.g. `'de'` for German). */
  locale?: string;

  /** Trim leading/trailing replacement characters. Defaults to `true`. */
  trim?: boolean;
}

export type CharMap = Record<string, string>;
export type LocaleMap = Record<string, CharMap>;
