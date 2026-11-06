/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface GeneratedFile {
  path: string;
  content: string;
  skipIfExists?: string;
  placeHeader?: boolean;
  overwriteExisting?: boolean;
}
