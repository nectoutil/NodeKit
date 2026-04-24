/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cssColorNames from 'css-color-names';

/**
 * Map of CSS named colors to their hex values per CSS Color Module Level 4.
 * Keys are lowercase color names (`'aliceblue'`), values are hex strings
 * (`'#f0f8ff'`).
 *
 * Sourced from `css-color-names` and bundled at build time.
 */
export const COLOR_NAMES: Readonly<Record<string, string>> = cssColorNames;
