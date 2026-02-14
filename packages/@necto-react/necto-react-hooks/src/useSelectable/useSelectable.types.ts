/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMAttributes, SelectionManager } from '@necto-react/types';
import type { Key, RefObject } from 'react';

/**
 * Options for the useSelectable hook.
 */
export interface UseSelectableOptions {
  /** The selection manager instance that handles selection state. Optional if selection is not needed. */
  selectionManager?: SelectionManager;

  /** Optional custom id for the item element. */
  id?: string;

  /** A unique key identifying this item in the collection. */
  key: Key;

  /** Ref to the item's DOM element. */
  ref: RefObject<Element | HTMLOrSVGElement | null>;

  /**
   * Whether selection should occur on press up instead of press down.
   * Useful when selecting causes UI to disappear (e.g., menus).
   */
  shouldSelectOnPressUp?: boolean;

  /** Whether the item is rendered in a virtualized list. */
  isVirtualized?: boolean;

  /** Custom function to focus the item. */
  focus?: () => void;

  /** Whether to use virtual focus (aria-activedescendant) instead of DOM focus. */
  shouldUseVirtualFocus?: boolean;

  /** Whether the item is disabled. */
  isDisabled?: boolean;

  /** Handler called when the user performs an action on the item (e.g., Enter key, click). */
  onAction?: () => void;

  /**
   * How link items should behave:
   * - 'action': Link behaves like onAction.
   * - 'selection': Link follows selection interactions.
   * - 'override': Link overrides all other interactions.
   * - 'none': Link behavior is disabled.
   * @default 'action'
   */
  linkBehavior?: 'action' | 'selection' | 'override' | 'none';

  /**
   * Handler called when a link item should be navigated to.
   * Receives the href and router options from the item props.
   * If not provided, link items will use native anchor behavior.
   */
  onNavigate?: (href: string, routerOptions?: unknown) => void;
}

/**
 * Return value from the useSelectable hook.
 */
export interface UseSelectableReturn {
  /** Props to spread on the item element for selection behavior. */
  selectableProps: DOMAttributes;

  /** Whether the item is currently being pressed. */
  isPressed: boolean;

  /** Whether the item is currently selected. */
  isSelected: boolean;

  /** Whether the item is currently focused. */
  isFocused: boolean;

  /** Whether the item is disabled. */
  isDisabled: boolean;

  /** Whether the item can be selected. */
  allowsSelection: boolean;

  /** Whether the item has an action (onAction or link). */
  hasAction: boolean;
}
