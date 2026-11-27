/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SyntheticEvent } from 'react';
import type { BaseEvent } from '@necto-react/types';

export type EventHandler<T extends SyntheticEvent> = (event: T) => void;
export type BaseEventHandler<T extends SyntheticEvent> = (event: BaseEvent<T>) => void;

/**
 * Creates an event handler that wraps a callback, providing custom propagation control.
 *
 * @template T The type of the SyntheticEvent.
 * @param handler - The callback to invoke with the extended event.
 * @returns A standard event handler, or undefined if no callback is provided.
 */
export function createEventHandler<T extends SyntheticEvent>(
  handler?: BaseEventHandler<T>
): EventHandler<T> | undefined {
  if (!handler) return undefined;

  let stopPropagation: boolean = true;
  return (e: T) => {
    const event: BaseEvent<T> = {
      ...e,
      preventDefault(): void {
        e.preventDefault();
      },
      isDefaultPrevented(): boolean {
        return e.isDefaultPrevented();
      },
      stopPropagation(): void {
        if (stopPropagation) {
          throw new TypeError(
            __DEV__
              ? '[necto-react.hooks] NT0205: stopPropagation() is redundant because events stop propagation by default. Use continuePropagation() to allow propagation.'
              : '[necto-react.hooks] NT0205: https://necto.dev/errors/NT0205'
          );
        }

        stopPropagation = true;
      },
      continuePropagation(): void {
        stopPropagation = false;
      },
      isPropagationStopped(): boolean {
        return stopPropagation;
      }
    };

    try {
      handler(event);
    } finally {
      if (stopPropagation) {
        e.stopPropagation();
      }
    }
  };
}
