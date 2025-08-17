// biome-ignore-all assist/source/organizeImports: No import sorting needed.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import { DOM } from '@necto/constants';

import type { ReactElement } from 'react';
import type { PrimitivePropsWithRef } from './Primitive.types';

import type { ElementType, Ref } from 'react';

const createNode = (tag: string) =>
  forwardRef<HTMLElement, PrimitivePropsWithRef<ElementType>>(
    ({ asChild, ...primitiveProps }, ref: Ref<HTMLElement>) => {
      // Render asChild or the tag itself
      if (
        asChild &&
        typeof primitiveProps.children === 'object' &&
        primitiveProps.children
      ) {
        return primitiveProps.children;
      }

      return <tag ref={ref} {...primitiveProps} />;
    }
  );

export const Primitive = (): ReactElement | null => {
  const primitives = DOM.HTML_TAGS.reduce(
    (acc, tag) => {
      acc[tag] = createNode(tag);
      return acc;
    },
    {} as Record<
      string,
      React.ForwardRefExoticComponent<PrimitivePropsWithRef<ElementType>>
    >
  );

  return null;
};
