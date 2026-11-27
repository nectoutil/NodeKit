/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig } from '../types';

export function withThemeDefaults(config: Partial<ThemeConfig> = {}): ThemeConfig {
  const enableSystem: boolean = config.enableSystem ?? true;

  return {
    enableSystem,
    value: config.value,
    forcedTheme: config.forcedTheme,
    storageKey: config.storageKey ?? 'theme',
    attribute: config.attribute ?? 'data-theme',
    themes: config.themes ?? ['light', 'dark'],
    enableColorScheme: config.enableColorScheme ?? true,
    disableTransitionOnChange: config.disableTransitionOnChange ?? false,
    defaultTheme: config.defaultTheme ?? (enableSystem ? 'system' : 'light')
  };
}
