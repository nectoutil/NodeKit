/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  initTheme,
  withThemeDefaults,
  getThemeSnapshot,
  setTheme,
  subscribeTheme
} from '../src/theme';

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  })) as unknown as typeof window.matchMedia;

  window.localStorage.clear();
});

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.className = '';
  document.documentElement.style.colorScheme = '';
  delete (window as unknown as { _necto?: unknown })._necto;
});

describe('withThemeDefaults', () => {
  it('fills defaults', () => {
    expect(withThemeDefaults()).toEqual({
      storageKey: 'theme',
      attribute: 'data-theme',
      themes: ['light', 'dark'],
      defaultTheme: 'system',
      enableSystem: true,
      enableColorScheme: true,
      disableTransitionOnChange: false,
      forcedTheme: undefined,
      value: undefined
    });
  });

  it('defaults defaultTheme to light when system is disabled', () => {
    expect(withThemeDefaults({ enableSystem: false }).defaultTheme).toBe('light');
  });
});

describe('initTheme', () => {
  it('applies the stored theme and installs the runtime', () => {
    window.localStorage.setItem('theme', 'dark');

    initTheme(withThemeDefaults({ attribute: 'data-theme' }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window._necto?.theme).toBeDefined();
    expect(window._necto?.theme?.getSnapshot().theme).toBe('dark');
  });

  it('falls back to the default theme when nothing is stored', () => {
    initTheme(
      withThemeDefaults({ attribute: 'data-theme', enableSystem: false, defaultTheme: 'light' })
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('adds the class for the class attribute', () => {
    window.localStorage.setItem('theme', 'dark');

    initTheme(withThemeDefaults({ attribute: 'class' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('mirrors color-scheme when enabled', () => {
    window.localStorage.setItem('theme', 'dark');

    initTheme(withThemeDefaults({ attribute: 'data-theme', enableColorScheme: true }));

    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('setTheme persists, applies, and notifies', () => {
    initTheme(
      withThemeDefaults({ attribute: 'data-theme', enableSystem: false, defaultTheme: 'light' })
    );

    const listener = vi.fn();
    window.addEventListener('necto:theme', listener);

    window._necto?.theme?.setTheme('dark');

    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window._necto?.theme?.getSnapshot().theme).toBe('dark');
    expect(listener).toHaveBeenCalled();
  });

  it('getSnapshot() returns a stable reference until a change', () => {
    initTheme(withThemeDefaults({ enableSystem: false, defaultTheme: 'light' }));

    const first = window._necto?.theme?.getSnapshot();

    expect(window._necto?.theme?.getSnapshot()).toBe(first);

    window._necto?.theme?.setTheme('dark');

    expect(window._necto?.theme?.getSnapshot()).not.toBe(first);
  });
});

describe('runtime accessors', () => {
  it('getThemeSnapshot / setTheme / subscribeTheme proxy to the installed runtime', () => {
    initTheme(
      withThemeDefaults({ attribute: 'data-theme', enableSystem: false, defaultTheme: 'light' })
    );

    expect(getThemeSnapshot()?.theme).toBe('light');

    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);

    setTheme('dark');

    expect(getThemeSnapshot()?.theme).toBe('dark');
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it('is safe to call before the runtime is installed', () => {
    expect(getThemeSnapshot()).toBeUndefined();
    expect(() => setTheme('dark')).not.toThrow();
    expect(subscribeTheme(() => {})()).toBeUndefined();
  });

  it('setTheme suppresses transitions when disableTransitionOnChange is on', () => {
    vi.useFakeTimers();
    initTheme(
      withThemeDefaults({
        attribute: 'data-theme',
        enableSystem: false,
        defaultTheme: 'light',
        disableTransitionOnChange: true
      })
    );

    setTheme('dark');

    const style = document.getElementById('necto-theme-transition');
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain('transition:none');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    vi.runAllTimers();
    expect(document.getElementById('necto-theme-transition')).toBeNull();
    vi.useRealTimers();
  });

  it('setTheme does not inject a transition style when the option is off', () => {
    initTheme(
      withThemeDefaults({ attribute: 'data-theme', enableSystem: false, defaultTheme: 'light' })
    );

    setTheme('dark');

    expect(document.getElementById('necto-theme-transition')).toBeNull();
  });
});
