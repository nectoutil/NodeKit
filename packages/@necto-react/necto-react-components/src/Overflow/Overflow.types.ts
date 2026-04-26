/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { PrimitiveProps } from '../Primitive';
import type { ElementType, ReactNode } from 'react';
import type { CollapseFrom } from '@necto-react/hooks';

export interface OverflowRenderState<T> {
  hidden: ReadonlyArray<T>;
  count: number;
}

/**
 * Props for the Overflow component.
 *
 * Inherits all polymorphic Primitive props (`as`, `className`, `style`, plus
 * any DOM attributes for the rendered element). `children` is omitted because
 * Overflow drives rendering through `renderItem` and `renderMore` instead.
 */
export type OverflowProps<T> = Omit<PrimitiveProps<ElementType>, 'children'> & {
  /** Items to lay out. */
  items: ReadonlyArray<T>;

  /** Renders a single visible item. */
  renderItem: (item: T, index: number) => ReactNode;

  /**
   * Renders the "+N more" indicator. Receives the hidden items + count.
   * Skipped entirely when nothing overflows.
   */
  renderMore?: (state: OverflowRenderState<T>) => ReactNode;

  /** Side that collapses first when items don't fit. Default `'end'`. */
  collapseFrom?: CollapseFrom;

  /** Always show at least this many items. Default `1`. */
  minVisible?: number;
};
