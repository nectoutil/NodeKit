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

import { useState } from 'react';
import { getInteractionModality, useFocusVisibleListener } from '@necto-react/hooks';

import type { UseFocusVisibleProps, UseFocusVisibleReturn } from './useFocusVisible.types';

/**
 * React hook that provides focus visibility tracking.
 *
 * @param {UseFocusVisibleProps} [props] - Options for focus visibility behavior.
 * @returns {UseFocusVisibleReturn} An object containing the focus visibility state.
 */
export function useFocusVisible(props: UseFocusVisibleProps = {}): UseFocusVisibleReturn {
  const { isTextInput, autoFocus } = props;
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