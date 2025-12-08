/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useCallback, useMemo } from 'react';

import type { UseClickProps, UseClickReturn } from './types';

/**
 * Provides click interaction for floating elements.
 * @param props - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useClick(props: UseClickProps): UseClickReturn {
  const {
    open,
    onOpenChange,
    enabled = true,
    toggle = true,
    event = 'click',
    ignoreMouse = true,
    keyboardHandlers = true
  } = props;

  const pointerTypeRef = useRef<string>('');
  const didKeyDownRef = useRef(false);

  const handleClick = useCallback(() => {
    if (ignoreMouse && pointerTypeRef.current === 'mouse') {
      return;
    }

    if (toggle) {
      onOpenChange(!open);
    } else if (!open) {
      onOpenChange(true);
    }
  }, [open, onOpenChange, toggle, ignoreMouse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!keyboardHandlers) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        didKeyDownRef.current = true;
      }
    },
    [keyboardHandlers]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (!keyboardHandlers) return;

      if ((e.key === 'Enter' || e.key === ' ') && didKeyDownRef.current) {
        didKeyDownRef.current = false;
        handleClick();
      }
    },
    [keyboardHandlers, handleClick]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerTypeRef.current = e.pointerType;
  }, []);

  const reference = useMemo(() => {
    if (!enabled) return {};

    const eventProps: Record<string, unknown> = {
      onPointerDown: handlePointerDown
    };

    if (event === 'click') {
      eventProps.onClick = handleClick;
    } else {
      eventProps.onMouseDown = handleClick;
    }

    if (keyboardHandlers) {
      eventProps.onKeyDown = handleKeyDown;
      eventProps.onKeyUp = handleKeyUp;
    }

    return eventProps;
  }, [
    enabled,
    event,
    handleClick,
    handlePointerDown,
    handleKeyDown,
    handleKeyUp,
    keyboardHandlers
  ]);

  return {
    reference,
    floating: {}
  };
}
