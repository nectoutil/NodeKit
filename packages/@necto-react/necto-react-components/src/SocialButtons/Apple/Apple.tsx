/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { FaApple } from 'react-icons/fa';
import { Button } from '../Button/Button';
import styles from './Apple.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { AppleButtonProps } from './Apple.types';
import type { IStyledComponent } from 'styled-components';

const APPLE_BUTTON_NAME: string = 'AppleButton' as const;

const StyledAppleButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.AppleButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const AppleButton: FC<AppleButtonProps> = forwardRef<
  HTMLButtonElement,
  AppleButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Apple',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<AppleButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledAppleButton
      as={as}
      ref={ref}
      asChild={asChild}
      icon={<FaApple size={iconSize} />}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(className, `_necto:${APPLE_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledAppleButton>
  )
);

AppleButton.displayName = APPLE_BUTTON_NAME;
