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
import { SiOkx } from 'react-icons/si';
import styles from './OKX.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { OKXButtonProps } from './OKX.types';
import type { IStyledComponent } from 'styled-components';

const OKX_BUTTON_NAME = 'OKXButton';

const StyledOKXButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.OKXButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const OKXButton: FC<OKXButtonProps> = forwardRef<
  HTMLButtonElement,
  OKXButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with OKX',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<OKXButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledOKXButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<SiOkx size={iconSize} />}
      {...props}
    >
      {children}
    </StyledOKXButton>
  )
);

OKXButton.displayName = OKX_BUTTON_NAME;
