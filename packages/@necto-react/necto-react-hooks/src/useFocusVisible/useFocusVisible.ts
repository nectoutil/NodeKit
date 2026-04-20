/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getInteractionModality,
  useFocusVisibleListener
} from '@necto-react/hooks';
import { useState } from 'react';

import type {
  UseFocusVisibleReturn,
  UseFocusVisibleOptions
} from './useFocusVisible.types';

/**
 * React hook that provides focus visibility tracking.
 *
 * @param {UseFocusVisibleOptions} [options] - Options for focus visibility behavior.
 * @returns {UseFocusVisibleReturn} An object containing the focus visibility state.
 */
export function useFocusVisible(
  options: UseFocusVisibleOptions = {}
): UseFocusVisibleReturn {
  const { isTextInput, autoFocus } = options;
  const [isFocusVisibleState, setFocusVisible] = useState(
    autoFocus || getInteractionModality() !== 'pointer'
  );

  useFocusVisibleListener({
    fn: (isFocusVisible: boolean) => setFocusVisible(isFocusVisible),
    deps: [isTextInput],
    opts: { isTextInput }
  });

  return { isFocusVisible: isFocusVisibleState };
}
