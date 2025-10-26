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
import { FaSpotify } from 'react-icons/fa';
import styles from './Spotify.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { SpotifyButtonProps } from './Spotify.types';
import type { IStyledComponent } from 'styled-components';

const SPOTIFY_BUTTON_NAME = 'SpotifyButton';

const StyledSpotifyButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.SpotifyButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const SpotifyButton: FC<SpotifyButtonProps> = forwardRef<
  HTMLButtonElement,
  SpotifyButtonProps
>(
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
    }: Omit<SpotifyButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSpotifyButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaSpotify size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSpotifyButton>
  )
);

SpotifyButton.displayName = SPOTIFY_BUTTON_NAME;
