/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPortal } from 'react-dom';
import { usePopperPortal } from '../../hooks/usePopperPortal';

import type { ReactPortal } from 'react';
import type { PopperPortalProps } from './Portal.types';

/**
 * Renders children into a portal at the end of the document body.
 * Uses usePopperPortal internally to manage the portal container lifecycle.
 *
 * @param props - Configuration options.
 * @returns Portal component or null.
 */
export function PopperPortal(props: PopperPortalProps): ReactPortal | null {
  const { id, root, preserveTabOrder = true, children } = props;

  const { portalNode } = usePopperPortal({ id, root, preserveTabOrder });

  if (!portalNode) {
    return null;
  }

  return createPortal(children, portalNode);
}

PopperPortal.displayName = 'PopperPortal';
