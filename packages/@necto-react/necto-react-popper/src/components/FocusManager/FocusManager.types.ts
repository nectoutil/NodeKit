/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ReactNode, RefObject } from 'react';
import type { PopperContext } from '../../hooks/types';

export interface FocusManagerProps {
  context: PopperContext;
  children: ReactNode;
  disabled?: boolean;
  initialFocus?: number | RefObject<HTMLElement | null>;
  returnFocus?: boolean;
  modal?: boolean;
  closeOnFocusOut?: boolean;
  order?: Array<'reference' | 'floating' | 'content'>;
  guards?: boolean;
}
