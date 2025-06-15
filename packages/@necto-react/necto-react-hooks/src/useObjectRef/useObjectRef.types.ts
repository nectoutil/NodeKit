/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';

/**
 * Props for the useObjectRef hook.
 *
 * @template T The type of the object being referenced.
 */
export interface UseObjectRefProps<T> {
  /**
   * Reference to the object. Can be a function ref, a RefObject, or null.
   * If a function ref, it can optionally return a cleanup function.
   */
  ref?:
    | ((instance: T | null) => (() => void) | undefined)
    | RefObject<T | null>
    | null
}

/**
 * Return value from the useObjectRef hook.
 *
 * @template T The type of the object being referenced.
 */
export type UseObjectRefReturn<T> = RefObject<T | null>;