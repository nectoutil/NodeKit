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

import { useContext } from 'react';

import type {
  UseSlottedContextProps,
  UseSlottedContextReturn
} from './useSlottedContext.types';

/**
 * Retrieves a value from a React context, optionally using a named slot.
 * Returns the slot value if available, the direct context value, or null/undefined.
 * Throws an error if a specified slot does not exist in the context.
 *
 * @param {UseSlottedContextProps<T>} props - The context and optional slot name.
 * @returns {UseSlottedContextReturn<T>} The value for the given slot, the direct context value, or null/undefined.
 */
export function useSlottedContext<T>(
  props: UseSlottedContextProps<T>
): UseSlottedContextReturn<T> {
  const { context, slot } = props;
  const ctx = useContext(context);

  if (slot === null) {
    return null;
  }

  if (ctx && typeof ctx === 'object' && 'slots' in ctx && ctx.slots) {
    const slotKey = slot || Symbol('default');
    if (!ctx.slots[slotKey]) {
      const availableSlots = new Intl.ListFormat().format(
        Object.keys(ctx.slots).map((p) => `"${p}"`)
      );

      const errorMessage = slot
        ? `Invalid slot name: "${slot}".  This slot is not recognized.  Please refer to the component's documentation for valid slot names.`
        : 'A slot prop is required.  You must provide a valid slot name to render content in this area.';

      throw new Error(
        `${errorMessage} Valid slot names are ${availableSlots}.`
      );
    }
    return ctx.slots[slotKey];
  }

  if (ctx && typeof ctx === 'object' && 'slots' in ctx) {
    return null;
  }

  return ctx as UseSlottedContextReturn<T>;
}
