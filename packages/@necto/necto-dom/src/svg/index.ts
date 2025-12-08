/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { isSvg as isSvgContent, isSvgFast } from '@necto/file';

/**
 * Injects width and height attributes into an SVG string
 */
export function injectSvgDimensions(
  svg: string,
  width: string | number = '100%',
  height: string | number = '100%'
): string {
  return svg.replace(
    /<svg([^>]*)>/,
    `<svg$1 width="${width}" height="${height}">`
  );
}

/**
 * Checks if an element is an SVG element
 */
export function isSvgElement(element: Element): element is SVGElement {
  return element instanceof SVGElement;
}

/**
 * Checks if an element is a specific HTML element type
 */
export function isElementType<K extends keyof HTMLElementTagNameMap>(
  element: Element,
  tagName: K
): element is HTMLElementTagNameMap[K] {
  return element.tagName.toLowerCase() === tagName.toLowerCase();
}
