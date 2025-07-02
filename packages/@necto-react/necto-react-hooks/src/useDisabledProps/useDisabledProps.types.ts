/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HTMLAttributes } from 'react';
import type { DisabledFlags } from '@necto-react/types';

/**
 * Props for the useDisabledProps hook.
 */
export interface UseDisabledPropsProps {
  /** The key of the disabled flag to check. Defaults to 'general'. */
  type?: keyof DisabledFlags;

  /** Additional props to merge with the disabled attributes. */
  extraProps?: HTMLAttributes<HTMLElement>;
}

/**
 * Return type for the useDisabledProps hook.
 */
export type UseDisabledPropsPropsReturn = HTMLAttributes<HTMLElement>;
