/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** Selection mode for a collection. */
export type SelectionMode = 'none' | 'single' | 'multiple';

/** Focus strategy when auto-focusing. */
export type FocusStrategy = 'first' | 'last';

/**
 * Interface for managing selection state in a collection.
 */
export interface SelectionManager {
  /** The currently focused key. */
  readonly focusedKey: (string | number) | null;
  /** Set the focused key. */
  setFocusedKey(
    key: (string | number) | null,
    childFocus?: FocusStrategy
  ): void;
  /** Whether the collection is focused. */
  readonly isFocused: boolean;
  /** Set whether the collection is focused. */
  setFocused(isFocused: boolean): void;
  /** The set of selected keys. */
  readonly selectedKeys: Set<string | number>;
  /** The selection mode. */
  readonly selectionMode: SelectionMode;
  /** Replace selection with a single key. */
  replaceSelection(key: string | number): void;
  /** Extend selection to include a key. */
  extendSelection(key: string | number): void;
  /** Toggle selection of a key. */
  toggleSelection(key: string | number): void;
  /** Select all items. */
  selectAll(): void;
  /** Clear all selection. */
  clearSelection(): void;
  /** Check if a key is selected. */
  isSelected(key: string | number): boolean;
  /** Check if a key is disabled. */
  isDisabled?(key: string | number): boolean;
  /** Check if a key is a link. */
  isLink?(key: string | number): boolean;
  /** Get props for an item. */
  getItemProps?(
    key: string | number
  ): { href?: string; routerOptions?: unknown } | undefined;
  /** Whether the user can select an item. */
  canSelectItem?(key: string | number): boolean;
  /** The first selected key. */
  readonly firstSelectedKey?: (string | number) | null;
  /** The last selected key. */
  readonly lastSelectedKey?: (string | number) | null;
}
