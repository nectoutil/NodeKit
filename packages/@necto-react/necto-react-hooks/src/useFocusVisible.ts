import { useState } from 'react';
import {
  useFocusVisibleListener,
  getInteractionModality
} from './useFocusVisibleListener';

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

export function useFocusVisible(
  props: FocusVisibleProps = {}
): FocusVisibleResult {
  const { isTextInput, autoFocus } = props;
  const [isFocusVisibleState, setFocusVisible] = useState(
    autoFocus || isFocusVisible()
  );
  useFocusVisibleListener(
    (isFocusVisible) => {
      setFocusVisible(isFocusVisible);
    },
    [isTextInput],
    { isTextInput }
  );

  return { isFocusVisible: isFocusVisibleState };
}
