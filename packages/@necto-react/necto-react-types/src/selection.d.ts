/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Key } from 'react';

/**
 * The selection mode for a collection.
 * - 'none': No selection allowed.
 * - 'single': Only one item can be selected at a time.
 * - 'multiple': Multiple items can be selected.
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * The selection behavior for a collection.
 * - 'toggle': Clicking an item toggles its selection without affecting others.
 * - 'replace': Clicking an item replaces the current selection with that item.
 */
export type SelectionBehavior = 'toggle' | 'replace';

/**
 * Interface for managing selection state in a collection.
 * Provides methods to read and update selection, focus, and item states.
 */
export interface SelectionManager {
  /** The current selection mode ('none', 'single', or 'multiple'). */
  readonly selectionMode: SelectionMode;

  /** The current selection behavior ('toggle' or 'replace'). */
  readonly selectionBehavior: SelectionBehavior;

  /** Whether no items are currently selected. */
  readonly isEmpty: boolean;

  /** Whether the collection currently has focus. */
  readonly isFocused: boolean;

  /** The key of the currently focused item, or null if none. */
  readonly focusedKey: Key | null;

  /** The set of currently selected item keys. */
  readonly selectedKeys: Set<Key>;

  /** Whether empty selection is disallowed (at least one item must be selected). */
  readonly disallowEmptySelection: boolean;

  /** Sets whether the collection is focused. */
  setFocused: (isFocused: boolean) => void;

  /** Sets the currently focused item key. */
  setFocusedKey: (key: Key | null) => void;

  /** Sets the selected item keys. */
  setSelectedKeys: (keys: Set<Key> | Key[]) => void;

  /** Sets the selection behavior. */
  setSelectionBehavior: (behavior: SelectionBehavior) => void;

  /** Returns whether the given key is currently selected. */
  isSelected: (key: Key) => boolean;

  /** Returns whether the given key is disabled. */
  isDisabled: (key: Key) => boolean;

  /** Returns whether the given key represents a link item. */
  isLink: (key: Key) => boolean;

  /** Returns whether the given key can be selected. */
  canSelectItem: (key: Key) => boolean;

  /** Toggles selection state of the given key. */
  toggleSelection: (key: Key) => void;

  /** Replaces the current selection with just the given key. */
  replaceSelection: (key: Key) => void;

  /** Extends the selection to include the given key (for shift-click). */
  extendSelection: (key: Key) => void;

  /** Gets item props for link navigation (href, routerOptions). */
  getItemProps: (key: Key) => { href?: string; routerOptions?: unknown } | null;

  /** The underlying collection data (optional). */
  readonly collection?: { id?: string };
}
