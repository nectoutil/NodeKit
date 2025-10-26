/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsxImportSource @emotion/react */
import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { BitbucketIcon } from './Bitbucket.icon';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BitbucketButtonProps } from './Bitbucket.types';

const BITBUCKET_BUTTON_NAME: string = 'BitbucketButton' as const;

const BITBUCKET_BG_COLOR: string = '#0052cc';
const BITBUCKET_BG_HOVER_COLOR: string = '#0747a6';
const BITBUCKET_BG_ACTIVE_COLOR: string = '#003d99';
const BITBUCKET_TEXT_COLOR: string = '#ffffff';
const BITBUCKET_FOCUS_SHADOW_COLOR: string = 'rgba(0, 82, 204, 0.3)';

const StyledBitbucketButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-bitbucket-bg, ${BITBUCKET_BG_COLOR});
  color: var(--necto-bitbucket-text, ${BITBUCKET_TEXT_COLOR});
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: var(--necto-bitbucket-bg-hover, ${BITBUCKET_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-bitbucket-bg-active, ${BITBUCKET_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-bitbucket-focus-shadow, ${BITBUCKET_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-bitbucket-bg, ${BITBUCKET_BG_COLOR});
    }
  `}
`;

export const BitbucketButton: ForwardRefExoticComponent<Omit<BitbucketButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  BitbucketButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Bitbucket',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 22,
      disabled,
      className,
      ...props
    }: BitbucketButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledBitbucketButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<BitbucketIcon size={iconSize} />}
      className={cn(`_necto:${BITBUCKET_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledBitbucketButton>
  )
);

BitbucketButton.displayName = BITBUCKET_BUTTON_NAME;
