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
import styles from './HubSpot.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { HubSpotButtonProps } from './HubSpot.types';
import type { IStyledComponent } from 'styled-components';

const HUBSPOT_BUTTON_NAME = 'HubSpotButton';

const StyledHubSpotButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.HubSpotButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const HubSpotButton: FC<HubSpotButtonProps> = forwardRef<
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
    }: Omit<HubSpotButtonProps, 'ref'>,
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
