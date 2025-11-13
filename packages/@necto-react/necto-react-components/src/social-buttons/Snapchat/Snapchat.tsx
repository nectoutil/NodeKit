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
import { SnapchatIcon } from './Snapchat.icon';

import type {
  ReactElement,
  ForwardedRef,
  RefAttributes,
  ForwardRefExoticComponent
} from 'react';
import type { SnapchatButtonProps } from './Snapchat.types';

const SNAPCHAT_BUTTON_NAME: string = 'SnapchatButton' as const;

const SNAPCHAT_BG_COLOR: string = '#FFFC00';
const SNAPCHAT_BG_HOVER_COLOR: string = '#F7EC09';
const SNAPCHAT_BG_ACTIVE_COLOR: string = '#E8DD08';
const SNAPCHAT_TEXT_COLOR: string = '#000000';
const SNAPCHAT_FOCUS_SHADOW_COLOR: string = 'rgba(255, 252, 0, 0.3)';

const StyledSnapchatButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 18px;
  background-color: var(--necto-snapchat-bg, ${SNAPCHAT_BG_COLOR});
  color: var(--necto-snapchat-text, ${SNAPCHAT_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-snapchat-bg-hover, ${SNAPCHAT_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-snapchat-bg-active, ${SNAPCHAT_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-snapchat-focus-shadow, ${SNAPCHAT_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-snapchat-bg, ${SNAPCHAT_BG_COLOR});
    }
  `}
`;

export const SnapchatButton: ForwardRefExoticComponent<
  Omit<SnapchatButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SnapchatButtonProps>(
  (
    {
      as,
      asChild,
      iconColor = null,
      children = 'Continue with Snapchat',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SnapchatButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSnapchatButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<SnapchatIcon size={iconSize} color={iconColor} />}
      className={cn(`_necto:${SNAPCHAT_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledSnapchatButton>
  )
);

SnapchatButton.displayName = SNAPCHAT_BUTTON_NAME;
