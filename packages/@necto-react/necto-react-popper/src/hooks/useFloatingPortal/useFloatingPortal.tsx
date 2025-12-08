/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';

import type {
  UseFloatingPortalProps,
  UseFloatingPortalReturn,
  FloatingPortalProps
} from './types';

const PORTAL_ROOT_ID = 'necto-floating-portal-root';

/**
 * Gets or creates the default portal root element.
 * @returns The portal root element.
 */
function getPortalRoot(): HTMLElement {
  let root = document.getElementById(PORTAL_ROOT_ID);

  if (!root) {
    root = document.createElement('div');
    root.id = PORTAL_ROOT_ID;
    root.setAttribute('data-necto-portal', '');
    document.body.appendChild(root);
  }

  return root;
}

/**
 * Provides portal functionality for floating elements.
 * @param props - Configuration options.
 * @returns Portal node and ID.
 */
export function useFloatingPortal(
  props: UseFloatingPortalProps = {}
): UseFloatingPortalReturn {
  const { id, enabled = true, root } = props;

  const uniqueId = useId();
  const portalId = id ?? `necto-portal-${uniqueId}`;

  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      setPortalNode(null);
      return;
    }

    const parentRoot = root ?? getPortalRoot();
    const node = document.createElement('div');
    node.id = portalId;
    node.setAttribute('data-necto-floating-portal', '');
    parentRoot.appendChild(node);
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

/**
 * Renders children into a portal at the end of the document body.
 * @param props - Configuration options.
 * @returns Portal component or null.
 */
export function FloatingPortal(
  props: FloatingPortalProps
): React.ReactPortal | null {
  const { id, root, preserveTabOrder = true, children } = props;

  const { portalNode } = useFloatingPortal({ id, root, preserveTabOrder });

  const content = useMemo(() => {
    if (!preserveTabOrder) {
      return children;
    }

    return React.createElement(React.Fragment, null, children);
  }, [preserveTabOrder, children]);

  if (!portalNode) {
    return null;
  }

  return createPortal(content, portalNode);
}
