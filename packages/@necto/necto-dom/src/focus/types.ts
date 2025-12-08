/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

/**
 * Represents an element with scroll position information.
 */
export interface ScrollableElement {
  /** The HTML element that is scrollable. */
  element: HTMLElement;

  /** The vertical scroll position of the element. */
  scrollTop: number;

  /** The horizontal scroll position of the element. */
  scrollLeft: number;
}
