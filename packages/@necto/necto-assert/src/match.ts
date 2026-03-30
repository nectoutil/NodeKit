/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AssertionError } from './errors';

export function assertMatch(
  actual: string,
  expected: RegExp,
  message?: string
): void {
  if (expected.test(actual)) {
    return;
  }

  const messageSuffix: string = message ? `: ${message}` : '.';
  message = `Expected actual: "${actual}" to match: "${expected}"${messageSuffix}`;

  throw new AssertionError(message);
}
