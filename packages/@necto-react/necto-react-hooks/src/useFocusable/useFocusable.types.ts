/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FocusableDOMProps, FocusEvents } from '@necto-react/types';

export interface UseFocusableProps extends FocusableDOMProps, FocusEvents {
  isDisabled?: boolean;

  autoFocus?: boolean;
}

export interface UseFocusableReturn {}
