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
import styles from './Salesforce.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SalesforceButtonProps } from './Salesforce.types';
import type { IStyledComponent } from 'styled-components';

const SALESFORCE_BUTTON_NAME = 'SalesforceButton';

const StyledSalesforceButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.SalesforceButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

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
