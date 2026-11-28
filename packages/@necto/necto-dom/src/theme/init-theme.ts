/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThemeConfig, ThemeSnapshot, ResolvedTheme } from '../types';

/**
 * Initializes the theme before first paint and installs the browser runtime.
 * It is serialized into an inline script, so keep it self-contained.
 */
export function initTheme(config: ThemeConfig): void {
  const root: HTMLElement = document.documentElement;
  const necto = (window._necto = window._necto ?? {});

  function getSystemTheme(): ResolvedTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function resolveTheme(theme: string): string {
    return theme === 'system' && config.enableSystem ? getSystemTheme() : theme;
  }

  function readStoredTheme(): string {
    try {
      return window.localStorage.getItem(config.storageKey) || config.defaultTheme;
    } catch {
      return config.defaultTheme;
    }
  }

  function applyToDocument(theme: string): void {
    const resolved = config.forcedTheme || resolveTheme(theme);
    const applied = (config.value && config.value[resolved]) || resolved;
    const attrs = typeof config.attribute === 'string' ? [config.attribute] : config.attribute;

    for (const attr of attrs) {
      if (attr === 'class') {
        root.classList.remove(
          ...config.themes.map((name) => (config.value && config.value[name]) || name)
        );

        root.classList.add(applied);
      } else {
        root.setAttribute(attr, applied);
      }
    }

    if (config.enableColorScheme) {
      root.style.colorScheme = resolved === 'dark' ? 'dark' : 'light';
    }
  }

  function computeSnapshot(): ThemeSnapshot {
    const theme = readStoredTheme();

    return {
      theme,
      resolvedTheme: config.forcedTheme || resolveTheme(theme),
      systemTheme: config.enableSystem ? getSystemTheme() : undefined
    };
  }

  let snapshot: ThemeSnapshot = computeSnapshot();

  function notify(): void {
    snapshot = computeSnapshot();

    try {
      window.dispatchEvent(new CustomEvent('necto:theme'));
    } catch {}
  }

  necto.theme = {
    config,
    getSnapshot: (): ThemeSnapshot => snapshot,
    setTheme: (theme: string): void => {
      try {
        window.localStorage.setItem(config.storageKey, theme);
      } catch {}

      applyToDocument(theme);
      notify();
    },
    subscribe: (listener: () => void): (() => void) => {
      window.addEventListener('necto:theme', listener);
      window.addEventListener('storage', listener);

      return (): void => {
        window.removeEventListener('necto:theme', listener);
        window.removeEventListener('storage', listener);
      };
    }
  };

  if (config.enableSystem) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (): void => {
      if (readStoredTheme() === 'system') {
        applyToDocument('system');
      }

      notify();
    });
  }

  window.addEventListener('storage', (event: StorageEvent): void => {
    // A null key means the whole store was cleared, so re-resolve either way.
    if (event.key === config.storageKey || event.key === null) {
      applyToDocument(readStoredTheme());
      notify();
    }
  });

  // Apply the pre-paint immediately, FOUC-prevention step.
  applyToDocument(readStoredTheme());
}
