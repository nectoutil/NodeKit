/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { MutableRefObject } from 'react';
import type { ElementProps } from '../types';

export interface UseTypeaheadProps {
  /**
   * Whether the floating element is open.
   */
  open: boolean;

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
  onMatch: (index: number) => void;

  /**
   * Whether the hook is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Function to extract text from list item.
   */
  findMatch?: (
    list: Array<HTMLElement | null>,
    search: string
  ) => number | null;

  /**
   * Timeout in ms before clearing the search.
   * @default 750
   */
  resetMs?: number;

  /**
   * Callback when typing occurs.
   */
  onTypingChange?: (isTyping: boolean) => void;
}

export interface UseTypeaheadReturn {
  reference: ElementProps;
  floating: ElementProps;
}
