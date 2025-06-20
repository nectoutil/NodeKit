/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
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
    let event: BaseEvent<T> = {
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
