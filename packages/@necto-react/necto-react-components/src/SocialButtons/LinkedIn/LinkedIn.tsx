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
import { FaLinkedin } from 'react-icons/fa';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { LinkedInButtonProps } from './LinkedIn.types';

const LINKEDIN_BUTTON_NAME = 'LinkedInButton';

const LINKEDIN_BG_COLOR: string = '#0a66c2';
const LINKEDIN_BG_HOVER_COLOR: string = '#004182';
const LINKEDIN_BG_ACTIVE_COLOR: string = '#003366';
const LINKEDIN_TEXT_COLOR: string = '#ffffff';
const LINKEDIN_FOCUS_SHADOW_COLOR: string = 'rgba(10, 102, 194, 0.3)';

const StyledLinkedInButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px;
  background-color: var(--necto-linkedin-bg, ${LINKEDIN_BG_COLOR});
  color: var(--necto-linkedin-text, ${LINKEDIN_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-linkedin-bg-hover, ${LINKEDIN_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-linkedin-bg-active, ${LINKEDIN_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-linkedin-focus-shadow, ${LINKEDIN_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-linkedin-bg, ${LINKEDIN_BG_COLOR});
    }
  `}
`;

export const LinkedInButton: ForwardRefExoticComponent<
  Omit<LinkedInButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, LinkedInButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with LinkedIn',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: LinkedInButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledLinkedInButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${LINKEDIN_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaLinkedin size={iconSize} />}
      {...props}
    >
      {children}
    </StyledLinkedInButton>
  )
);

LinkedInButton.displayName = LINKEDIN_BUTTON_NAME;
