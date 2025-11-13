/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { FaTwitch } from 'react-icons/fa';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { TwitchButtonProps } from './Twitch.types';

const TWITCH_BUTTON_NAME = 'TwitchButton';

const TWITCH_BG_COLOR: string = '#9146ff';
const TWITCH_BG_HOVER_COLOR: string = '#823ee6';
const TWITCH_BG_ACTIVE_COLOR: string = '#7337cc';
const TWITCH_TEXT_COLOR: string = '#ffffff';
const TWITCH_FOCUS_SHADOW_COLOR: string = 'rgba(145, 70, 255, 0.3)';

const StyledTwitchButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-twitch-bg, ${TWITCH_BG_COLOR});
  color: var(--necto-twitch-text, ${TWITCH_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-twitch-bg-hover, ${TWITCH_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-twitch-bg-active, ${TWITCH_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-twitch-focus-shadow, ${TWITCH_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-twitch-bg, ${TWITCH_BG_COLOR});
    }
  `}
`;

export const TwitchButton: ForwardRefExoticComponent<
  Omit<TwitchButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TwitchButtonProps>(
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
    }: TwitchButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledTwitchButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${TWITCH_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaTwitch size={iconSize} />}
      {...props}
    >
      {children}
    </StyledTwitchButton>
  )
);

TwitchButton.displayName = TWITCH_BUTTON_NAME;
