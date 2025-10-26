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
import { SiMetamask } from 'react-icons/si';
import styles from './MetaMask.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { MetaMaskButtonProps } from './MetaMask.types';
import type { IStyledComponent } from 'styled-components';

const METAMASK_BUTTON_NAME = 'MetaMaskButton';

const StyledMetaMaskButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.MetaMaskButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

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
