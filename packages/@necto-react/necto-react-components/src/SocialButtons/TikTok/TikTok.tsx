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
import { FaTiktok } from 'react-icons/fa';
import styles from './TikTok.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { TikTokButtonProps } from './TikTok.types';
import type { IStyledComponent } from 'styled-components';

const TIKTOK_BUTTON_NAME = 'TikTokButton';

const StyledTikTokButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.TikTokButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const TikTokButton: FC<TikTokButtonProps> = forwardRef<
  HTMLButtonElement,
  TikTokButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with TikTok',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<TikTokButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledTikTokButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaTiktok size={iconSize} />}
      {...props}
    >
      {children}
    </StyledTikTokButton>
  )
);

TikTokButton.displayName = TIKTOK_BUTTON_NAME;
