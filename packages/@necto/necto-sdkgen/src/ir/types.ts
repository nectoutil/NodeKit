/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type SpecFormat = 'openapi' | 'asyncapi';

export interface ApiSpec {
  format: SpecFormat;
  version: string;
  document: Record<string, unknown>;
  sourceUrl: string;
  dependencies: string[];
}