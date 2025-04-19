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

import { isTest } from 'std-env';
import { useGlobalListeners } from './useGlobalListeners';
import { getOwnerDocument, nodeContains } from "@necto/dom";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import type { PointerEvent, MouseEvent } from 'react';
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

export function useHover(props: HoverProps): HoverResult {
  const { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props;

  const [isHovered, setHovered] = useState(false);
  const globalRef = useRef({ hoverCount: 0, ignoreEmulated: false });
  const state = useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: '',
    target: null as EventTarget | null,
  }).current;

  const { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();

  const setGlobalIgnoreEmulatedMouseEvents = useCallback(() => {
    globalRef.current.ignoreEmulated = true;
    setTimeout(() => {
      globalRef.current.ignoreEmulated = false;
    }, 50);
  }, []);

  useEffect(() => {
    const handleGlobalPointerEvent = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setGlobalIgnoreEmulatedMouseEvents();
      }
    };

    if (typeof document === 'undefined') return;

    const global = globalRef.current;
    global.hoverCount++;

    if (typeof PointerEvent !== 'undefined') {
      document.addEventListener('pointerup', handleGlobalPointerEvent);
    } else if (isTest) {
      document.addEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents);
    }

    return () => {
      global.hoverCount--;
      if (global.hoverCount === 0) {
        if (typeof PointerEvent !== 'undefined') {
          document.removeEventListener('pointerup', handleGlobalPointerEvent);
        } else if (isTest) {
          document.removeEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents);
        }
      }
    };
  }, [setGlobalIgnoreEmulatedMouseEvents]);

  const triggerHoverStart = useCallback(
    (event: PointerEvent | MouseEvent, pointerType: string) => {
      if (
        isDisabled ||
        pointerType === 'touch' ||
        state.isHovered ||
        !(event.currentTarget && (event.currentTarget as Element).contains(event.target as Node))
      ) {
        return;
      }

      state.isHovered = true;
      state.pointerType = pointerType;
      state.target = event.currentTarget;

      addGlobalListener(
        getOwnerDocument(event.target instanceof Element ? event.target : null),
        'pointerover',
        (e: Event) => {
          if (
            state.isHovered &&
            state.target &&
            !nodeContains(state.target as Element, e.target as Element)
          ) {
            triggerHoverEnd(e as unknown as PointerEvent, (e as unknown as PointerEvent).pointerType);
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
    (event: PointerEvent | MouseEvent, pointerType: string) => {
      if (pointerType === 'touch' || !state.isHovered || !state.target) {
        return;
      }

      state.isHovered = false;
      state.pointerType = '';
      state.target = null;

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
    const props: DOMAttributes = {};

    if (typeof PointerEvent !== 'undefined') {
      props.onPointerEnter = (e: PointerEvent<Element>) => {
        if (globalRef.current.ignoreEmulated && e.pointerType === 'mouse') return;
        triggerHoverStart(e as unknown as PointerEvent, e.pointerType);
      };

      props.onPointerLeave = (e: PointerEvent<Element>) => {
        if (!isDisabled && e.currentTarget instanceof Element && e.currentTarget.contains(e.target as Node)) {
          triggerHoverEnd(e as unknown as PointerEvent, e.pointerType);
        }
      };
    } else if (isTest) {
      props.onTouchStart = () => {
        state.ignoreEmulatedMouseEvents = true;
      };

      props.onMouseEnter = (e: MouseEvent<Element>) => {
        if (!state.ignoreEmulatedMouseEvents && !globalRef.current.ignoreEmulated) {
          triggerHoverStart(e.nativeEvent as unknown as MouseEvent, 'mouse');
        }
        state.ignoreEmulatedMouseEvents = false;
      };

      props.onMouseLeave = (e: MouseEvent<Element, MouseEvent>) => {
        if (!isDisabled && e.currentTarget.contains(e.target as Node)) {
          triggerHoverEnd(e.nativeEvent, 'mouse');
        }
      };
    }

    return props;
  }, [isDisabled, triggerHoverStart, triggerHoverEnd]);

  useEffect(() => {
    if (isDisabled && state.isHovered) {
      triggerHoverEnd({ currentTarget: state.target } as PointerEvent, state.pointerType);
    }
  }, [isDisabled, triggerHoverEnd]);

  return { hoverProps, isHovered };
}