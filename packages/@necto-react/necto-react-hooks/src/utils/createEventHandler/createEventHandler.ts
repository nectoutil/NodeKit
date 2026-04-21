/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isProduction } from 'std-env';

import type { SyntheticEvent } from 'react';
import type { BaseEvent } from '@necto-react/types';
import type { BaseEventHandler, EventHandler } from './types';

/**
 * Creates an event handler that wraps a BaseEventHandler, providing custom propagation control.
 *
 * @template T The type of the SyntheticEvent.
 * @param {BaseEventHandler<T>} [handler] - The handler function to invoke with the extended event.
 * @returns {EventHandler<T> | undefined} A standard event handler or undefined if no handler is provided.
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
        if (stopPropagation && isProduction) {
          console.error(
            'stopPropagation is now the default behavior for events in Necto. You can use continuePropagation() to revert this behavior.'
          );
        } else {
          stopPropagation = true;
        }
      },
      continuePropagation(): void {
        stopPropagation = false;
      },
      isPropagationStopped(): boolean {
        return stopPropagation;
      }
    };

    handler(event);

    if (stopPropagation) {
      e.stopPropagation();
    }
  };
}
