/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spaceCase } from './space-case';

export function snakeCase(str: string): string {
  return spaceCase(str).replace(/\s/g, '_');
}
