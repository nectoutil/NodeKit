/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ImgHTMLAttributes } from 'vue';

/** Image layout mode */
export type ImageLayout = 'fixed' | 'constrained' | 'fullWidth';

/** CSS object-fit mode */
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageProps
  extends /* @vue-ignore */ Omit<
    ImgHTMLAttributes,
    'src' | 'width' | 'height' | 'sizes'
  > {
  /** Image source URL (required) */
  src: string;

  /** Alt text for accessibility (required) */
  alt: string;

  /** Image width */
  width?: string | number;

  /** Image height */
  height?: string | number;

  /** Aspect ratio (width/height) */
  aspectRatio?: number;

  /** Responsive sizes attribute */
  sizes?: string | string[];

  /** Layout mode: 'fixed' | 'constrained' | 'fullWidth' (default: 'constrained') */
  layout?: ImageLayout;

  /** Loading priority - if true, disables lazy loading */
  priority?: boolean;

  /** Background color or image URL for placeholder */
  background?: string;

  /** CSS object-fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' (default: 'cover') */
  objectFit?: ObjectFit;

  /** Disable all automatic styling */
  unstyled?: boolean;

  /** Use custom slot instead of img element */
  custom?: boolean;

  /** Inline SVG directly into DOM (only works with SVG src) */
  inline?: boolean;
}

export interface ImageEmits {
  (event: 'load', payload: Event): void;
  (event: 'error', payload: Event): void;
}

export interface ImageSlotProps {
  /** Computed image attributes */
  imgAttrs: ImgHTMLAttributes;

  /** Whether the main image has loaded */
  isLoaded: boolean;

  /** Whether the image failed to load */
  hasError: boolean;
}
