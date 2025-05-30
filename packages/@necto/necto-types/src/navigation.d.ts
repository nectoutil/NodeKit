/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Key } from "./keyboards";

/**
 * Interface for keyboard navigation within a collection.
 */
export interface KeyboardDelegate {
  /** Moves focus to the next item below. */
  getKeyBelow?(key: Key): Key | null;

  /** Moves focus to the next item above. */
  getKeyAbove?(key: Key): Key | null;

  /** Moves focus to the next item on the left. */
  getKeyLeftOf?(key: Key): Key | null;

  /** Moves focus to the next item on the right. */
  getKeyRightOf?(key: Key): Key | null;

  /** Moves focus one page down (multiple items). */
  getKeyPageBelow?(key: Key): Key | null;

  /** Moves focus one page up (multiple items). */
  getKeyPageAbove?(key: Key): Key | null;

  /** Gets the first focusable item in the collection. */
  getFirstKey?(key?: Key | null, global?: boolean): Key | null;

  /** Gets the last focusable item in the collection. */
  getLastKey?(key?: Key | null, global?: boolean): Key | null;

  /** Finds the next item matching the search string. */
  getKeyForSearch?(search: string, fromKey?: Key | null): Key | null;
}