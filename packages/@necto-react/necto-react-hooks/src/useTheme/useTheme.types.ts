/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, ThemeSnapshot } from '@necto/dom';

export interface UseThemeReturn<Theme extends string = string>
  extends ThemeSnapshot, Pick<ThemeConfig, 'themes' | 'forcedTheme'> {
  /** Available theme names. */
  themes: Theme[];

  /** Currently selected theme. */
  theme: Theme | undefined;

  /** Theme currently applied after resolving `system`. */
  resolvedTheme: Theme | undefined;

  /** Forced theme configured by the provider, if any. */
  forcedTheme: Theme | undefined;

  /** Sets the selected theme directly or from its previous value. */
  setTheme: (value: Theme | ((previous: Theme | undefined) => Theme)) => void;
}
