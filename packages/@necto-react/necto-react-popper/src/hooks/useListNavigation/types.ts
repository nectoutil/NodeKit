/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { MutableRefObject } from 'react';
import type { ElementProps } from '../types';

export interface UseListNavigationOptions {
  /**
   * Whether the floating element is open.
   */
  open: boolean;

  /**
   * Callback to set the open state.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Ref to array of list item elements.
   */
  listRef: MutableRefObject<Array<HTMLElement | null>>;

  /**
   * The active index.
   */
  activeIndex: number | null;

  /**
   * Callback when active index changes.
   */
  onNavigate: (index: number | null) => void;

  /**
   * Whether the hook is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether the list is virtual.
   * @default false
   */
  virtual?: boolean;

  /**
   * Whether to loop navigation.
   * @default false
   */
  loop?: boolean;

  /**
   * Orientation of the list.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical' | 'both';

  /**
   * Whether to focus item on hover.
   * @default true
   */
  focusItemOnHover?: boolean;

  /**
   * Whether to open on arrow key down.
   * @default true
   */
  openOnArrowKeyDown?: boolean;
}

export interface UseListNavigationReturn {
  reference: ElementProps;
  floating: ElementProps;
  item: ElementProps;
}
