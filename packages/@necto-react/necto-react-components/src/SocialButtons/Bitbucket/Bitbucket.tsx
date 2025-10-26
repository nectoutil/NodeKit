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
import styles from './Bitbucket.module.scss';
import { BitbucketIcon } from './Bitbucket.icon';

import type { IStyledComponent } from 'styled-components';
import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BitbucketButtonProps } from './Bitbucket.types';

const BITBUCKET_BUTTON_NAME: string = 'BitbucketButton' as const;

const StyledBitbucketButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.BitbucketButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

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
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<BitbucketIcon size={iconSize} />}
      className={cn(className, `_necto:${BITBUCKET_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledBitbucketButton>
  )
);

BitbucketButton.displayName = BITBUCKET_BUTTON_NAME;
