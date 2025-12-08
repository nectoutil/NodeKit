/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Options for the useId hook.
 */
export interface UseIdOptions {
  /** Optional custom prefix for the generated ID. */
  prefix?: string;

  /** Optional default ID to use instead of generating one. */
  defaultId?: string;
}
