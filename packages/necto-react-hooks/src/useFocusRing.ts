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

export function useFocusRing({
  within = false,
  isTextInput = false,
  autoFocus = false,
}: FocusRingProps = {}): FocusRingResult {
  const state = useRef({
    isFocused: false,
    isFocusVisible: autoFocus || currentModality !== 'pointer',
  });

  const [isFocused, setFocused] = useState(false);
  const [isFocusVisible, setFocusVisible] = useState(() => state.current.isFocused && state.current.isFocusVisible);

  const updateFocusVisibleState = useCallback(() => {
    setFocusVisible(state.current.isFocused && state.current.isFocusVisible);
  }, []);

  const handleFocusChange = useCallback(
    (focused: boolean) => {
      state.current.isFocused = focused;
      setFocused(focused);
      updateFocusVisibleState();
    },
    [updateFocusVisibleState]
  );

  useFocusVisibleListener(
    (focusVisible) => {
      state.current.isFocusVisible = focusVisible;
      updateFocusVisibleState();
    },
    [],
    { isTextInput }
  );

  const { focusProps } = useFocus({
    isDisabled: within,
    onFocusChange: handleFocusChange,
  });

  const { focusWithinProps } = useFocusWithin({
    isDisabled: !within,
    onFocusWithinChange: handleFocusChange,
  });

  return {
    isFocused,
    isFocusVisible,
    focusProps: within ? focusWithinProps : focusProps,
  };
}