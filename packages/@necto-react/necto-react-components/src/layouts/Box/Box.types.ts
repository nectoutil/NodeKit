/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementType } from 'react';
import type { PrimitiveProps } from '../../Primitive';

type LineStyle = 'solid' | 'dashed';
type Overflow = 'hidden' | 'scroll' | 'clip';

export type BoxProps<T extends ElementType = 'div'> = PrimitiveProps<T> & {
  /** Background color */
  background?: string;
  /** Border color */
  borderColor?: string;
  /** Border style */
  borderStyle?: LineStyle;
  /** Border width */
  borderWidth?: string;
  /** Vertical start border width */
  borderBlockStartWidth?: string;
  /** Vertical end border width */
  borderBlockEndWidth?: string;
  /** Horizontal start border width */
  borderInlineStartWidth?: string;
  /** Horizontal end border width */
  borderInlineEndWidth?: string;
  /** Border radius */
  borderRadius?: string;
  /** Vertical end horizontal start border radius */
  borderEndStartRadius?: string;
  /** Vertical end horizontal end border radius */
  borderEndEndRadius?: string;
  /** Vertical start horizontal start border radius */
  borderStartStartRadius?: string;
  /** Vertical start horizontal end border radius */
  borderStartEndRadius?: string;
  /** Text color */
  color?: string;
  /** Minimum height */
  minHeight?: string;
  /** Minimum width */
  minWidth?: string;
  /** Maximum width */
  maxWidth?: string;
  /** Width */
  width?: string;
  /** Clip horizontal content */
  overflowX?: Overflow;
  /** Clip vertical content */
  overflowY?: Overflow;
  /** Padding on all sides */
  padding?: number;
  /** Vertical padding */
  paddingBlock?: number;
  /** Vertical start padding */
  paddingBlockStart?: number;
  /** Vertical end padding */
  paddingBlockEnd?: number;
  /** Horizontal padding */
  paddingInline?: number;
  /** Horizontal start padding */
  paddingInlineStart?: number;
  /** Horizontal end padding */
  paddingInlineEnd?: number;
  /** Box shadow */
  shadow?: string;
  /** Outline color */
  outlineColor?: string;
  /** Outline style */
  outlineStyle?: LineStyle;
  /** Outline width */
  outlineWidth?: string;
  /** Opacity */
  opacity?: string;
  /** z-index */
  zIndex?: string;
};
