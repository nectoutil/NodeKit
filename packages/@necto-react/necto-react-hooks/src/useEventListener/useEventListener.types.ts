/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type EventListenerTarget =
  | Window
  | Document
  | HTMLElement
  | SVGElement
  | MediaQueryList;

export interface UseEventListenerOptions extends AddEventListenerOptions {
  /**
   * When `false`, the listener is detached.
   *
   * Defaults to `true`.
   *
   * @example
   *   useEventListener('keydown', handleEsc, undefined, {
   *     enabled: isModalOpen
   *   });
   */
  enabled?: boolean;
}

export type EventMapOf<Target> = Target extends MediaQueryList
  ? MediaQueryListEventMap
  : Target extends Window
    ? WindowEventMap
    : Target extends Document
      ? DocumentEventMap
      : Target extends SVGElement
        ? SVGElementEventMap
        : Target extends HTMLElement
          ? HTMLElementEventMap
          : never;
