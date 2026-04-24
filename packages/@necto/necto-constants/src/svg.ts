/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { svgTagNames } from 'svg-tag-names';
import { svgElementAttributes } from 'svg-element-attributes';

/**
 * The full list of SVG element tag names per the SVG spec.
 * Sourced from `svg-tag-names` and bundled at build time.
 */
export const TAGS: readonly string[] = svgTagNames;

/**
 * Map of SVG element tag names to their spec-defined attributes.
 * The `'*'` key holds attributes applicable to all SVG elements.
 *
 * Sourced from `svg-element-attributes` and bundled at build time.
 */
export const ELEMENT_ATTRIBUTES: Readonly<Record<string, readonly string[]>> =
  svgElementAttributes;
