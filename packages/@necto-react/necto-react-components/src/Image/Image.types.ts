/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ReactNode,
  MouseEvent,
  SyntheticEvent,
  ImgHTMLAttributes
} from 'react';

/**
 * Callback props for the Image component.
 *
 * Contains event handlers that can be passed to customize image behavior.
 */
interface ImageCallbackProps {
  /** Called when the image is clicked. */
  onClick?: (e: MouseEvent<HTMLImageElement>) => void;

  /** Called when the image fails to load. */
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Props for the Image component.
 *
 * Extends native HTML image attributes while providing additional features
 * for placeholders, fallbacks, and multiple source support.
 */
export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'src'>,
    ImageCallbackProps {
  /** The image source URL, or an array of URLs for responsive images. */
  src?: string | Array<string>;

  /** Content to display while the image is loading. */
  placeholder?: ReactNode;

  /** Fallback image URL to display if the primary source fails to load. */
  fallback?: string;
}
