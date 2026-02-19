/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementType } from 'react';
import type { PrimitiveProps } from '../Primitive';

export type VisuallyHiddenProps = Omit<PrimitiveProps<ElementType>, 'css'> & {
  /** Whether the element should become visible when focused. */
  isFocusable?: boolean;
};
