/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ResizeObserverHandler = (entry: ResizeObserverEntry, observer: ResizeObserver) => void;

export interface ResizeObserverController {
  readonly observer: ResizeObserver;
  subscribe(target: Element, handler: ResizeObserverHandler): void;
  unsubscribe(target: Element, handler: ResizeObserverHandler): void;
  disconnect(): void;
}
