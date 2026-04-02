/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ReactNode,
  RefObject,
  CSSProperties,
  HTMLAttributes
} from 'react';
import type { Side } from '@necto/popper';

export interface ArrowRenderProps {
  placement: Side | null;
}

export interface ArrowProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style' | 'children'
  > {
  ref?: RefObject<HTMLDivElement | null>;
  children?: ReactNode | ((renderProps: ArrowRenderProps) => ReactNode);
  style?: CSSProperties;
  className?: string;
  placement: Side | null;
}
