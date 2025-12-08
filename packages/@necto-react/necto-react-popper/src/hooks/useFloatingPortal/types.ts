/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface UseFloatingPortalProps {
  /**
   * Custom portal ID to use.
   */
  id?: string;

  /**
   * Whether the portal is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Custom root element to render the portal into.
   */
  root?: HTMLElement | null;

  /**
   * Whether to preserve tab order for accessibility.
   * @default true
   */
  preserveTabOrder?: boolean;
}

export interface UseFloatingPortalReturn {
  /**
   * The portal container element.
   */
  portalNode: HTMLElement | null;

  /**
   * Unique portal ID.
   */
  portalId: string;
}

export interface FloatingPortalProps {
  /**
   * Custom portal ID.
   */
  id?: string;

  /**
   * Custom root element.
   */
  root?: HTMLElement | null;

  /**
   * Whether to preserve tab order.
   * @default true
   */
  preserveTabOrder?: boolean;

  /**
   * Children to render in the portal.
   */
  children: React.ReactNode;
}
