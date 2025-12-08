/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface UseImageOptions {
  /** The URL of the image to load */
  src: string;

  /** Comma-separated list of image URLs with descriptors for responsive images (e.g., "image-1x.jpg 1x, image-2x.jpg 2x") */
  srcset?: string;

  /** Comma-separated list of source sizes for responsive images (e.g., "(max-width: 600px) 100vw, 50vw") */
  sizes?: string;

  /** Alternative text describing the image for accessibility */
  alt?: string;

  /** CSS class name(s) to apply to the image element */
  class?: string;

  /** Loading behavior: 'eager' loads immediately, 'lazy' defers until near viewport */
  loading?: HTMLImageElement['loading'];

  /** CORS setting: 'anonymous' or 'use-credentials' for cross-origin requests */
  crossorigin?: string;

  /** Controls what referrer information is sent when fetching the image */
  referrerPolicy?: HTMLImageElement['referrerPolicy'];

  /** Intrinsic width of the image in pixels */
  width?: HTMLImageElement['width'];

  /** Intrinsic height of the image in pixels */
  height?: HTMLImageElement['height'];

  /** Decoding hint: 'sync', 'async', or 'auto' for how the browser should decode the image */
  decoding?: HTMLImageElement['decoding'];

  /** Fetch priority hint: 'high', 'low', or 'auto' */
  fetchPriority?: HTMLImageElement['fetchPriority'];

  /** Whether the image is part of a server-side image map */
  ismap?: HTMLImageElement['isMap'];

  /** The hash fragment of an associated image map element (e.g., "#mymap") */
  usemap?: HTMLImageElement['useMap'];
}
