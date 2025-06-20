/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from 'react';

import type { FocusableElement } from '@necto/types';
import type { DOMAttributes } from '@necto-react/types';
import type { ReactNode, Context, RefObject } from 'react';

/**
 * Props for the Focusable context and provider.
 * Extends DOM attributes and includes children and a ref to the focusable element.
 */
export interface FocusableContextProps extends DOMAttributes<any> {
  /** The child element to provide DOM props to. */
  children?: ReactNode;

  /** Ref to the focusable element. */
  ref?: RefObject<FocusableElement | null>;
}

export const FocusableContext: Context<FocusableContextProps | null> =
  createContext<FocusableContextProps | null>(null);
