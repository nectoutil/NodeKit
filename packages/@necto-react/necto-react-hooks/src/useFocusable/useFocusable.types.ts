/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FocusableDOMProps, FocusEvents } from '@necto-react/types';

/**
 * Options for the useFocusable hook.
 */
export interface UseFocusableOptions extends FocusableDOMProps, FocusEvents {
  isDisabled?: boolean;

  autoFocus?: boolean;
}

export type UseFocusableReturn = Readonly<{
  focusableProps: Record<string, any>;
}>;
