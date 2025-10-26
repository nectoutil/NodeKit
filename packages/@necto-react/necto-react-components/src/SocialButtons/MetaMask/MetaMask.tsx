/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { SiMetamask } from 'react-icons/si';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { MetaMaskButtonProps } from './MetaMask.types';

const METAMASK_BUTTON_NAME = 'MetaMaskButton';

const StyledMetaMaskButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #f6851b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #e2761a;
  }

  &:active {
    background-color: #cd6a17;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(246, 133, 27, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #f6851b;
    }
  `}
`;

export const MetaMaskButton: ForwardRefExoticComponent<Omit<MetaMaskButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  MetaMaskButtonProps
>(
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
      className={className}
      iconPosition={iconPosition}
      icon={<SiMetamask size={iconSize} />}
      {...props}
    >
      {children}
    </StyledMetaMaskButton>
  )
);

MetaMaskButton.displayName = METAMASK_BUTTON_NAME;
