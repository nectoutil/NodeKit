// biome-ignore-all lint/security/noDangerouslySetInnerHtml: eval to dom with svg data is fine.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import { If } from '../../Conditionals/If';
import GoogleLogo from '@iconify/icons-logos/google';
import { Primitive } from '../../Primitive/Primitive';

import type { ReactElement } from 'react';
import type { GoogleButtonProps } from './Google.types';
import type { ElementType, CSSProperties } from 'react';

export const GoogleButton = forwardRef<
  HTMLButtonElement,
  GoogleButtonProps<ElementType>
>(
  (
    {
      as = 'button',
      asChild = false,
      children = 'Continue with Google',
      iconPosition = 'left',
      showIcon = true,
      style,
      ...props
    },
    ref
  ): ReactElement => {
    const defaultStyles: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#fff',
      color: '#3c4043',
      border: '1px solid #dadce0',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      cursor: 'pointer',
      transition: 'background-color 0.2s, box-shadow 0.2s',
      ...style
    };

    return (
      <Primitive
        as={as}
        ref={ref}
        asChild={asChild}
        style={defaultStyles}
        {...props}
      >
        <If condition={showIcon && iconPosition === 'left'}>
          <svg
            width={18}
            height={18}
            viewBox={`0 0 ${GoogleLogo.width} ${GoogleLogo.height}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: GoogleLogo.body }}
          />
        </If>

        {children}

        <If condition={showIcon && iconPosition === 'right'}>
          <svg
            width={18}
            height={18}
            viewBox={`0 0 ${GoogleLogo.width} ${GoogleLogo.height}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: GoogleLogo.body }}
          />
        </If>
      </Primitive>
    );
  }
);
