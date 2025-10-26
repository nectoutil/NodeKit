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
import { FaAtlassian } from 'react-icons/fa';
import styles from './Atlassian.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AtlassianButtonProps } from './Atlassian.types';
import type { IStyledComponent } from 'styled-components';

const ATLASSIAN_BUTTON_NAME: string = 'AtlassianButton' as const;

const StyledAtlassianButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.AtlassianButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const AtlassianButton: ForwardRefExoticComponent<Omit<AtlassianButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  AtlassianButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Atlassian',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: AtlassianButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledAtlassianButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaAtlassian size={iconSize} />}
      className={cn(className, `_necto:${ATLASSIAN_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledAtlassianButton>
  )
);

AtlassianButton.displayName = ATLASSIAN_BUTTON_NAME;
