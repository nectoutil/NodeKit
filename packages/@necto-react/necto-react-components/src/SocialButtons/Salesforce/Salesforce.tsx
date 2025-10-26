/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsxImportSource @emotion/react */
import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { FaSalesforce } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SalesforceButtonProps } from './Salesforce.types';

const SALESFORCE_BUTTON_NAME = 'SalesforceButton';

const SALESFORCE_BG_COLOR: string = '#00a1e0';
const SALESFORCE_BG_HOVER_COLOR: string = '#0074a8';
const SALESFORCE_BG_ACTIVE_COLOR: string = '#005c85';
const SALESFORCE_TEXT_COLOR: string = '#ffffff';
const SALESFORCE_FOCUS_SHADOW_COLOR: string = 'rgba(0, 161, 224, 0.3)';

const StyledSalesforceButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-salesforce-bg, ${SALESFORCE_BG_COLOR});
  color: var(--necto-salesforce-text, ${SALESFORCE_TEXT_COLOR});
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
    background-color: var(--necto-salesforce-bg-hover, ${SALESFORCE_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-salesforce-bg-active, ${SALESFORCE_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-salesforce-focus-shadow, ${SALESFORCE_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-salesforce-bg, ${SALESFORCE_BG_COLOR});
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
      className={cn(`_necto:${SALESFORCE_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaSalesforce size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSalesforceButton>
  )
);

SalesforceButton.displayName = SALESFORCE_BUTTON_NAME;
