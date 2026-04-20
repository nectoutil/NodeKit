/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useFocus } from '@necto-react/hooks';
import { useFocusWithin } from '@necto-react/hooks';
import { useRef, useState, useCallback } from 'react';
import { useFocusVisibleListener } from '@necto-react/hooks';

import type {
  Modality,
  UseFocusRingReturn,
  UseFocusRingOptions
} from './useFocusRing.types';

// Current modality indications.
const currentModality: null | Modality = null;

/**
 * React hook that manages focus state and focus ring visibility for an element.
 *
 * @param {UseFocusRingOptions} [options] - Options to control focus ring behavior.
 * @returns {UseFocusRingReturn} An object containing focus state, focus visibility, and props to spread on the target element.
 */
export function useFocusRing(
  options: UseFocusRingOptions = {}
): UseFocusRingReturn {
  const { within = false, isTextInput = false, autoFocus = false } = options;
  const state = useRef({
    isFocused: autoFocus,
    isFocusVisible: autoFocus || currentModality !== 'pointer'
  });

  const [isFocused, setFocused] = useState(autoFocus);
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

  useFocusVisibleListener({
    fn: (focusVisible: boolean) => {
      state.current.isFocusVisible = focusVisible;
      updateFocusVisibleState();
    },
    deps: [],
    opts: { isTextInput }
  });

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
