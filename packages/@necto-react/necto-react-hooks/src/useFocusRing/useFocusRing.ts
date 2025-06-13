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

import { useFocus } from '../useFocus';
import { useFocusWithin } from '../useFocusWithin';
import { useRef, useState, useCallback } from 'react';
import { useFocusVisibleListener } from '../useFocusVisibleListener';

import type { UseFocusRingProps, UseFocusRingReturn, Modality } from './types';

/**
 * React hook that manages focus state and focus ring visibility for an element.
 *
 * @param {UseFocusRingProps} [props] - Options to control focus ring behavior.
 * @returns {UseFocusRingReturn} An object containing focus state, focus visibility, and props to spread on the target element.
 */
export function useFocusRing(
  props: UseFocusRingProps = {}
): UseFocusRingReturn {
  const { within = false, isTextInput = false, autoFocus = false } = props;
  const currentModality: null | Modality = null;
  const state = useRef({
    isFocused: false,
    isFocusVisible: autoFocus || currentModality !== 'pointer'
  });

  const [isFocused, setFocused] = useState(false);
  const [isFocusVisible, setFocusVisible] = useState(
    () => state.current.isFocused && state.current.isFocusVisible
  );

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

  const { focusProps = {} } =
    useFocus({
      isDisabled: within,
      onFocusChange: handleFocusChange
    }) || {};

  const { focusWithinProps = {} } =
    useFocusWithin({
      isDisabled: !within,
      onFocusWithinChange: handleFocusChange
    }) || {};

  return {
    isFocused,
    isFocusVisible,
    focusProps: within ? focusWithinProps : focusProps
  };
}
