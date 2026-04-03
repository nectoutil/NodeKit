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

  /** Arrow x coordinate from arrow middleware. */
  arrowX?: number;

  /** Arrow y coordinate from arrow middleware. */
  arrowY?: number;

  /** Width of the default SVG arrow in pixels. @default 10 */
  width?: number;

  /** Height of the default SVG arrow in pixels. @default 5 */
  height?: number;
}
