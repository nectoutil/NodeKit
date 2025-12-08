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

let supportsPreventScrollCached: boolean | null = null;

/** Detects if the browser supports the preventScroll option in focus() */
export function supportsPreventScroll(): boolean {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const focusElement: HTMLDivElement = document.createElement('div');
      focusElement.focus({
        get preventScroll(): boolean {
          supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch {
      // Ignore
    }
  }

  return supportsPreventScrollCached;
}
