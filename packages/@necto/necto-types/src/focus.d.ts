/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Strategy for focusing an element in a collection.
 * - 'first': Focus the first item.
 * - 'last': Focus the last item.
 */
export type FocusStrategy = 'first' | 'last';

/**
 * Determines which items are disabled in a collection.
 * - 'selection': Only selection is disabled.
 * - 'all': All interactions are disabled.
 */
export type DisabledBehavior = 'selection' | 'all';
