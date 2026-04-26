/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RefObject } from 'react';

export type CollapseFrom = 'start' | 'end';

export type OverflowDirection = 'none' | 'grow' | 'shrink';

export interface PartitionState<T> {
  visible: ReadonlyArray<T>;
  hidden: ReadonlyArray<T>;
  lastOverflowCount: number;
  overflowDirection: OverflowDirection;
}

export interface UseOverflowOptions<T> {
  /** Items to lay out in a single-line flex row. */
  items: ReadonlyArray<T>;
  /** Side that collapses first when items don't fit. Default `'end'`. */
  collapseFrom?: CollapseFrom;
  /** Always show at least this many items even if they overflow. Default `1`. */
  minVisible?: number;
}

export interface UseOverflowReturn<T> {
  /** Attach to the flex wrapper. */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Attach to a `<div style={{ flexShrink: 1, width: 1 }} />` placed at the
   * very end of the wrapper's children. The hook reads its width to decide
   * whether the wrapper has room for more items.
   */
  spacerRef: RefObject<HTMLElement | null>;
  /** Items currently fitting inside the wrapper. */
  visibleItems: ReadonlyArray<T>;
  /** Items that don't fit. */
  hiddenItems: ReadonlyArray<T>;
  /** Convenience for `hiddenItems.length`. */
  hiddenCount: number;
  /** False until the first partition pass completes. Use to suppress FOUC. */
  isReady: boolean;
}
