/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export interface UseClientPointOptions {
  /**
   * Whether the floating element is open.
   */
  open: boolean;

  /**
   * Whether the hook is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * The axis to position on.
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';

  /**
   * Virtual element setter for positioning.
   */
  setReference?: (
    reference: {
      getBoundingClientRect: () => DOMRect;
    } | null
  ) => void;
}

export interface UseClientPointReturn {
  reference: ElementProps;
  floating: ElementProps;
}
