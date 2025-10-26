/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Else } from '../Else';
import { Fragment, Children } from 'react';

import type { IfProps } from './If.types';
import type { ReactElement } from 'react';

export const If = (props: IfProps): ReactElement | null => {
  const { condition, keepAlive, children } = props;

  if (!children) {
    return null;
  }

  const conditionResult: boolean = Boolean(
    typeof condition === 'function' ? condition() : condition
  );

  return (
    <Fragment>
      {(Children.toArray(children) as ReactElement[]).find(
        (c) => (c.type !== Else) !== !conditionResult
      ) || null}
    </Fragment>
  );
};
