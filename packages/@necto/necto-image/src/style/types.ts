/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ImageLayout } from '../transform/types';

/** CSS properties object */
export type CSSProperties = Record<string, string>;

/** Options for generating image styles */
export interface StyleOptions {
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  layout?: ImageLayout;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  background?: string;
}

// Backwards compatibility alias
export type ImageStyleProps = StyleOptions;
