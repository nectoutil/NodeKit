/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useMemo } from 'react';

import type { UseRoleProps, UseRoleReturn } from './types';

/**
 * Provides ARIA role props for floating elements.
 * @param props - Configuration options.
 * @returns Props to spread on reference and floating elements.
 */
export function useRole(props: UseRoleProps): UseRoleReturn {
  const { open, enabled = true, role = 'dialog' } = props;

  const floatingId = useId();

  const reference = useMemo(() => {
    if (!enabled) return {};

    if (role === 'tooltip') {
      return {
        'aria-describedby': open ? floatingId : undefined
      };
    }

    return {
      'aria-expanded': open,
      'aria-haspopup':
        role === 'menu' ||
        role === 'listbox' ||
        role === 'tree' ||
        role === 'grid'
          ? role
          : 'dialog',
      'aria-controls': open ? floatingId : undefined
    };
  }, [enabled, open, role, floatingId]);

  const floating = useMemo(() => {
    if (!enabled) return {};

    const baseProps: Record<string, unknown> = {
      id: floatingId,
      role
    };

    if (role === 'tooltip') {
      return baseProps;
    }

    if (role === 'dialog' || role === 'alertdialog') {
      return {
        ...baseProps,
        'aria-modal': 'true'
      };
    }

    return baseProps;
  }, [enabled, floatingId, role]);

  return {
    reference,
    floating
  };
}
