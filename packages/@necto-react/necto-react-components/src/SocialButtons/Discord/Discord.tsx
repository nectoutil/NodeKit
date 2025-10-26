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
import { Button } from '../Button/Button';
import { FaDiscord } from 'react-icons/fa';
import styles from './Discord.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { DiscordButtonProps } from './Discord.types';
import type { IStyledComponent } from 'styled-components';

const DISCORD_BUTTON_NAME: string = 'DiscordButton' as const;

const StyledDiscordButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.DiscordButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const DiscordButton: ForwardRefExoticComponent<Omit<DiscordButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  DiscordButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Discord',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: DiscordButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledDiscordButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaDiscord size={iconSize} />}
      className={cn(className, `_necto:${DISCORD_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledDiscordButton>
  )
);

DiscordButton.displayName = DISCORD_BUTTON_NAME;
