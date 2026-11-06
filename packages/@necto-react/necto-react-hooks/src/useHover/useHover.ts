/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// oxlint-disable typescript/no-explicit-any -- Any is fine here as some stuff will not work without it.

import { isTest } from 'std-env';
import { useGlobalListeners } from '@necto-react/hooks';
import { getOwnerDocument, nodeContains } from '@necto/dom';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

import type { FocusableElement } from '@necto/types';
import type { PointerEvent, MouseEvent } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { UseHoverProps, UseHoverReturn } from './useHover.types';

/**
 * React hook that manages hover state and hover event handlers for an element.
 *
 * @param {UseHoverProps} [props] - Options to control hover behavior and event handlers.
 * @returns {UseHoverReturn} An object containing hover state and props to spread on the target element.
 */
export function useHover(props: UseHoverProps = {}): UseHoverReturn {
  const {
    isDisabled,
    onHoverEnd,
    onHoverStart,
    onHoverChange,
    openDelay = 0,
    closeDelay = 0
  } = props;

  const [isHovered, setHovered] = useState(false);

  const globalRef = useRef({
    hoverCount: 0,
    ignoreEmulated: false
  });

  const state = useRef({
    targets: new Set<Element>(),
    active: false,
    pointerType: '',
    ignoreEmulatedMouseEvents: false,
    ending: undefined as ReturnType<typeof setTimeout> | undefined,
    starting: undefined as ReturnType<typeof setTimeout> | undefined
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

    if (typeof document === 'undefined') {
      return;
    }

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
          document.removeEventListener('pointerup', handleGlobalPointerEvent as any);
        } else if (isTest) {
          document.removeEventListener('touchend', setGlobalIgnoreEmulatedMouseEvents);
        }
      }
    };
  }, [setGlobalIgnoreEmulatedMouseEvents]);

  const scheduleEnd = useCallback(
    (target: Element | null, pointerType: string) => {
      clearTimeout(state.starting);
      state.starting = undefined;
      clearTimeout(state.ending);

      state.ending = setTimeout(() => {
        state.ending = undefined;

        if (state.targets.size > 0) {
          return;
        }

        removeAllGlobalListeners();

        if (!state.active) {
          state.pointerType = '';
          return;
        }

        state.active = false;
        state.pointerType = '';

        onHoverEnd?.({
          // @ts-expect-error -- synthetic hover event shape is not assignable to the base event type
          type: 'hovered',
          target,
          pointerType
        });

        onHoverChange?.(false);
        setHovered(false);
      }, closeDelay);
    },
    [closeDelay, onHoverEnd, onHoverChange, removeAllGlobalListeners, state]
  );

  const triggerHoverEnd = useCallback(
    (event: PointerEvent | MouseEvent, pointerType: string) => {
      if (pointerType === 'touch') {
        return;
      }

      state.targets.delete(event.currentTarget as Element);

      if (state.targets.size > 0) {
        return;
      }

      scheduleEnd(event.currentTarget as Element, pointerType);
    },
    [scheduleEnd, state]
  );

  // oxlint-disable-next-line react-hooks/exhaustive-deps -- triggerHoverEnd is declared below and referenced lazily at call time; listing it in deps would cause a TDZ ReferenceError.
  const triggerHoverStart = useCallback(
    (event: PointerEvent | MouseEvent, pointerType: string) => {
      if (
        isDisabled ||
        pointerType === 'touch' ||
        !(event.currentTarget && (event.currentTarget as Element).contains(event.target as Node))
      ) {
        return;
      }

      clearTimeout(state.ending);
      state.ending = undefined;

      const entered = event.currentTarget as Element;
      const first = state.targets.size === 0;

      state.targets.add(entered);
      state.pointerType = pointerType;

      if (!first || state.active || state.starting) {
        return;
      }

      const hoverDoc: Document = getOwnerDocument(
        event.target instanceof Element ? event.target : null
      );

      if (hoverDoc) {
        addGlobalListener(
          hoverDoc,
          'pointerover',
          (event: Event) => {
            const inside = [...state.targets].some((target) =>
              nodeContains(target, event.target as Element)
            );

            if (state.targets.size > 0 && !inside) {
              state.targets.clear();
              scheduleEnd(entered, (event as unknown as PointerEvent).pointerType);
            }
          },
          {
            capture: true
          }
        );
      }

      const begin = () => {
        state.starting = undefined;
        state.active = true;

        onHoverStart?.({
          // @ts-expect-error -- synthetic hover event shape is not assignable to the base event type
          type: 'hoverstart',
          target: entered,
          pointerType
        });

        onHoverChange?.(true);
        setHovered(true);
      };

      if (openDelay > 0) {
        state.starting = setTimeout(begin, openDelay);

        return;
      }

      begin();
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- triggerHoverEnd is declared below and referenced lazily; adding it would cause a TDZ ReferenceError
    [isDisabled, onHoverStart, onHoverChange, addGlobalListener, state]
  );

  const hoverProps: DOMAttributes<FocusableElement> = useMemo(() => {
    const hoverAttrs: DOMAttributes = {};

    if (typeof PointerEvent !== 'undefined') {
      hoverAttrs.onPointerEnter = (event: PointerEvent<Element>) => {
        if (globalRef.current.ignoreEmulated && event.pointerType === 'mouse') return;
        triggerHoverStart(event as unknown as PointerEvent, event.pointerType);
      };

      hoverAttrs.onPointerLeave = (event: PointerEvent<Element>) => {
        if (
          !isDisabled &&
          event.currentTarget instanceof Element &&
          event.currentTarget.contains(event.target as Node)
        ) {
          triggerHoverEnd(event as unknown as PointerEvent, event.pointerType);
        }
      };
    } else if (isTest) {
      hoverAttrs.onTouchStart = () => {
        state.ignoreEmulatedMouseEvents = true;
      };

      hoverAttrs.onMouseEnter = (event: MouseEvent<Element>) => {
        if (!state.ignoreEmulatedMouseEvents && !globalRef.current.ignoreEmulated) {
          triggerHoverStart(event.nativeEvent as unknown as MouseEvent, 'mouse');
        }

        state.ignoreEmulatedMouseEvents = false;
      };

      hoverAttrs.onMouseLeave = (event: MouseEvent<Element>) => {
        if (!isDisabled && event.currentTarget.contains(event.target as Node)) {
          triggerHoverEnd(event.nativeEvent as unknown as MouseEvent, 'mouse');
        }
      };
    }

    return hoverAttrs;
  }, [isDisabled, triggerHoverStart, triggerHoverEnd, state]);

  useEffect(() => {
    if (isDisabled && (state.active || state.targets.size > 0)) {
      const [target] = state.targets;

      state.targets.clear();
      scheduleEnd(target ?? null, state.pointerType);
    }
  }, [isDisabled, scheduleEnd, state]);

  useEffect(
    () => () => {
      clearTimeout(state.starting);
      clearTimeout(state.ending);
    },
    [state]
  );

  return {
    isHovered,
    hoverProps
  };
}
