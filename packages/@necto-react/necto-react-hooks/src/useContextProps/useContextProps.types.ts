/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject, ForwardedRef, Context } from 'react';

/**
 * Props for the useContextProps hook.
 */
export interface UseContextPropsProps<T, E extends Element> {
  /**
   * Component props, must include optional slot property and optional ref.
   */
  props: T & {
    /**
     * The slot name to retrieve from the context. If null, context is not used.
     */
    slot?: string | null;

    /**
     * Optional forwarded ref for the component.
     */
    ref?: ForwardedRef<E>;
  };

  /**
   * Forwarded ref for the component (from React.forwardRef).
   */
  ref: ForwardedRef<E>;

  /**
   * React context to retrieve slot values from.
   * The context value can be:
   *   - an object with `slots` (mapping slot names to values)
   *   - a value of the same type as props (with optional ref)
   *   - null or undefined
   */
  context: Context<
    | {
        slots?: Record<
          string | symbol,
          T & {
            slot?: string | null;
            ref?: ForwardedRef<E>;
          }
        >;
      }
    | (T & {
        slot?: string | null;
        ref?: ForwardedRef<E>;
      })
    | null
    | undefined
  >;
}

/**
 * Return type for the useContextProps hook.
 */
export type UseContextPropsReturn<T, E extends Element> = [
  T,
  RefObject<E | null>
];
