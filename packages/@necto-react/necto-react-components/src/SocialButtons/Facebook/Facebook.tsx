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
import { FaFacebook } from 'react-icons/fa6';
import styles from './Facebook.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { FacebookButtonProps } from './Facebook.types';
import type { IStyledComponent } from 'styled-components';

const FACEBOOK_BUTTON_NAME: string = 'FacebookButton' as const;

const StyledFacebookButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.FacebookButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const FacebookButton: FC<FacebookButtonProps> = forwardRef<
  HTMLButtonElement,
  FacebookButtonProps
>(
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
    }: Omit<FacebookButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledFacebookButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaFacebook size={iconSize} />}
      className={cn(className, `_necto:${FACEBOOK_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledFacebookButton>
  )
);

FacebookButton.displayName = FACEBOOK_BUTTON_NAME;
