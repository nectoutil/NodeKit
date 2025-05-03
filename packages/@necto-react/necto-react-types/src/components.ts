/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ForwardedRef, ReactNode } from "react";

export type SlottedContextValue<T, E = never> =
  | (T & {
      slots?: Record<string | symbol, T>,
      ref?: E extends never ? never : ForwardedRef<E>
    })
  | null
  | undefined;
