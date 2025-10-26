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
import { FaLinkedin } from 'react-icons/fa';
import styles from './LinkedIn.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LinkedInButtonProps } from './LinkedIn.types';
import type { IStyledComponent } from 'styled-components';

const LINKEDIN_BUTTON_NAME = 'LinkedInButton';

const StyledLinkedInButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.LinkedInButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const LinkedInButton: ForwardRefExoticComponent<Omit<LinkedInButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  LinkedInButtonProps
>(
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
      className={className}
      iconPosition={iconPosition}
      icon={<FaLinkedin size={iconSize} />}
      {...props}
    >
      {children}
    </StyledLinkedInButton>
  )
);

LinkedInButton.displayName = LINKEDIN_BUTTON_NAME;
