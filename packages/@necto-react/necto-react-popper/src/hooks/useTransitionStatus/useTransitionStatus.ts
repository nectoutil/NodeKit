/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useLayoutEffect } from 'react';

import type {
  UseTransitionStatusOptions,
  UseTransitionStatusReturn,
  UseTransitionStylesOptions,
  UseTransitionStylesReturn,
  TransitionStatus
} from './types';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Provides transition status for animating floating elements.
 * @param options - Configuration options.
 * @returns Mounted state and current transition status.
 */
export function useTransitionStatus(
  options: UseTransitionStatusOptions
): UseTransitionStatusReturn {
  const { open, duration = 250 } = options;

  const closeDuration =
    typeof duration === 'number' ? duration : (duration.close ?? 250);

  const [status, setStatus] = useState<TransitionStatus>('unmounted');
  const [isMounted, setIsMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (open) {
      setIsMounted(true);
      setStatus('initial');

      const frame = requestAnimationFrame(() => {
        setStatus('open');
      });

      return () => cancelAnimationFrame(frame);
    } else if (isMounted) {
      setStatus('close');

      const timeout = setTimeout(() => {
        setStatus('unmounted');
        setIsMounted(false);
      }, closeDuration);

      return () => clearTimeout(timeout);
    }
  }, [open, closeDuration, isMounted]);

  return {
    isMounted,
    status
  };
}

/**
 * Provides transition styles for animating floating elements.
 * @param options - Configuration options including style definitions.
 * @returns Mounted state, status, and computed styles.
 */
export function useTransitionStyles(
  options: UseTransitionStylesOptions
): UseTransitionStylesReturn {
  const {
    open,
    duration = 250,
    initial = { opacity: 0 },
    openStyles = { opacity: 1 },
    closeStyles,
    common = {}
  } = options;

  const openDuration =
    typeof duration === 'number' ? duration : (duration.open ?? 250);
  const closeDuration =
    typeof duration === 'number' ? duration : (duration.close ?? 250);

  const { isMounted, status } = useTransitionStatus({ open, duration });

  const styles = (() => {
    const baseTransition = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${status === 'close' ? closeDuration : openDuration}ms`
    };

    switch (status) {
      case 'initial':
        return { ...common, ...baseTransition, ...initial };
      case 'open':
        return { ...common, ...baseTransition, ...openStyles };
      case 'close':
        return { ...common, ...baseTransition, ...(closeStyles ?? initial) };
      default:
        return common;
    }
  })();

  return {
    isMounted,
    status,
    styles
  };
}
