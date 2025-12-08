/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';

import type { ElementProps } from '../types';
import type { InteractionReturn, UseInteractionsReturn } from './types';

/**
 * Merges multiple interaction hooks into unified prop getters.
 * @param interactions - Array of interaction hook results.
 * @returns Prop getter functions for reference, floating, and item elements.
 */
export function useInteractions(
  interactions: Array<InteractionReturn | undefined | null> = []
): UseInteractionsReturn {
  const filteredInteractions = interactions.filter(
    Boolean
  ) as InteractionReturn[];

  const mergeProps = useMemo(() => {
    return (
      key: 'reference' | 'floating' | 'item',
      userProps?: ElementProps
    ): ElementProps => {
      const merged: ElementProps = { ...userProps };

      for (const interaction of filteredInteractions) {
        const props = interaction[key];
        if (!props) continue;

        for (const [propKey, propValue] of Object.entries(props)) {
          if (propKey === 'ref') {
            const existingRef = merged.ref;
            if (existingRef) {
              merged.ref = (node: Element | null) => {
                if (typeof existingRef === 'function') existingRef(node);
                if (typeof propValue === 'function') propValue(node);
              };
            } else {
              merged.ref = propValue;
            }
          } else if (
            propKey.startsWith('on') &&
            typeof propValue === 'function'
          ) {
            const existingHandler = merged[propKey];
            if (typeof existingHandler === 'function') {
              merged[propKey] = (...args: unknown[]) => {
                (propValue as Function)(...args);
                (existingHandler as Function)(...args);
              };
            } else {
              merged[propKey] = propValue;
            }
          } else {
            merged[propKey] = propValue;
          }
        }
      }

      return merged;
    };
  }, [filteredInteractions]);

  const getReferenceProps = useMemo(() => {
    return (userProps?: ElementProps) => mergeProps('reference', userProps);
  }, [mergeProps]);

  const getFloatingProps = useMemo(() => {
    return (userProps?: ElementProps) => mergeProps('floating', userProps);
  }, [mergeProps]);

  const getItemProps = useMemo(() => {
    return (userProps?: ElementProps) => mergeProps('item', userProps);
  }, [mergeProps]);

  return {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  };
}
