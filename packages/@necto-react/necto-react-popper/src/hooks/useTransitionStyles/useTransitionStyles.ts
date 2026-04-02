/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTransitionStatus } from '../useTransitionStatus';

import type { CSSProperties } from 'react';
import type {
  UseTransitionStylesOptions,
  UseTransitionStylesReturn
} from './useTransitionStyles.types';

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
    closeStyles,
    common = {},
    duration = 250,
    initial = { opacity: 0 },
    openStyles = { opacity: 1 }
  } = options;

  const { isMounted, status } = useTransitionStatus({ open, duration });

  const styles: CSSProperties = ((): CSSProperties => {
    const transitionProperties: string = [
      ...new Set([
        ...Object.keys(initial),
        ...Object.keys(openStyles),
        ...Object.keys(closeStyles ?? {})
      ])
    ]
      .filter(
        (key) => key !== 'transitionProperty' && key !== 'transitionDuration'
      )
      .join(', ');

    const baseTransition = {
      transitionProperty: transitionProperties || 'opacity',
      transitionDuration: `${status === 'close' ? (typeof duration === 'number' ? duration : (duration.close ?? 250)) : typeof duration === 'number' ? duration : (duration.open ?? 250)}ms`
    };

    switch (status) {
      case 'initial': {
        return { ...common, ...baseTransition, ...initial };
      }
      case 'open': {
        return { ...common, ...baseTransition, ...openStyles };
      }
      case 'close': {
        return { ...common, ...baseTransition, ...(closeStyles ?? initial) };
      }
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
