/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { toPx } from '@necto/dom';
import { isUrl } from '@necto/url';

import type { ImageLayout } from '../transform/types';
import type { CSSProperties, StyleOptions } from './types';

/** Generates CSS styles for an image based on layout */
export function getImageStyle({
  width,
  height,
  aspectRatio,
  layout,
  objectFit,
  background
}: StyleOptions): CSSProperties | undefined {
  const style: CSSProperties = {};

  // Only apply object-fit if explicitly set
  if (objectFit) {
    style['object-fit'] = objectFit;
  }

  if (isUrl(background)) {
    style['background-image'] = `url(${background})`;
    style['background-size'] = 'cover';
    style['background-repeat'] = 'no-repeat';
  } else if (background) {
    style.background = background;
  }

  // Only apply layout styles if layout is explicitly set or dimensions are provided
  if (layout === 'fixed') {
    if (width !== undefined) style.width = toPx(width)!;
    if (height !== undefined) style.height = toPx(height)!;
  } else if (layout === 'constrained') {
    style.width = '100%';
    if (width !== undefined) style['max-width'] = toPx(width)!;
    if (height !== undefined) style['max-height'] = toPx(height)!;
    if (aspectRatio) style['aspect-ratio'] = String(aspectRatio);
  } else if (layout === 'fullWidth') {
    style.width = '100%';
    if (height !== undefined) style.height = toPx(height)!;
    if (aspectRatio) style['aspect-ratio'] = String(aspectRatio);
  }

  // Return undefined if no styles were applied
  return Object.keys(style).length > 0 ? style : undefined;
}

/** Generates the HTML sizes attribute for responsive images */
export function getImageSizes(
  width?: number,
  layout?: ImageLayout
): string | undefined {
  if (!width || !layout) return undefined;

  switch (layout) {
    case 'constrained':
      return `(min-width: ${width}px) ${width}px, 100vw`;
    case 'fixed':
      return `${width}px`;
    case 'fullWidth':
      return '100vw';
    default:
      return undefined;
  }
}
