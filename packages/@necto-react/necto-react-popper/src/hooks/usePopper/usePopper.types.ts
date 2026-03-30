/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ComputePositionOptions,
  ComputePositionResult
} from '@necto/popper';

/**
 * Options for usePopper hook
 */
export interface UsePopperOptions extends ComputePositionOptions {
  /**
   * External reference element (instead of using refs)
   */
  reference?: Element | null;

  /**
   * External floating element (instead of using refs)
   */
  floating?: HTMLElement | null;

  /**
   * Whether the floating element is open/visible
   * When false, isPositioned will be set to false
   */
  open?: boolean;

  /**
   * Whether to use CSS transform instead of left/top
   * Transform is more performant but can affect stacking context
   * @default true
   */
  transform?: boolean;

  /**
   * Callback that runs while elements are mounted
   * Can return cleanup function
   * Useful for setting up observers (ResizeObserver, scroll listeners, etc.)
   */
  whileElementsMounted?: (
    reference: Element,
    floating: HTMLElement,
    update: () => void
  ) => undefined | (() => void);
}

/**
 * Return type for usePopper hook
 */
export interface UsePopperReturn extends ComputePositionResult {
  /**
   * Whether the position has been computed at least once
   */
  isPositioned: boolean;

  /**
   * Update the position manually
   */
  update: () => void;

  /**
   * Refs object
   */
  refs: {
    reference: React.RefObject<Element | null>;
    floating: React.RefObject<HTMLElement | null>;
    setReference: (node: Element | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };

  /**
   * The current elements
   */
  elements: {
    reference: Element | null;
    floating: HTMLElement | null;
  };

  /**
   * Ready-to-use CSS styles for the floating element
   */
  floatingStyles: React.CSSProperties;
}
