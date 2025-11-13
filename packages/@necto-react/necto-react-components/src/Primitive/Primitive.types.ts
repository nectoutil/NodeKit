/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ElementType,
  ComponentPropsWithRef,
  ForwardRefExoticComponent
} from 'react';
import type { DOM } from '@necto/constants';
import type { Interpolation, Theme } from '@emotion/react';

/**
 * Props for the polymorphic Primitive component.
 */
export type PrimitiveProps<E extends ElementType> = ComponentPropsWithRef<E> & {
  /** If true, clones the single child instead of rendering an extra element. */
  asChild?: boolean;

  /** The element type to render as (e.g., 'div', 'button', custom component). */
  as?: E;

  /** Emotion css prop for custom styles */
  css?: Interpolation<Theme>;
};

/**
 * Map of HTML tag names to their corresponding Primitive components.
 *
 * Each entry is a forward-ref exotic component that accepts the appropriate
 * props for its element type, plus Primitive-specific props.
 */
export type Primitives = {
  [E in (typeof DOM.HTML_TAGS)[number] as E extends ElementType
    ? E
    : never]: ForwardRefExoticComponent<PrimitiveProps<E & ElementType>>;
};
