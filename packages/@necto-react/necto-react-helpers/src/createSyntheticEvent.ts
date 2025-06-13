/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { SyntheticEvent } from 'react';

/**
 * Creates a synthetic React event from a native DOM event.
 * This is used to maintain compatibility with React's event system.
 *
 * @param nativeEvent - The original native DOM event.
 * @returns The synthetic React event.
 */
export function createSyntheticEvent<T extends SyntheticEvent>(
  nativeEvent: Event
): T {
  const event = nativeEvent as unknown as T;
  Object.assign(event, {
    nativeEvent,
    isDefaultPrevented: () => event.defaultPrevented,
    isPropagationStopped: () => (event as unknown as Event).cancelBubble,
    persist: () => {},
  });

  return event;
}
