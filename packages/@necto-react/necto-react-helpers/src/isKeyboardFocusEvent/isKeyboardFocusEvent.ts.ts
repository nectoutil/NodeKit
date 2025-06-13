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
export function createSyntheticEvent<E extends SyntheticEvent>(
  nativeEvent: Event
): E {
  const event = nativeEvent as unknown as E;
  event.nativeEvent = nativeEvent;
  event.isDefaultPrevented = () => event.defaultPrevented;
  event.isPropagationStopped = () => (event as unknown as Event).cancelBubble;
  event.persist = () => {}; // No-op for compatibility with React's synthetic event system.
  return event;
}