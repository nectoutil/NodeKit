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

import { flushSync } from 'react-dom';
import { useCallback, useLayoutEffect, useState } from 'react';

import type { RefObject } from 'react';
import type {
  UseAnimationOptions,
  UseAnimationReturn
} from './useAnimation.types';

/**
 * Manages enter and exit CSS animations/transitions on a ref element.
 *
 * - When `isOpen` becomes `true`, the element enters an entering phase until all animations finish.
 * - When `isOpen` becomes `false`, the element enters an exiting phase and stays mounted until all animations complete.
 * - `isRendered` indicates whether the element should remain in the DOM (open or still exiting).
 */
export function useAnimation(
  options: UseAnimationOptions
): UseAnimationReturn {
  const { ref, isOpen, isReady = true } = options;

  // --- Enter animation ---
  const [isEntering, setEntering] = useState(isOpen);
  const isAnimationReady: boolean = isEntering && isReady;

  // Cancel premature CSS transitions that fired before the entering state was cleared.
  // This can happen when isReady starts as false (e.g. popovers before placement calculation).
  useLayoutEffect(() => {
    if (isAnimationReady && ref.current && 'getAnimations' in ref.current) {
      for (const animation of ref.current.getAnimations()) {
        if (animation instanceof CSSTransition) {
          animation.cancel();
        }
      }
    }
  }, [ref, isAnimationReady]);

  useAnimationEnd(
    ref,
    isAnimationReady,
    useCallback(() => setEntering(false), [])
  );

  // Re-trigger enter animation when isOpen transitions from false to true.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen && !wasOpen) {
    setEntering(true);
    setWasOpen(true);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  // --- Exit animation ---
  const [exitState, setExitState] = useState<'closed' | 'open' | 'exiting'>(
    isOpen ? 'open' : 'closed'
  );

  switch (exitState) {
    case 'open':
      if (!isOpen) {
        setExitState('exiting');
      }
      break;
    case 'closed':
    case 'exiting':
      if (isOpen) {
        setExitState('open');
      }
      break;
  }

  const isExiting: boolean = exitState === 'exiting';

  useAnimationEnd(
    ref,
    isExiting,
    useCallback(() => {
      setExitState((state) => (state === 'exiting' ? 'closed' : state));
    }, [])
  );

  return {
    isEntering: isAnimationReady,
    isExiting,
    isRendered: isOpen || isExiting
  };
}

/**
 * Internal helper that waits for all running CSS animations/transitions
 * on the ref element to finish, then calls `onEnd`.
 */
function useAnimationEnd(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEnd: () => void
): void {
  useLayoutEffect(() => {
    if (isActive && ref.current) {
      // JSDOM doesn't support getAnimations
      if (!('getAnimations' in ref.current)) {
        onEnd();
        return;
      }

      const animations = ref.current.getAnimations();
      if (animations.length === 0) {
        onEnd();
        return;
      }

      let canceled = false;
      Promise.all(animations.map((a) => a.finished))
        .then(() => {
          if (!canceled) {
            flushSync(() => {
              onEnd();
            });
          }
        })
        .catch(() => {});

      return () => {
        canceled = true;
      };
    }
  }, [ref, isActive, onEnd]);
}
