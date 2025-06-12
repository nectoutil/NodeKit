// biome-ignore-all lint/suspicious/noExplicitAny: Any is fine here as some stuff will not work without it.

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

import { isTest } from 'std-env';
import { useGlobalListeners } from '../useGlobalListeners';
import { getOwnerDocument, nodeContains } from '@necto/dom';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

import type { PointerEvent, MouseEvent } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { UseHoverProps, UseHoverReturn } from './types';

export function useHover(props: UseHoverProps = {}): UseHoverReturn {
  const { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props;

  const [isHovered, setHovered] = useState(false);
  const globalRef = useRef({ hoverCount: 0, ignoreEmulated: false });
  const state = useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: '',
    target: null as EventTarget | null
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
      document.addEventListener('pointerup', handleGlobalPointerEvent as any);
    } else if (isTest) {
      document.addEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents);
    }

    return () => {
      global.hoverCount--;
      if (global.hoverCount === 0) {
        if (typeof PointerEvent !== 'undefined') {
          document.removeEventListener(
            'pointerup',
            handleGlobalPointerEvent as any
          ); // cast to any for compiler errors
        } else if (isTest) {
          document.removeEventListener(
            'touchend',
            setGlobalIgnoreEmulatedMouseEvents
          );
        }
      }
    };
  }, [setGlobalIgnoreEmulatedMouseEvents]);

  // --- Trigger Hover Start Handler ---
  const triggerHoverStart = useCallback(
    (event: PointerEvent | MouseEvent, pointerType: string) => {
      if (
        isDisabled ||
        pointerType === 'touch' ||
        state.isHovered ||
        !(
          event.currentTarget &&
          (event.currentTarget as Element).contains(event.target as Node)
        )
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
            triggerHoverEnd(
              e as unknown as PointerEvent,
              (e as unknown as PointerEvent).pointerType
            );
          }
        },
        { capture: true }
      );

      onHoverStart?.({
        // @ts-ignore
        type: 'hoverstart',
        target: event.currentTarget,
        pointerType
      });

      onHoverChange?.(true);
      setHovered(true);
    },
    [isDisabled, onHoverStart, onHoverChange, addGlobalListener, state]
  );

  // --- Trigger Hover End Handler ---
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
        // @ts-ignore
        type: 'hoverend',
        target: event.currentTarget,
        pointerType
      });

      onHoverChange?.(false);
      setHovered(false);
    },
    // This might cause shit to break, Biome was bitching at me so I added these dependencies.
    [onHoverEnd, onHoverChange, removeAllGlobalListeners, state.target, state]
  );

  const hoverProps = useMemo(() => {
    const props: DOMAttributes = {};

    if (typeof PointerEvent !== 'undefined') {
      props.onPointerEnter = (e: PointerEvent<Element>) => {
        if (globalRef.current.ignoreEmulated && e.pointerType === 'mouse')
          return;
        triggerHoverStart(e as unknown as PointerEvent, e.pointerType);
      };

      props.onPointerLeave = (e: PointerEvent<Element>) => {
        if (
          !isDisabled &&
          e.currentTarget instanceof Element &&
          e.currentTarget.contains(e.target as Node)
        ) {
          triggerHoverEnd(e as unknown as PointerEvent, e.pointerType);
        }
      };
    } else if (isTest) {
      props.onTouchStart = () => {
        state.ignoreEmulatedMouseEvents = true;
      };

      props.onMouseEnter = (e: MouseEvent<Element>) => {
        if (
          !state.ignoreEmulatedMouseEvents &&
          !globalRef.current.ignoreEmulated
        ) {
          triggerHoverStart(e.nativeEvent as unknown as MouseEvent, 'mouse');
        }
        state.ignoreEmulatedMouseEvents = false;
      };

      props.onMouseLeave = (e: MouseEvent<Element>) => {
        if (!isDisabled && e.currentTarget.contains(e.target as Node)) {
          triggerHoverEnd(e.nativeEvent as unknown as MouseEvent, 'mouse');
        }
      };
    }

    return props;
  }, [isDisabled, triggerHoverStart, triggerHoverEnd, state]);

  useEffect(() => {
    if (isDisabled && state.isHovered) {
      triggerHoverEnd(
        { currentTarget: state.target } as PointerEvent,
        state.pointerType
      );
    }
  }, [
    isDisabled,
    triggerHoverEnd,
    state.isHovered,
    state.pointerType,
    state.target
  ]);

  return { hoverProps, isHovered };
}
