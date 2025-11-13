/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FC, ReactElement } from 'react';

export const MicrosoftIcon: FC<{ size?: number }> = ({
  size
}: {
  size?: number;
}): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
  >
    <title>Microsoft</title>
    <path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" />
    <path fill="#80CC28" d="M256 121.666H134.335V0H256z" />
    <path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" />
    <path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" />
  </svg>
);
