/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ReactNode } from 'react';
import type { Primitive } from '../Primitive';
import type { ComponentPropsWithoutRef } from 'react';

export interface PortalProps extends ComponentPropsWithoutRef<typeof Primitive.Div> {
  children?: ReactNode;
  container?: Element | DocumentFragment | null;
}
