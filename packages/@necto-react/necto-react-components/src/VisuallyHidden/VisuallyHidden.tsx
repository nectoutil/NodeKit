/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFocusWithin } from '@necto-react/hooks';
import { forwardRef, useMemo, useState } from 'react';

import { Primitive } from '../Primitive';
import { VISUALLY_HIDDEN_NAME } from './constants';

import type { Ref, ReactElement, CSSProperties } from 'react';
import type { VisuallyHiddenProps } from './VisuallyHidden.types';

const VisuallyHiddenFn = (
  props: VisuallyHiddenProps,
  ref: Ref<any>
): ReactElement => {
  const { as, style, children, isFocusable, ...others } = props;

  const [isFocused, setFocused] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    isDisabled: !isFocusable,
    onFocusWithinChange: setFocused
  });

  const combinedStyle: CSSProperties | undefined = useMemo<
    CSSProperties | undefined
  >(() => {
    if (isFocused) {
      return style;
    }

    const hidden: CSSProperties = {
      border: 0,
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap'
    };

    return style ? { ...hidden, ...style } : hidden;
  }, [isFocused, style]);

  return (
    <Primitive
      as={as}
      ref={ref}
      {...others}
      {...focusWithinProps}
      style={combinedStyle}
    >
      {children}
    </Primitive>
  );
};

export const VisuallyHidden: ((
  props: VisuallyHiddenProps & { ref?: Ref<any> }
) => ReactElement) & { Root: any } & { [k: string]: any } = Object.assign(
  forwardRef(VisuallyHiddenFn),
  { Root: forwardRef(VisuallyHiddenFn) }
) as ((props: VisuallyHiddenProps & { ref?: Ref<any> }) => ReactElement) & {
  Root: any;
} & { [k: string]: any };

VisuallyHidden.displayName = VISUALLY_HIDDEN_NAME;
