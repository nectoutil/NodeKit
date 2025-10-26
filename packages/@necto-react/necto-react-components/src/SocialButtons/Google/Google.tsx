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
import { FcGoogle } from 'react-icons/fc';
import styles from './Google.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GoogleButtonProps } from './Google.types';
import type { IStyledComponent } from 'styled-components';

const GOOGLE_BUTTON_NAME = 'GoogleButton';

const StyledGoogleButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.GoogleButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const GoogleButton: ForwardRefExoticComponent<Omit<GoogleButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  GoogleButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Google',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: GoogleButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledGoogleButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FcGoogle size={iconSize} />}
      {...props}
    >
      {children}
    </StyledGoogleButton>
  )
);

GoogleButton.displayName = GOOGLE_BUTTON_NAME;
