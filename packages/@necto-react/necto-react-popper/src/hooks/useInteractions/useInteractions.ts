/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { mergeProps, mergeRefs } from '@necto/mergers';

import type {
  InteractionReturn,
  UseInteractionsReturn
} from './useInteractions.types';
import type { Ref } from 'react';
import type { ElementProps } from '../types';

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

  const buildProps = useMemo(() => {
    return (
      key: 'reference' | 'floating' | 'item',
      userProps?: ElementProps
    ): ElementProps => {
      const allProps = filteredInteractions
        .map((interaction) => interaction[key])
        .filter(Boolean) as ElementProps[];

      const refs = [userProps?.ref, ...allProps.map((p) => p.ref)].filter(
        Boolean
      ) as Ref<unknown>[];

      const merged = mergeProps(userProps ?? {}, ...allProps);

      if (refs.length > 0) {
        merged.ref = mergeRefs(...refs);
      }

      return merged;
    };
  }, [filteredInteractions]);

  const getReferenceProps = useMemo(() => {
    return (userProps?: ElementProps): ElementProps =>
      buildProps('reference', userProps);
  }, [buildProps]);

  const getFloatingProps = useMemo(() => {
    return (userProps?: ElementProps): ElementProps =>
      buildProps('floating', userProps);
  }, [buildProps]);

  const getItemProps = useMemo(() => {
    return (userProps?: ElementProps): ElementProps =>
      buildProps('item', userProps);
  }, [buildProps]);

  return {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  };
}
