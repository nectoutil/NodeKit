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
import { FaXTwitter } from 'react-icons/fa6';
import styles from './X.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { XButtonProps } from './X.types';
import type { IStyledComponent } from 'styled-components';

const X_BUTTON_NAME = 'XButton';

const StyledXButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.XButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const XButton: FC<XButtonProps> = forwardRef<
  HTMLButtonElement,
  XButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with X',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<XButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledXButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaXTwitter size={iconSize} />}
      {...props}
    >
      {children}
    </StyledXButton>
  )
);

XButton.displayName = X_BUTTON_NAME;
