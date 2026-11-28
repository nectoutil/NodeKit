/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const SCRIPT_NAME: string = 'Script' as const;

export const SCRIPT_METHOD_SHORTHAND_PATTERN: RegExp = new RegExp(
  /^(?:(async)\s+)?(\*)?\s*(?!function\b|async\s*\()[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*\s*(?=\()/u
);
