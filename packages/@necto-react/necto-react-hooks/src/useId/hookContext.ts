/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Context object for generating unique IDs.
 * @property {string} prefix - Randomly generated prefix for IDs.
 * @property {number} current - Counter for generating unique IDs.
 */
export const defaultContext = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0,
};

/**
 * Map to track updaters for each generated ID.
 * Key is the ID string, value is an array of updater objects.
 */
export const idsUpdaterMap = new Map<string, { current: string | null }[]>();

/**
 * FinalizationRegistry for cleaning up unused IDs from idsUpdaterMap.
 */
export const registry =
  typeof FinalizationRegistry !== "undefined"
    ? new FinalizationRegistry<string>((id) => {
        idsUpdaterMap.delete(id);
      })
    : null;

