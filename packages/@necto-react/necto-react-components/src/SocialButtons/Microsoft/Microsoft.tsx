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
import styles from './Microsoft.module.scss';
import { MicrosoftIcon } from './Microsoft.icon';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { MicrosoftButtonProps } from './Microsoft.types';
import type { IStyledComponent } from 'styled-components';

const MICROSOFT_BUTTON_NAME = 'MicrosoftButton';

const StyledMicrosoftButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.MicrosoftButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const MicrosoftButton: ForwardRefExoticComponent<Omit<MicrosoftButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  MicrosoftButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Sign in with Microsoft',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 18,
      disabled,
      className,
      ...props
    }: MicrosoftButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledMicrosoftButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<MicrosoftIcon size={iconSize} />}
      {...props}
    >
      {children}
    </StyledMicrosoftButton>
  )
);

MicrosoftButton.displayName = MICROSOFT_BUTTON_NAME;
