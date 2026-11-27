/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type ThemeProps = {
  forcedTheme?: string;
  disableTransitions?: boolean;
  enableColorScheme?: boolean;
  storageKey?: 'theme' | 'class' | 'both';
  attribute?: string;
};
