/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocalState } from '@necto-react/state';
import { useMounted, useIsomorphicLayoutEffect } from '@necto-react/hooks';

import { PORTAL_NAME, DEFAULT_PORTAL_ROOT_ID, DEFAULT_PORTAL_ELEMENT_TYPE } from './constants';
import { Primitive } from '../Primitive';

import type { PortalProps } from './Portal.types';
import type { LocalStateResult } from '@necto-react/state';
import type { ForwardedRef } from 'react';

const PortalFn = (props: PortalProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
  const { container, children, ...rest } = props;

  const mounted: boolean = useMounted();
  const defaultContainer: LocalStateResult<HTMLDivElement | null> =
    useLocalState<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || container) {
      return;
    }

    const existingRoot: HTMLElement | null = document.getElementById(DEFAULT_PORTAL_ROOT_ID);

    if (existingRoot instanceof HTMLDivElement) {
      defaultContainer.set(existingRoot);
      return;
    }

    const createdContainer: HTMLDivElement = document.createElement(
      DEFAULT_PORTAL_ELEMENT_TYPE
    ) as HTMLDivElement;
    createdContainer.id = DEFAULT_PORTAL_ROOT_ID;
    document.body.appendChild(createdContainer);

    defaultContainer.set(createdContainer);
  }, [container, mounted]);

  const containerItem: Element | DocumentFragment | null = container ?? defaultContainer.value;

  if (!containerItem) {
    return null;
  }

  return createPortal(
    <Primitive.Div {...rest} ref={forwardedRef}>
      {children}
    </Primitive.Div>,
    containerItem
  );
};

export const Portal = forwardRef<HTMLDivElement, PortalProps>(PortalFn);

Portal.displayName = PORTAL_NAME;
