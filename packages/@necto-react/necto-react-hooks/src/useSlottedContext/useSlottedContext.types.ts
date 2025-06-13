/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Context } from 'react';

/**
 * Props for components that support slotting.
 */
export interface SlotProps {
  /** The slot name to use for context-based prop injection. */
  slot?: string | null;
}

/**
 * Props for the useSlottedContext hook.
 */
export interface UseSlottedContextProps<T> {
  /**
   * The React context to consume, which may be a slotted context value or a direct value.
   */
  context: Context<
    | { slots?: Record<string | symbol, T> }
    | T
    | null
    | undefined
  >;

  /**
   * The slot name to retrieve from the context. If null, context is not used.
   */
  slot?: string | null;
}

/**
 * Return type for the useSlottedContext hook.
 */
export type UseSlottedContextReturn<T> = T | null | undefined;