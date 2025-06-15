/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from "react";

/**
 * Specifies how the mounted state should be accessed.
 */
export type MountedAccessType = 'function' | 'ref' | 'boolean';

/**
 * Props for the useMounted hook.
 */
export interface UseMountedProps {
  /** The type of access to the mounted state. */
  type?: MountedAccessType;
}

/**
 * Return type for the useMounted hook, varies based on the access type.
 *
 * - 'ref': Returns a RefObject containing the mounted state
 * - 'boolean': Returns a boolean value directly
 * - 'function': Returns a function that returns the current mounted state
 */
export type UseMountedReturn<T extends MountedAccessType> =
  T extends 'ref' ? RefObject<boolean> :
  T extends 'boolean' ? boolean :
  () => boolean;