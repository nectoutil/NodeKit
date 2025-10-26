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
import { FaSalesforce } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SalesforceButtonProps } from './Salesforce.types';
import type { IStyledComponent } from 'styled-components';

const SALESFORCE_BUTTON_NAME = 'SalesforceButton';

const StyledSalesforceButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px;
  min-height: 40px;
  background-color: #00a1e0;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #0074a8;
  }

  &:active {
    background-color: #005c85;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 161, 224, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #00a1e0;
    }
  `}
`;

export const SalesforceButton: ForwardRefExoticComponent<Omit<SalesforceButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SalesforceButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Salesforce',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SalesforceButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSalesforceButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaSalesforce size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSalesforceButton>
  )
);

SalesforceButton.displayName = SALESFORCE_BUTTON_NAME;
