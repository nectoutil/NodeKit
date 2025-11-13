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
import { FaFacebook } from 'react-icons/fa6';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { FacebookButtonProps } from './Facebook.types';

const FACEBOOK_BUTTON_NAME: string = 'FacebookButton' as const;

const FACEBOOK_BG_COLOR: string = '#1877f2';
const FACEBOOK_BG_HOVER_COLOR: string = '#166fe5';
const FACEBOOK_BG_ACTIVE_COLOR: string = '#1467d6';
const FACEBOOK_TEXT_COLOR: string = '#ffffff';
const FACEBOOK_BORDER_COLOR: string = '#1877f2';
const FACEBOOK_FOCUS_SHADOW_COLOR: string = 'rgba(24, 119, 242, 0.3)';

const StyledFacebookButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 18px;
  background-color: var(--necto-facebook-bg, ${FACEBOOK_BG_COLOR});
  color: var(--necto-facebook-text, ${FACEBOOK_TEXT_COLOR});
  border: 1px solid var(--necto-facebook-border, ${FACEBOOK_BORDER_COLOR});
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-facebook-bg-hover, ${FACEBOOK_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-facebook-bg-active, ${FACEBOOK_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-facebook-focus-shadow, ${FACEBOOK_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-facebook-bg, ${FACEBOOK_BG_COLOR});
    }
  `}
`;

export const FacebookButton: ForwardRefExoticComponent<
  Omit<FacebookButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, FacebookButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with Facebook',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: FacebookButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledFacebookButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaFacebook size={iconSize} />}
      className={cn(`_necto:${FACEBOOK_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledFacebookButton>
  )
);

FacebookButton.displayName = FACEBOOK_BUTTON_NAME;
