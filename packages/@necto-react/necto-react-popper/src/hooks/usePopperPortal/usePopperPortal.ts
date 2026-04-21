/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useId } from 'react';

import { PORTAL_ROOT_ID } from './constants';

import type {
  UsePopperPortalReturn,
  UsePopperPortalOptions
} from './usePopperPortal.types';

/**
 * Provides portal functionality for popper elements.
 * Creates a portal container DOM node and manages its lifecycle.
 *
 * @param options - Configuration options.
 * @returns Portal node and ID.
 */
export function usePopperPortal(
  options: UsePopperPortalOptions = {}
): UsePopperPortalReturn {
  const { id, enabled = true, root } = options;

  const uniqueId: string = useId();
  const portalId: string = id ?? `necto-portal-${uniqueId}`;

  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      setPortalNode(null);
      return;
    }

    let portalRoot: HTMLElement | null =
      root ?? document.getElementById(PORTAL_ROOT_ID);

    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = PORTAL_ROOT_ID;
      portalRoot.setAttribute('data-necto-portal', '');
      document.body.appendChild(portalRoot);
    }

    const node: HTMLDivElement = document.createElement('div');
    node.id = portalId;
    node.setAttribute('data-necto-popper-portal', '');
    portalRoot.appendChild(node);
    setPortalNode(node);

    return () => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, [enabled, portalId, root]);

  return {
    portalNode,
    portalId
  };
}
