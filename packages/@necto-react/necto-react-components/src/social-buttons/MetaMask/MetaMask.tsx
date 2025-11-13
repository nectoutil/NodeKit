/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { MetaMaskIcon } from './MetaMask.icon';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { MetaMaskButtonProps } from './MetaMask.types';

const METAMASK_BUTTON_NAME = 'MetaMaskButton';

const METAMASK_BG_COLOR: string = '#f6851b';
const METAMASK_BG_HOVER_COLOR: string = '#e2761a';
const METAMASK_BG_ACTIVE_COLOR: string = '#cd6a17';
const METAMASK_TEXT_COLOR: string = '#ffffff';
const METAMASK_FOCUS_SHADOW_COLOR: string = 'rgba(246, 133, 27, 0.3)';

const StyledMetaMaskButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-metamask-bg, ${METAMASK_BG_COLOR});
  color: var(--necto-metamask-text, ${METAMASK_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-metamask-bg-hover, ${METAMASK_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-metamask-bg-active, ${METAMASK_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-metamask-focus-shadow, ${METAMASK_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-metamask-bg, ${METAMASK_BG_COLOR});
    }
  `}
`;

export const MetaMaskButton: ForwardRefExoticComponent<
  Omit<MetaMaskButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, MetaMaskButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with MetaMask',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: MetaMaskButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledMetaMaskButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${METAMASK_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<MetaMaskIcon size={iconSize} />}
      {...props}
    >
      {children}
    </StyledMetaMaskButton>
  )
);

MetaMaskButton.displayName = METAMASK_BUTTON_NAME;
