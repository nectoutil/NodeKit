/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { useState } from "react";
import { useFocusVisibleListener, getInteractionModality } from "./useFocusVisibleListener";

export interface FocusVisibleProps {
  isTextInput?: boolean;
  autoFocus?: boolean;
}

export interface FocusVisibleResult {
  isFocusVisible: boolean;
}


export function isFocusVisible(): boolean {
  return getInteractionModality() !== 'pointer';
}

export function useFocusVisible(props: FocusVisibleProps = {}): FocusVisibleResult {
  let { isTextInput, autoFocus } = props;
  let [isFocusVisibleState, setFocusVisible] = useState(autoFocus || isFocusVisible());
  useFocusVisibleListener((isFocusVisible) => {
    setFocusVisible(isFocusVisible);
  }, [isTextInput], { isTextInput });

  return { isFocusVisible: isFocusVisibleState };
}