/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  /** localStorage key the preferred theme is stored under. */
  storageKey: string;

  /** DOM attribute(s) written to `<html>`: `'class'`, a `data-*` name, or several. */
  attribute: string | string[];

  /** All selectable theme names. */
  themes: string[];

  /** Theme used when nothing is stored (often `'system'`). */
  defaultTheme: string;

  /** Resolve `'system'` against `prefers-color-scheme`. */
  enableSystem: boolean;

  /** Mirror the resolved theme to `color-scheme`. */
  enableColorScheme: boolean;

  /** When set, overrides the stored/selected theme. */
  forcedTheme?: string;

  /** Maps a theme name to the value written to the attribute. */
  value?: Record<string, string>;

  /** Suppress CSS transitions during a theme change to avoid flicker. */
  disableTransitionOnChange?: boolean;
}

export interface ThemeSnapshot {
  /** The stored/selected theme — may be `'system'`. */
  theme: string | undefined;

  /** The concrete theme in effect, with `'system'` resolved. */
  resolvedTheme: string | undefined;

  /** The OS preference, when `enableSystem` is on. */
  systemTheme: ResolvedTheme | undefined;
}

export interface NectoThemeRuntime {
  /** The resolved configuration the runtime was installed with. */
  config: ThemeConfig;

  /** The current snapshot (stable reference until it changes). */
  getSnapshot(): ThemeSnapshot;

  /** Persist and apply a theme, then notify subscribers. */
  setTheme(theme: string): void;

  /** Subscribe to theme changes; returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

declare global {
  interface Window {
    _necto?: {
      theme?: NectoThemeRuntime;
    };
  }
}
