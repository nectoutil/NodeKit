/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { isIOS } from "@necto/platform";
import { getOwnerDocument, runAfterTransition } from "@necto/dom";

type State = 'default' | 'disabled' | 'restoring';

let state: State = 'default';
let savedUserSelect: string = '';
let modifiedElementMap = new WeakMap<Element, string>();

/**
 * Disables text selection on the given element or on the entire document for iOS.
 * @param target The target element to disable text selection on. If not provided and on iOS, disables on the document.
 */
function disableTextSelection(target?: Element): void {
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
}

/**
 * Restores text selection for the given element or for the entire document on iOS.
 * @param target The element to restore text selection on. If not provided and on iOS, restores on the document.
 */
function restoreTextSelection(target?: Element): void {
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
}

export {
  disableTextSelection,
  restoreTextSelection
}