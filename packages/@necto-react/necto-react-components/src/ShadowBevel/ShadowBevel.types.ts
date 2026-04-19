/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementType } from 'react';
import type { PrimitiveProps } from '../Primitive';

/**
 * Props for the ShadowBevel component, which applies a box shadow and
 * an optional inset bevel overlay via a `::before` pseudo-element.
 */
export type ShadowBevelProps = PrimitiveProps<ElementType> & {
  /** If true, renders the inset bevel overlay. Defaults to `true`. */
  bevel?: boolean;

  /** Outer box shadow. A number references `--necto-shadow-{n}`; a string is used verbatim. */
  boxShadow?: number | string;

  /** Outer border radius. A number is treated as pixels; a string is used verbatim. */
  borderRadius?: number | string;

  /** Z-index applied to the bevel overlay. Defaults to `0`. */
  zIndex?: number;

  /** Padding shorthand applied to the underlying element, in pixels. */
  padding?: number;
};
