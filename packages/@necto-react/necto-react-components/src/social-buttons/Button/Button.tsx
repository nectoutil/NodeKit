/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Social button component uses dynamic typing.
// biome-ignore-all lint/correctness/noUnusedVariables: Props destructuring.
/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { HTMLElements } from '@necto/dom';
import { forwardRef, Fragment } from 'react';
import { Primitive } from '../../Primitive/Primitive';

import type {
  ElementType,
  KeyboardEvent,
  ForwardedRef,
  ReactNode
} from 'react';
import type { FC, ReactElement } from 'react';
import type { ButtonProps } from './Button.types';

const DEFAULT_BUTTON_TAG: keyof HTMLElementTagNameMap = HTMLElements.Button;

const BrandIcon = styled.span`
  flex-shrink: 0;
  line-height: 0;
  display: inline-flex;
`;

const StyledButton = styled(Primitive)<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 40px;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:focus-visible {
    outline: none;
  }

  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

export const Button: FC<ButtonProps> = forwardRef(function SocialButton<
  T extends ElementType = typeof DEFAULT_BUTTON_TAG
>(
  {
    as = DEFAULT_BUTTON_TAG as T,
    asChild = false,
    children,
    icon,
    showIcon = true,
    iconPosition = 'left',
    disabled,
    className,
    ...props
  }: ButtonProps<T>,
  ref: ForwardedRef<Element>
): ReactElement {
  const isNativeButton: boolean =
    ((as as unknown as string)?.toLowerCase?.() ?? '') === 'button';

  const a11yProps = !isNativeButton
    ? {
        role: 'button' as const,
        tabIndex: disabled ? -1 : 0,
        'aria-disabled': !!disabled,
        onKeyDown: (e: KeyboardEvent): void => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            (props as any).onClick?.(e as any);
            e.preventDefault();
          }
        }
      }
    : { disabled };

  const iconNode: ReactNode = icon ? (
    <BrandIcon className="_necto:BrandIcon">{icon}</BrandIcon>
  ) : null;

  return (
    <StyledButton
      as={as}
      ref={ref as any}
      asChild={asChild}
      className={className}
      $disabled={disabled}
      {...a11yProps}
      {...props}
    >
      <Fragment>
        {!!iconNode && showIcon && iconPosition === 'left' && iconNode}

        {children}

        {!!iconNode && showIcon && iconPosition === 'right' && iconNode}
      </Fragment>
    </StyledButton>
  );
});
