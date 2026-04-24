/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import htmlTags from 'html-tags';
import { ariaAttributes } from 'aria-attributes';
import { htmlVoidElements } from 'html-void-elements';
import { htmlElementAttributes } from 'html-element-attributes';

/**
 * The full list of standard HTML element tag names per the HTML Living Standard.
 * Sourced from the `html-tags` package and bundled at build time.
 */
export const HTML_TAGS: readonly string[] = htmlTags;

/**
 * The full list of ARIA attribute names per the WAI-ARIA spec.
 * Sourced from the `aria-attributes` package and bundled at build time.
 */
export const ARIA_ATTRIBUTES: readonly string[] = ariaAttributes;

/**
 * Map of HTML element tag names to their spec-defined attributes.
 * The `'*'` key holds global attributes applicable to all elements.
 *
 * Attribute names are lowercase (DOM style, e.g. `hreflang`, not `hrefLang`).
 * Consumers needing React-prop casing should convert at their boundary.
 *
 * Sourced from `html-element-attributes` and bundled at build time.
 */
export const ELEMENT_ATTRIBUTES: Readonly<Record<string, readonly string[]>> =
  htmlElementAttributes;

/**
 * HTML void elements — elements that cannot have content and are self-closing
 * (`<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, etc.).
 *
 * Sourced from `html-void-elements` and bundled at build time.
 */
export const VOID_ELEMENTS: readonly string[] = htmlVoidElements;

/**
 * Necto's curated subset of HTML tags treated as "primitives" that polymorphic
 * components can render as. This is a Necto convention — NOT a spec-derived
 * list — and intentionally hand-maintained.
 */
export const PRIMITIVE_TAGS: readonly string[] = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'select',
  'span',
  'svg',
  'ul'
];
