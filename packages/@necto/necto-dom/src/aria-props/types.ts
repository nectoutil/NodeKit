/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DOM } from '@necto/constants';

/**
 * Type representing valid ARIA attribute values (e.g., 'aria-pressed', 'aria-disabled').
 */
export type AriaAttribute = (typeof DOM.ARIA_ATTRIBUTES)[number];
