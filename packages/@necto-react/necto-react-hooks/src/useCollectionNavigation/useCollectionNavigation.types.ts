/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { Key, KeyboardDelegate } from '@necto/types';

// Re-export for convenience
export type { KeyboardDelegate } from '@necto/types';

/** Direction for text/layout. */
export type Direction = 'ltr' | 'rtl';

/** Orientation of the collection. */
export type Orientation = 'horizontal' | 'vertical' | 'both';

/** Selection mode for the collection. */
export type SelectionMode = 'none' | 'single' | 'multiple';

/** Focus strategy when auto-focusing. */
export type FocusStrategy = 'first' | 'last';

/** Behavior when Escape key is pressed. */
export type EscapeBehavior = 'clearSelection' | 'none';

/** Behavior for link items in the collection. */
export type LinkBehavior = 'action' | 'selection' | 'override';

/**
 * Interface for managing selection state.
 */
export interface SelectionManager {
  /** The currently focused key. */
  readonly focusedKey: Key | null;
  /** Set the focused key. */
  setFocusedKey(key: Key | null, childFocus?: FocusStrategy): void;
  /** Whether the collection is focused. */
  readonly isFocused: boolean;
  /** Set whether the collection is focused. */
  setFocused(isFocused: boolean): void;
  /** The set of selected keys. */
  readonly selectedKeys: Set<Key>;
  /** The selection mode. */
  readonly selectionMode: SelectionMode;
  /** Replace selection with a single key. */
  replaceSelection(key: Key): void;
  /** Extend selection to include a key. */
  extendSelection(key: Key): void;
  /** Toggle selection of a key. */
  toggleSelection(key: Key): void;
  /** Select all items. */
  selectAll(): void;
  /** Clear all selection. */
  clearSelection(): void;
  /** Check if a key is selected. */
  isSelected(key: Key): boolean;
  /** Check if a key is disabled. */
  isDisabled?(key: Key): boolean;
  /** Check if a key is a link. */
  isLink?(key: Key): boolean;
  /** Get props for an item. */
  getItemProps?(
    key: Key
  ): { href?: string; routerOptions?: unknown } | undefined;
  /** Whether the user can select an item. */
  canSelectItem?(key: Key): boolean;
  /** The first selected key. */
  readonly firstSelectedKey?: Key | null;
  /** The last selected key. */
  readonly lastSelectedKey?: Key | null;
}

/**
 * Options for useCollectionNavigation hook.
 */
export interface UseCollectionNavigationOptions {
  /**
   * Manager for reading and updating selection state.
   */
  selectionManager: SelectionManager;

  /**
   * Delegate for keyboard navigation behavior.
   */
  keyboardDelegate: KeyboardDelegate;

  /**
   * Ref to the collection container element.
   */
  ref: RefObject<HTMLElement | null>;

  /**
   * Whether to auto-focus on mount.
   * @default false
   */
  autoFocus?: boolean | FocusStrategy;

  /**
   * Whether focus should wrap at ends.
   * @default false
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether empty selection is disallowed.
   * @default false
   */
  disallowEmptySelection?: boolean;

  /**
   * Whether Ctrl+A select all is disallowed.
   * @default false
   */
  disallowSelectAll?: boolean;

  /**
   * Behavior when Escape is pressed.
   * @default 'clearSelection'
   */
  escapeBehavior?: EscapeBehavior;

  /**
   * Whether to select items on focus.
   * @default false
   */
  selectOnFocus?: boolean;

  /**
   * Whether type-ahead is disabled.
   * @default false
   */
  disallowTypeAhead?: boolean;

  /**
   * Whether to use virtual focus (aria-activedescendant).
   * @default false
   */
  shouldUseVirtualFocus?: boolean;

  /**
   * Whether Tab key navigation is allowed.
   * @default false
   */
  allowsTabNavigation?: boolean;

  /**
   * Whether the collection is virtualized.
   * @default false
   */
  isVirtualized?: boolean;

  /**
   * Ref to the scrollable container (defaults to ref).
   */
  scrollRef?: RefObject<HTMLElement | null>;

  /**
   * Text direction for RTL support.
   * @default 'ltr'
   */
  direction?: Direction;

  /**
   * Orientation of the collection.
   * @default 'vertical'
   */
  orientation?: Orientation;

  /**
   * Disabled keys in the collection.
   */
  disabledKeys?: Set<Key>;

  /**
   * Called when navigation occurs.
   */
  onNavigate?: (key: Key | null) => void;

  /**
   * Called when an item should be focused.
   */
  onFocusItem?: (key: Key) => void;
}

/**
 * Return value from useCollectionNavigation hook.
 */
export interface UseCollectionNavigationReturn {
  /** Props to spread on the collection element. */
  collectionProps: DOMAttributes;
}
