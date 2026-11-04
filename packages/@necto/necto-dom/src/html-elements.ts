/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DOM } from '@necto/constants';
import { capitalize } from '@necto/strings';

import type { HTMLElementsMap } from '@necto/types';

export const HTMLElements: HTMLElementsMap = DOM.HTML_TAGS.reduce((elements, tag) => {
  elements[capitalize(tag)] = tag as keyof HTMLElementTagNameMap;

  return elements;
}, {} as HTMLElementsMap);
