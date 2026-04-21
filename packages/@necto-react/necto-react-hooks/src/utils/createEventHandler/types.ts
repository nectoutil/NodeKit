/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { SyntheticEvent } from 'react';
import type { BaseEvent } from '@necto-react/types';

/**
 * Type for the event handler function returned by createEventHandler.
 *
 * @template T The type of the SyntheticEvent.
 */
export type EventHandler<T extends SyntheticEvent> = (e: T) => void;

/**
 * Type for the handler function passed to createEventHandler.
 *
 * @template T The type of the SyntheticEvent.
 */
export type BaseEventHandler<T extends SyntheticEvent> = (
  e: BaseEvent<T>
) => void;
