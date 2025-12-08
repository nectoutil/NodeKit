/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface DelayGroupContext {
  /**
   * Current delay value for the group.
   */
  delay: number | { open?: number; close?: number };

  /**
   * Sets the current delay for the group.
   */
  setCurrentId: (id: string | null) => void;

  /**
   * Currently active floating element ID.
   */
  currentId: string | null;

  /**
   * Whether any element in the group is open.
   */
  isInstantPhase: boolean;

  /**
   * Timeout duration before resetting to initial delay.
   */
  timeoutMs: number;
}

export interface UseDelayGroupOptions {
  /**
   * Unique ID for this floating element in the group.
   */
  id: string;
}

export interface UseDelayGroupReturn {
  /**
   * Delay value to use for this element.
   */
  delay: number | { open?: number; close?: number };

  /**
   * Registers this element as the current one.
   */
  setAsCurrentId: () => void;

  /**
   * Whether this element is in instant phase.
   */
  isInstantPhase: boolean;
}

export interface DelayGroupProviderProps {
  /**
   * Initial delay configuration.
   */
  delay: number | { open?: number; close?: number };

  /**
   * Timeout before resetting to initial delay after all elements close.
   * @default 0
   */
  timeoutMs?: number;

  /**
   * Children components.
   */
  children: React.ReactNode;
}
