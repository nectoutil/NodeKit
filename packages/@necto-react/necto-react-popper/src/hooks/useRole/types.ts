/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export type FloatingRole =
  | 'tooltip'
  | 'dialog'
  | 'menu'
  | 'listbox'
  | 'tree'
  | 'grid'
  | 'alertdialog';

export interface UseRoleProps {
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
   * The ARIA role of the floating element.
   * @default 'dialog'
   */
  role?: FloatingRole;
}

export interface UseRoleReturn {
  reference: ElementProps;
  floating: ElementProps;
}
