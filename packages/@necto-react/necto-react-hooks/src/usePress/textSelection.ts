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

import { isIOS } from '@necto/platform';
import { getOwnerDocument, runAfterTransition } from '@necto/dom';

import type { TextSelectionStates } from './types';

let state: TextSelectionStates = 'default';
let savedUserSelect: string = '';
let modifiedElementMap = new WeakMap<Element, string>();

/**
 * Disables text selection for a given element, or for the entire document on iOS.
 *
 * On iOS, this sets `webkitUserSelect: 'none'` on the document element to prevent text selection globally,
 * and restores the previous value when re-enabled. On other platforms, it sets `user-select: none` (or the appropriate
 * vendor-prefixed property) on the provided element, and restores the previous value when re-enabled.
 *
 * This is useful for preventing unwanted text selection during press, drag, or other pointer interactions.
 *
 * @param {Element} [target] - The target element to disable text selection on. If omitted and running on iOS,
 *                             disables selection on the entire document.
 */
export function disableTextSelection(target?: Element): void {
  if (isIOS()) {
    if (state === 'default') {
      const doc = getOwnerDocument(target);
      if (doc && doc.documentElement && typeof doc.documentElement.style.webkitUserSelect !== 'undefined') {
        savedUserSelect = doc.documentElement.style.webkitUserSelect;
        doc.documentElement.style.webkitUserSelect = 'none';
        state = 'disabled';
      }
    }
  } else if (target instanceof HTMLElement || target instanceof SVGElement) {
    // Pick the correct property for user-select
    const style = target.style as Partial<CSSStyleDeclaration>;
    const prop = 'userSelect' in style ? 'userSelect' : 'webkitUserSelect';

    // Only modify if not already disabled
    if (!modifiedElementMap.has(target)) {
      modifiedElementMap.set(target, style[prop] ?? '');
      style[prop] = 'none';
    }
  }
};

/**
 * Restores text selection for a given element, or for the entire document on iOS.
 *
 * On iOS, this restores the `webkitUserSelect` property on the document element to its previous value,
 * after a short delay to avoid race conditions with pointer events. On other platforms, it restores the
 * original `user-select` (or vendor-prefixed) property on the provided element if it was previously modified.
 *
 * This should be called after disabling text selection with `disableTextSelection` to re-enable normal selection behavior.
 *
 * @param {Element} [target] - The element to restore text selection on. If omitted and running on iOS,
 *                             restores selection on the entire document.
 */
export function restoreTextSelection(target?: Element): void {
  if (isIOS()) {
    // Only restore if text selection was previously disabled
    if (state !== 'disabled') return;

    state = 'restoring';

    // iOS may allow selection briefly after pointer up; delay the restore
    setTimeout(() => {
      runAfterTransition(() => {
        // Prevent race conditions
        if (state === 'restoring') {
          const doc = getOwnerDocument(target);
          if (
            doc &&
            doc.documentElement &&
            doc.documentElement.style.webkitUserSelect === 'none'
          ) {
            doc.documentElement.style.webkitUserSelect = savedUserSelect || '';
          }
          savedUserSelect = '';
          state = 'default';
        }
      });
    }, 300);
  } else if (target instanceof HTMLElement || target instanceof SVGElement) {
    // Restore the target's original user-select property if it was modified
    if (modifiedElementMap.has(target)) {
      const prevUserSelect = modifiedElementMap.get(target) ?? '';
      const style = target.style as Partial<CSSStyleDeclaration>;
      const prop = 'userSelect' in style ? 'userSelect' : 'webkitUserSelect';

      if (style[prop] === 'none') {
        style[prop] = prevUserSelect;
      }

      // Clean up if style attribute is now empty
      if (target.getAttribute('style')?.trim() === '') {
        target.removeAttribute('style');
      }

      modifiedElementMap.delete(target);
    }
  }
};
