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
import { SiHuggingface } from 'react-icons/si';
import styles from './HuggingFace.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { HuggingFaceButtonProps } from './HuggingFace.types';
import type { IStyledComponent } from 'styled-components';

const HUGGINGFACE_BUTTON_NAME = 'HuggingFaceButton';

const StyledHuggingFaceButton: IStyledComponent<'web', any> = styled(
  Button
).attrs<{ $disabled?: boolean }>((props) => ({
  className:
    `${styles.HuggingFaceButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const HuggingFaceButton: FC<HuggingFaceButtonProps> = forwardRef<
  HTMLButtonElement,
  HuggingFaceButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with HuggingFace',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<HuggingFaceButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledHuggingFaceButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<SiHuggingface size={iconSize} />}
      {...props}
    >
      {children}
    </StyledHuggingFaceButton>
  )
);

HuggingFaceButton.displayName = HUGGINGFACE_BUTTON_NAME;
