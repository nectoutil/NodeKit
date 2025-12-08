/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getImageStyle } from '../style';

import type { ImageAttributes, TransformOptions } from './types';

/** Transforms image props into img element attributes */
export function transformProps(props: TransformOptions): ImageAttributes {
  const {
    src,
    width,
    height,
    aspectRatio,
    layout,
    priority = false,
    background,
    objectFit,
    unstyled = false
  } = props;

  const result: ImageAttributes = {
    src,
    loading: priority ? 'eager' : 'lazy',
    decoding: priority ? 'sync' : 'async',
    fetchpriority: priority ? 'high' : undefined
  };

  // Generate style if not unstyled
  if (!unstyled) {
    const style = getImageStyle({
      width,
      height,
      aspectRatio,
      layout,
      objectFit,
      background
    });
    if (style) {
      result.style = style;
    }
  }

  // Set dimensions based on layout
  if (layout === 'fixed') {
    result.width = width;
    result.height = height;
  }

  return result;
}
