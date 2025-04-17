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

import { useGlobalListeners } from './useGlobalListeners';
import { getOwnerDocument, nodeContains } from "@necto/dom";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import type { DOMAttributes, HoverEvent } from '@necto-react/types';

export interface HoverProps extends HoverEvent {
  isDisabled?: boolean;
  onHoverStart?: (event: HoverEvent) => void;
  onHoverEnd?: (event: HoverEvent) => void;
  onHoverChange?: (isHovered: boolean) => void;
}

export interface HoverResult {
  hoverProps: DOMAttributes;
  isHovered: boolean;
}

// See https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/useHover.ts#L33C1-L38C1
// as well as https://bugs.webkit.org/show_bug.cgi?id=214609.
let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

export function setGlobalIgnoreEmulatedMouseEvents() {
  globalIgnoreEmulatedMouseEvents = true;

  setTimeout(() => {
    globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

export function useHover(props: HoverProps): HoverResult {
  const { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props;

  const [isHovered, setHovered] = useState(false);
  const state = useRef<{
    isHovered: boolean;
    ignoreEmulatedMouseEvents: boolean;
    pointerType: string;
    target: EventTarget | null;
  }>({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: '',
    target: null,
  });

  const { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();

  const triggerHoverStart = useCallback(
    (event: any, pointerType: string) => {
      const currentState = state.current;
      currentState.pointerType = pointerType;

      if (
        isDisabled ||
        pointerType === 'touch' ||
        currentState.isHovered ||
        !event.currentTarget.contains(event.target)
      ) {
        return;
      }

      currentState.isHovered = true;
      currentState.target = event.currentTarget;

      addGlobalListener(
        getOwnerDocument(event.target),
        'pointerover',
        (e: any) => {
          if (
            currentState.isHovered &&
            currentState.target &&
            !nodeContains(currentState.target, e.target as Element)
          ) {
            triggerHoverEnd(e, e.pointerType);
          }
        },
        { capture: true }
      );

      onHoverStart?.({
        type: 'hoverstart',
        target: event.currentTarget,
        pointerType,
      });

      onHoverChange?.(true);
      setHovered(true);
    },
    [isDisabled, onHoverStart, onHoverChange, addGlobalListener]
  );

  const triggerHoverEnd = useCallback(
    (event: any, pointerType: string) => {
      const currentState = state.current;

      if (pointerType === 'touch' || !currentState.isHovered || !currentState.target) {
        return;
      }

      currentState.isHovered = false;
      currentState.pointerType = '';
      currentState.target = null;

      removeAllGlobalListeners();

      onHoverEnd?.({
        type: 'hoverend',
        target: event.currentTarget,
        pointerType,
      });

      onHoverChange?.(false);
      setHovered(false);
    },
    [onHoverEnd, onHoverChange, removeAllGlobalListeners]
  );

  const hoverProps = useMemo(() => {
    const props: DOMAttributes = {
      onMouseLeave: () => {},
      onMouseEnter: () => {},
      onTouchStart: () => {},
      onPointerLeave: () => {},
      onPointerEnter: () => {},
    };

    if (typeof PointerEvent !== 'undefined') {
      props.onPointerEnter = (e: any) => {
        if (globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
        triggerHoverStart(e, e.pointerType);
      };
      props.onPointerLeave = (e: any) => {
        if (!isDisabled && e.currentTarget.contains(e.target as Element)) {
          triggerHoverEnd(e, e.pointerType);
        }
      };
    } else {
      props.onTouchStart = () => {
        state.current.ignoreEmulatedMouseEvents = true;
      };
      props.onMouseEnter = (e: any) => {
        if (
          !state.current.ignoreEmulatedMouseEvents &&
          !globalIgnoreEmulatedMouseEvents
        ) {
          triggerHoverStart(e, 'mouse');
        }
        state.current.ignoreEmulatedMouseEvents = false;
      };
      props.onMouseLeave = (e: any) => {
        if (!isDisabled && e.currentTarget.contains(e.target as Element)) {
          triggerHoverEnd(e, 'mouse');
        }
      };
    }

    return props;
  }, [isDisabled, triggerHoverStart, triggerHoverEnd]);

  useEffect(() => {
    if (isDisabled && state.current.isHovered) {
      triggerHoverEnd({ currentTarget: state.current.target }, state.current.pointerType);
    }
  }, [isDisabled, triggerHoverEnd]);

  return { hoverProps, isHovered };
}