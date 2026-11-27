/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { PathPlatforms as PathPlatformsMap } from '../constants';

export type PathPlatform = (typeof PathPlatformsMap)[keyof typeof PathPlatformsMap];

export interface PathOptions {
  platform?: PathPlatform;
}

export interface Path {
  readonly sep: '/';
  readonly delimiter: ':';
  basename(path: string, suffix?: string, options?: PathOptions): string;
  dirname(path: string, options?: PathOptions): string;
  extname(path: string, options?: PathOptions): string;
}
