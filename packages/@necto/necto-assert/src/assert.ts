/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AssertionError } from './errors';

/**
 * Throws an AssertionError if the given expression is falsy.
 *
 * @param expression - The value to assert as truthy.
 * @param message - Optional error message for the assertion failure.
 * @throws {AssertionError} If the expression is falsy.
 */
export function assert(
  expression: unknown,
  message: string = ''
): asserts expression {
  if (!expression) {
    throw new AssertionError(message);
  }
}
