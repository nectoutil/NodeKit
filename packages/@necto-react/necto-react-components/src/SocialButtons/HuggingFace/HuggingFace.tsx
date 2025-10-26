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

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { HuggingFaceButtonProps } from './HuggingFace.types';
import type { IStyledComponent } from 'styled-components';

const HUGGINGFACE_BUTTON_NAME = 'HuggingFaceButton';

const StyledHuggingFaceButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #ffcc00;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #e6b800;
  }

  &:active {
    background-color: #cca300;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #ffcc00;
    }
  `}
`;

export const HuggingFaceButton: ForwardRefExoticComponent<Omit<HuggingFaceButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
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
    }: HuggingFaceButtonProps,
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
