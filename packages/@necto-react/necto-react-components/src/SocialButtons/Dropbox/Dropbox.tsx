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
import { FaDropbox } from 'react-icons/fa';
import styles from './Dropbox.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { DropboxButtonProps } from './Dropbox.types';
import type { IStyledComponent } from 'styled-components';

const DROPBOX_BUTTON_NAME: string = 'DropboxButton' as const;

const StyledDropboxButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.DropboxButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const DropboxButton: ForwardRefExoticComponent<Omit<DropboxButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  DropboxButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Dropbox',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: DropboxButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledDropboxButton
      as={as}
      ref={ref}
      asChild={asChild}
      icon={<FaDropbox size={iconSize} />}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(className, `_necto:${DROPBOX_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledDropboxButton>
  )
);

DropboxButton.displayName = DROPBOX_BUTTON_NAME;
