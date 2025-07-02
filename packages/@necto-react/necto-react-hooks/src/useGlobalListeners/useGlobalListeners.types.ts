/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Interface for managing global event listeners with enhanced type safety.
 */
export interface UseGlobalListenersReturn {
  /**
   * Adds a global event listener to the specified element.
   *
   * @param el The target element.
   * @param type The event type.
   * @param listener The event listener function.
   * @param options Optional options.
   */
  addGlobalListener<K extends keyof WindowEventMap | keyof DocumentEventMap>(
    el: Window | EventTarget,
    type: K,
    listener: (
      this: Document,
      ev: K extends keyof WindowEventMap
        ? WindowEventMap[K]
        : K extends keyof DocumentEventMap
          ? DocumentEventMap[K]
          : never
    ) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  /**
   * Adds a global event listener to the specified element.
   *
   * @param el The target element.
   * @param type The event type.
   * @param listener The event listener function or object.
   * @param options Optional options.
   */
  addGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  /**
   * Removes a global event listener from the specified element.
   *
   * @param el The target element.
   * @param type The event type.
   * @param listener The event listener function.
   * @param options Optional options.
   */
  removeGlobalListener<K extends keyof WindowEventMap & keyof DocumentEventMap>(
    el: Window | EventTarget,
    type: K,
    listener: (
      this: Document,
      ev: K extends keyof WindowEventMap
        ? WindowEventMap[K]
        : DocumentEventMap[K]
    ) => void,
    options?: boolean | EventListenerOptions
  ): void;
  /**
   * Removes a global event listener from the specified element.
   *
   * @param el The target element.
   * @param type The event type.
   * @param listener The event listener function or object.
   * @param options Optional options.
   */
  removeGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  /**
   * Removes all global event listeners.
   */
  removeAllGlobalListeners(): void;
}
