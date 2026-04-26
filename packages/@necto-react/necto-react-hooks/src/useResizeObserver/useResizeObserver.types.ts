/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ResizeObserverHandler } from '@necto/dom';

export type UseResizeObserverCallback = ResizeObserverHandler;

export interface UseResizeObserverOptions {
  /** Optional ResizeObserver implementation, primarily for SSR fallbacks. */
  polyfill?: typeof ResizeObserver;
}
