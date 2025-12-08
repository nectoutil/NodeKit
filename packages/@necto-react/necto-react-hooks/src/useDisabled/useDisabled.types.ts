/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DisabledFlags } from '@necto-react/types';

/**
 * Options for the useDisabled hook.
 */
export interface UseDisabledOptions {
  /** The key of the disabled flag to check. Defaults to 'general'. */
  type?: keyof DisabledFlags;

  /** The fallback value if the flag is not set. Defaults to false. */
  defaultFallback?: boolean;
}

/**
 * Return type for the useDisabled hook.
 */
export type UseDisabledReturn = boolean;
