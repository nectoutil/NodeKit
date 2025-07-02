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
  UseDisabledProps,
  UseDisabledPropsReturn
} from './useDisabled.types';

/**
 * React hook to determine if a specific feature or component type is disabled.
 *
 * @param {keyof DisabledFlags} type - The key of the disabled flag to check. Defaults to 'general'.
 * @param {boolean} defaultFallback - The fallback value if the flag is not set. Defaults to false.
 * @returns {boolean} True if the specified type is disabled, otherwise the fallback value.
 */
export function useDisabled(
  props: UseDisabledProps = {}
): UseDisabledPropsReturn {
  const { type = 'general', defaultFallback = false } = props;
  const flags = useContext(DisabledContext) || {};
  return flags[type] ?? defaultFallback;
}
