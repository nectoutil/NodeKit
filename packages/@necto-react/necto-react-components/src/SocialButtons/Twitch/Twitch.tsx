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
import { FaTwitch } from 'react-icons/fa';
import styles from './Twitch.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { TwitchButtonProps } from './Twitch.types';
import type { IStyledComponent } from 'styled-components';

const TWITCH_BUTTON_NAME = 'TwitchButton';

const StyledTwitchButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.TwitchButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const TwitchButton: FC<TwitchButtonProps> = forwardRef<
  HTMLButtonElement,
  TwitchButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Twitch',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<TwitchButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledTwitchButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaTwitch size={iconSize} />}
      {...props}
    >
      {children}
    </StyledTwitchButton>
  )
);

TwitchButton.displayName = TWITCH_BUTTON_NAME;
