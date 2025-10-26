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
import { FaSlack } from 'react-icons/fa';
import styles from './Slack.module.scss';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SlackButtonProps } from './Slack.types';
import type { IStyledComponent } from 'styled-components';

const SLACK_BUTTON_NAME = 'SlackButton';

const StyledSlackButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.SlackButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const SlackButton: ForwardRefExoticComponent<Omit<SlackButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SlackButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Slack',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SlackButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSlackButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaSlack size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSlackButton>
  )
);

SlackButton.displayName = SLACK_BUTTON_NAME;
