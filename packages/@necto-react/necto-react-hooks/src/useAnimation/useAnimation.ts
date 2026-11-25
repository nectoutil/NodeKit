/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { flushSync } from 'react-dom';
import { useCallback, useLayoutEffect, useState } from 'react';

import type { RefObject } from 'react';
import type { UseAnimationOptions, UseAnimationReturn } from './useAnimation.types';

export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
  const { ref, isOpen, isReady = true } = options;

  const [isEntering, setEntering] = useState(isOpen);
  const isAnimationReady: boolean = isEntering && isReady;

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

  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen && !wasOpen) {
    setEntering(true);
    setWasOpen(true);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  const [exitState, setExitState] = useState<'closed' | 'open' | 'exiting'>(
    isOpen ? 'open' : 'closed'
  );

  switch (exitState) {
    case 'open': {
      if (!isOpen) {
        setExitState('exiting');
      }

      break;
    }

    case 'closed':
    case 'exiting': {
      if (isOpen) {
        setExitState('open');
      }

      break;
    }
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
    isExiting,
    isEntering: isAnimationReady,
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
      if (!('getAnimations' in ref.current)) {
        onEnd();
        return;
      }

      const animations: Array<Animation> = ref.current.getAnimations();
      if (animations.length === 0) {
        onEnd();
        return;
      }

      let canceled: boolean = false;
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
