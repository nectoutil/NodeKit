/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isIOS } from '@necto/platform';
import { getOwnerDocument } from './owner';
import { runAfterTransition } from './transitions';

import type { TextSelectionStates } from './types/text-selection';

let savedUserSelect: string = '';
let state: TextSelectionStates = 'default';
const modifiedElementMap = new WeakMap<Element, string>();

export function disableTextSelection(target?: Element): void {
  if (isIOS()) {
    if (state === 'default') {
      const doc: Document = getOwnerDocument(target);
      const style: CSSStyleDeclaration = doc?.documentElement?.style;

      if (style) {
        savedUserSelect = style.getPropertyValue('-webkit-user-select');
        style.setProperty('-webkit-user-select', 'none');
        state = 'disabled';
      }
    }

    return;
  }

  if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
    return;
  }

  const style: CSSStyleDeclaration = target.style;
  const property = 'userSelect' in style ? 'user-select' : '-webkit-user-select';

  if (!modifiedElementMap.has(target)) {
    modifiedElementMap.set(target, style.getPropertyValue(property));
    style.setProperty(property, 'none');
  }
}

export function restoreTextSelection(target?: Element): void {
  if (isIOS()) {
    if (state !== 'disabled') return;

    state = 'restoring';

    setTimeout(() => {
      runAfterTransition(() => {
        if (state !== 'restoring') return;

        const doc = getOwnerDocument(target);

        const style = doc?.documentElement?.style;

        if (style?.getPropertyValue('-webkit-user-select') === 'none') {
          if (savedUserSelect) {
            style.setProperty('-webkit-user-select', savedUserSelect);
          } else {
            style.removeProperty('-webkit-user-select');
          }
        }

        savedUserSelect = '';
        state = 'default';
      });
    }, 300);

    return;
  }

  if (
    !(target instanceof HTMLElement || target instanceof SVGElement) ||
    !modifiedElementMap.has(target)
  ) {
    return;
  }

  const previousValue: string = modifiedElementMap.get(target) ?? '';
  const style: CSSStyleDeclaration = target.style;

  const property = 'userSelect' in style ? 'user-select' : '-webkit-user-select';

  if (style.getPropertyValue(property) === 'none') {
    if (previousValue) {
      style.setProperty(property, previousValue);
    } else {
      style.removeProperty(property);
    }
  }

  if (target.getAttribute('style')?.trim() === '') {
    target.removeAttribute('style');
  }

  modifiedElementMap.delete(target);
}
