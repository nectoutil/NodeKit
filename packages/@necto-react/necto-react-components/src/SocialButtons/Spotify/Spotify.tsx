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
import { FaSpotify } from 'react-icons/fa';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { SpotifyButtonProps } from './Spotify.types';

const SPOTIFY_BUTTON_NAME = 'SpotifyButton';

const SPOTIFY_BG_COLOR: string = '#1db954';
const SPOTIFY_BG_HOVER_COLOR: string = '#1aa64b';
const SPOTIFY_BG_ACTIVE_COLOR: string = '#179443';
const SPOTIFY_TEXT_COLOR: string = '#ffffff';
const SPOTIFY_FOCUS_SHADOW_COLOR: string = 'rgba(29, 185, 84, 0.3)';

const StyledSpotifyButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-spotify-bg, ${SPOTIFY_BG_COLOR});
  color: var(--necto-spotify-text, ${SPOTIFY_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-spotify-bg-hover, ${SPOTIFY_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-spotify-bg-active, ${SPOTIFY_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-spotify-focus-shadow, ${SPOTIFY_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-spotify-bg, ${SPOTIFY_BG_COLOR});
    }
  `}
`;

export const SpotifyButton: ForwardRefExoticComponent<
  Omit<SpotifyButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SpotifyButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with Spotify',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SpotifyButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSpotifyButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${SPOTIFY_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaSpotify size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSpotifyButton>
  )
);

SpotifyButton.displayName = SPOTIFY_BUTTON_NAME;
