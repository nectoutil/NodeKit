/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getThemeConfig,
  subscribeTheme,
  getThemeSnapshot,
  setTheme as setRuntimeTheme
} from '@necto/dom';
import { useCallback, useSyncExternalStore } from 'react';

import type { UseThemeReturn } from './useTheme.types';
import type { ThemeConfig, ThemeSnapshot } from '@necto/dom';

const EMPTY_SNAPSHOT: ThemeSnapshot = {
  theme: undefined,
  systemTheme: undefined,
  resolvedTheme: undefined
};

export function useTheme<Theme extends string = string>(): UseThemeReturn<Theme> {
  const snapshot: ThemeSnapshot = useSyncExternalStore(
    subscribeTheme,
    (): ThemeSnapshot => getThemeSnapshot() ?? EMPTY_SNAPSHOT,
    (): ThemeSnapshot => EMPTY_SNAPSHOT
  );

  const config: ThemeConfig | undefined = useSyncExternalStore(
    subscribeTheme,
    getThemeConfig,
    (): ThemeConfig | undefined => undefined
  );

  const setTheme = useCallback((value: Theme | ((previous: Theme | undefined) => Theme)): void => {
    const previous = getThemeSnapshot()?.theme as Theme | undefined;

    setRuntimeTheme(typeof value === 'function' ? value(previous) : value);
  }, []);

  return {
    setTheme,
    systemTheme: snapshot.systemTheme,
    themes: (config?.themes ?? []) as Theme[],
    theme: snapshot.theme as Theme | undefined,
    forcedTheme: config?.forcedTheme as Theme | undefined,
    resolvedTheme: snapshot.resolvedTheme as Theme | undefined
  };
}
