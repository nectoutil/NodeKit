/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { DisabledContext } from './disabledContext';

import type { DisabledFlags } from './types';

export function useDisabled(
  type: keyof DisabledFlags = 'general',
  defaultFallback = false
): boolean {
  const flags = useContext(DisabledContext) || new Object();
  return flags[type] ?? defaultFallback;
}