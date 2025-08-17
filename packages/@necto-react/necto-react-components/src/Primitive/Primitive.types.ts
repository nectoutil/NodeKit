/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOM } from '@necto/constants';

import type {
  ComponentPropsWithRef,
  ElementType,
  ForwardRefExoticComponent
} from 'react';

export type Primitives = {
  [E in (typeof DOM.HTML_TAGS)[number] as E extends ElementType
    ? E
    : never]: ForwardRefExoticComponent<
    ComponentPropsWithRef<E & ElementType> & { asChild?: boolean }
  >;
};

export type PrimitivePropsWithRef<E extends ElementType> =
  ComponentPropsWithRef<E> & {
    asChild?: boolean;
  };
