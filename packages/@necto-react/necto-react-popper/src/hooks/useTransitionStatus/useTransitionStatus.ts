/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocalState } from '@necto-react/state';
import { useIsomorphicLayoutEffect } from '@necto-react/hooks';

import type {
  TransitionStatus,
  UseTransitionStatusReturn,
  UseTransitionStatusOptions
} from './useTransitionStatus.types';

/**
 * Provides transition status for animating floating elements.
 * @param options - Configuration options.
 * @returns Mounted state and current transition status.
 */
export function useTransitionStatus(
  options: UseTransitionStatusOptions
): UseTransitionStatusReturn {
  const { open, duration = 250 } = options;

  const closeDuration: number =
    typeof duration === 'number' ? duration : (duration.close ?? 250);

  const [status, setStatus] = useLocalState<TransitionStatus>('unmounted');
  const [isMounted, setIsMounted] = useLocalState(false);

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

      return (): void => clearTimeout(timeout);
    }
  }, [open, closeDuration, isMounted]);

  return {
    isMounted,
    status
  };
}
