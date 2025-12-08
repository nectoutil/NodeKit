/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CSSProperties } from '../style/types';

/** HTML image element attributes (output of transform) */
export interface ImageAttributes {
  src?: string;
  srcset?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'sync' | 'async' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  style?: CSSProperties;
}

/** Image layout mode */
export type ImageLayout = 'fixed' | 'constrained' | 'fullWidth';

/** CSS object-fit mode */
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

/** Options for the transform function */
export interface TransformOptions {
  src: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  layout?: ImageLayout;
  priority?: boolean;
  background?: string;
  objectFit?: ObjectFit;
  unstyled?: boolean;
}
