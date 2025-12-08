/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffectEvent } from '@necto-react/hooks';
import { useRef, useState, useEffect } from 'react';

import type { RefObject } from 'react';
import type {
  UseScrollLockOptions,
  UseScrollLockReturn
} from './useScrollLock.types';

/**
 * React hook that locks scrolling on a target element or the entire page.
 *
 * @param {UseScrollLockOptions} [options] - Options to configure scroll lock behavior.
 * @returns {UseScrollLockReturn} An object with isLocked state and lock/unlock functions.
 */
export function useScrollLock(
  options: UseScrollLockOptions = {}
): UseScrollLockReturn {
  const { autoLock = false, target: targetProp, widthReflow = true } = options;

  const [isLocked, setIsLocked] = useState(false);
  const target: RefObject<HTMLElement | null> = useRef<HTMLElement | null>(
    null
  );
  const originalStyle = useRef<{
    overflow: string;
    paddingRight: string;
  } | null>(null);

  const lock = useEffectEvent((): void => {
    if (typeof window === 'undefined' || !target.current) return;

    const { overflow, paddingRight } = target.current.style;

    originalStyle.current = { overflow, paddingRight };

    if (widthReflow) {
      const offsetWidth =
        target.current === document.body
          ? window.innerWidth
          : target.current.offsetWidth;

      const currentPaddingRight: number =
        parseInt(window.getComputedStyle(target.current).paddingRight, 10) || 0;

      const scrollbarWidth: number = offsetWidth - target.current.scrollWidth;
      target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`;
    }

    target.current.style.overflow = 'hidden';

    setIsLocked(true);
  });

  const unlock = useEffectEvent((): void => {
    if (target.current && originalStyle.current) {
      target.current.style.overflow = originalStyle.current.overflow;

      if (widthReflow) {
        target.current.style.paddingRight = originalStyle.current.paddingRight;
      }
    }

    setIsLocked(false);
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;

    if (targetProp) {
      target.current =
        typeof targetProp === 'string'
          ? document.querySelector(targetProp)
          : targetProp;
    }

    if (!target.current) {
      target.current = document.body;
    }

    if (autoLock) {
      lock();
    }

    return (): void => {
      unlock();
    };
  }, [autoLock, targetProp, widthReflow, lock, unlock]);

  return { isLocked, lock, unlock };
}
