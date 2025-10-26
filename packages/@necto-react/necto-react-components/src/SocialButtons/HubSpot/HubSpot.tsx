/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { SiHubspot } from 'react-icons/si';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { HubSpotButtonProps } from './HubSpot.types';
import type { IStyledComponent } from 'styled-components';

const HUBSPOT_BUTTON_NAME = 'HubSpotButton';

const StyledHubSpotButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #ff7a59;
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
    background-color: #ff6a47;
  }

  &:active {
    background-color: #e55d3f;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 122, 89, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #ff7a59;
    }
  `}
`;

export const HubSpotButton: ForwardRefExoticComponent<Omit<HubSpotButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  HubSpotButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with HubSpot',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: HubSpotButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledHubSpotButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<SiHubspot size={iconSize} />}
      {...props}
    >
      {children}
    </StyledHubSpotButton>
  )
);

HubSpotButton.displayName = HUBSPOT_BUTTON_NAME;
