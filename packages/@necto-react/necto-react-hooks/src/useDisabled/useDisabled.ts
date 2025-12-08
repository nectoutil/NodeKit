/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { DisabledContext } from '@necto-react/contexts';

import type {
  UseDisabledOptions,
  UseDisabledReturn
} from './useDisabled.types';

/**
 * React hook to determine if a specific feature or component type is disabled.
 *
 * @param {UseDisabledOptions} options - Options for the hook.
 * @returns {boolean} True if the specified type is disabled, otherwise the fallback value.
 */
export function useDisabled(
  options: UseDisabledOptions = {}
): UseDisabledReturn {
  const { type = 'general', defaultFallback = false } = options;
  const flags = useContext(DisabledContext) || {};
  return flags[type] ?? defaultFallback;
}
