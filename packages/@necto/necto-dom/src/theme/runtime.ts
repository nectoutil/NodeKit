/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { injectStyle } from '../style';

import type { ThemeConfig, ThemeSnapshot } from '../types';

const NO_TRANSITIONS_CSS = '*,*::before,*::after{transition:none !important}';

export function getThemeSnapshot(): ThemeSnapshot | undefined {
  return typeof window === 'undefined' ? undefined : window._necto?.theme?.getSnapshot();
}

/**
 * Persist and apply a theme. When the runtime was configured with
 * `disableTransitionOnChange`, CSS transitions are suppressed for the swap.
 * This is the client-side accessor, so both vanilla and React paths get it;
 * the raw `window._necto.theme.setTheme` primitive does not.
 */
export function setTheme(theme: string): void {
  const runtime = typeof window === 'undefined' ? undefined : window._necto?.theme;

  if (!runtime) {
    return;
  }

  if (!runtime.config.disableTransitionOnChange) {
    runtime.setTheme(theme);
    return;
  }

  const removeStyle = injectStyle(NO_TRANSITIONS_CSS, { id: 'necto-theme-transition' });

  runtime.setTheme(theme);

  // Force a style flush so the override applies, then drop it on the next tick.
  void window.getComputedStyle(document.documentElement).opacity;
  window.setTimeout(removeStyle, 1);
}

export function subscribeTheme(listener: () => void): () => void {
  if (typeof window === 'undefined' || !window._necto?.theme) {
    return (): void => {};
  }

  return window._necto.theme.subscribe(listener);
}

export function getThemeConfig(): ThemeConfig | undefined {
  return typeof window === 'undefined' ? undefined : window._necto?.theme?.config;
}
