/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions of this code are based on the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications have been made to adapt the code for use in this project.
 */

'use strict';

import { useFocus } from './useFocus';
import { useFocusWithin } from './useFocusWithin';
import { useCallback, useRef, useState } from 'react';
import { useFocusVisibleListener } from "./useFocusVisibleListener";

import type { DOMAttributes } from '@necto-react/types';

export type Modality = 'keyboard' | 'pointer' | 'virtual';
let currentModality: null | Modality = null;

export interface FocusRingProps {
  within?: boolean;
  isTextInput?: boolean;
  autoFocus?: boolean;
}

export interface FocusRingResult {
  isFocused: boolean;
  isFocusVisible: boolean;
  focusProps: DOMAttributes;
}

export function useFocusRing(props: FocusRingProps = {}): FocusRingResult {
  let {
    autoFocus = false,
    isTextInput,
    within
  } = props;

  let state = useRef({
    isFocused: false,
    isFocusVisible: autoFocus || currentModality !== 'pointer'
  });
  let [isFocused, setFocused] = useState(false);
  let [isFocusVisibleState, setFocusVisible] = useState(() => state.current.isFocused && state.current.isFocusVisible);

  let updateState = useCallback(() => setFocusVisible(state.current.isFocused && state.current.isFocusVisible), []);

  let onFocusChange = useCallback((isFocused: boolean): void => {
    state.current.isFocused = isFocused;
    setFocused(isFocused);
    updateState();
  }, [updateState]);

  useFocusVisibleListener((isFocusVisible) => {
    state.current.isFocusVisible = isFocusVisible;
    updateState();
  }, [], {isTextInput});

  let {focusProps} = useFocus({
    isDisabled: within,
    onFocusChange
  });

  let {focusWithinProps} = useFocusWithin({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });

  return {
    isFocused,
    isFocusVisible: isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}