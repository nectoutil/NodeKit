/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLElements } from '@necto/dom';

export const OVERFLOW_NAME: string = 'Overflow' as const;
export const DEFAULT_OVERFLOW_TAG: keyof HTMLElementTagNameMap =
  HTMLElements.Div;
