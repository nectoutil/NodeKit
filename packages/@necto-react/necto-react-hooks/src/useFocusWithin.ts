import { useCallback, useRef } from 'react';
import { useGlobalListeners } from './useGlobalListeners';
import { useSyntheticBlurEvent } from './useSyntheticBlurEvent';
import { createSyntheticEvent } from '@necto-react/helpers';
import {
  getActiveElement,
  getEventTarget,
  getOwnerDocument,
  nodeContains
} from '@necto/dom';

import type { DOMAttributes } from '@necto-react/types';
import type { FocusEvent as ReactFocusEvent } from 'react';

export interface FocusWithinProps {
  isDisabled?: boolean;
  onFocusWithin?: (e: ReactFocusEvent) => void;
  onBlurWithin?: (e: ReactFocusEvent) => void;
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

export interface FocusWithinResult {
  focusWithinProps: DOMAttributes;
}

export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  const { isDisabled, onFocusWithin, onBlurWithin, onFocusWithinChange } =
    props;
  const state = useRef({ isFocusWithin: false });
  const { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();

  const onBlur = useCallback(
    (event: ReactFocusEvent) => {
      if (!event.currentTarget.contains(event.target)) return;

      if (
        state.current.isFocusWithin &&
        !(event.currentTarget as Element).contains(
          event.relatedTarget as Element
        )
      ) {
        state.current.isFocusWithin = false;
        removeAllGlobalListeners();

        if (onBlurWithin) onBlurWithin(event);
        if (onFocusWithinChange) onFocusWithinChange(false);
      }
    },
    [onBlurWithin, onFocusWithinChange, removeAllGlobalListeners]
  );

  const onSyntheticFocus = useSyntheticBlurEvent({ onBlur });
  const onFocus = useCallback(
    (event: ReactFocusEvent) => {
      if (!event.currentTarget.contains(event.target)) return;

      const ownerDocument = getOwnerDocument(event.target);
      const activeElement = getActiveElement(ownerDocument);

      if (
        !state.current.isFocusWithin &&
        activeElement === getEventTarget(event.nativeEvent)
      ) {
        if (onFocusWithin) onFocusWithin(event);
        if (onFocusWithinChange) onFocusWithinChange(true);

        state.current.isFocusWithin = true;
        onSyntheticFocus(event);

        const currentTarget = event.currentTarget;
        addGlobalListener(
          ownerDocument,
          'focus',
          (e) => {
            if (
              state.current.isFocusWithin &&
              !nodeContains(currentTarget, e.target as Element)
            ) {
              const nativeEvent = new ownerDocument.defaultView!.FocusEvent(
                'blur',
                { relatedTarget: e.target }
              );
              Object.defineProperty(nativeEvent, 'target', {
                value: currentTarget
              });
              Object.defineProperty(nativeEvent, 'currentTarget', {
                value: currentTarget
              });
              const event = createSyntheticEvent<ReactFocusEvent>(nativeEvent);
              onBlur(event);
            }
          },
          { capture: true }
        );
      }
    },
    [
      onFocusWithin,
      onFocusWithinChange,
      onSyntheticFocus,
      addGlobalListener,
      onBlur
    ]
  );

  if (isDisabled) {
    return {
      focusWithinProps: {
        onFocus: undefined,
        onBlur: undefined
      } as DOMAttributes
    };
  }

  return {
    focusWithinProps: {
      onFocus,
      onBlur
    } as unknown as DOMAttributes
  };
}
