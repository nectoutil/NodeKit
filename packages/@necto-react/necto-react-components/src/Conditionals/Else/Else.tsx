/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment } from 'react';

import type { ElseProps } from './Else.types';
import type { ReactElement } from 'react';

export const Else = (props: ElseProps): ReactElement => {
  const { children } = props;

  return (
    <Fragment>
      {typeof children === 'function' ? children() : children}
    </Fragment>
  );
};
