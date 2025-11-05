/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FC, ReactElement } from 'react';

export const GitLabIcon: FC<{ size?: number; color?: string | null }> = ({
  size,
  color
}: {
  size?: number;
  color?: string | null;
}): ReactElement => {
  const useMulticolor: boolean = color === null || color === undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitLab Icon</title>
      <path
        fill={useMulticolor ? '#E24329' : color ?? undefined}
        d="M29.5 13.2v-.1l-3.8-9.9c-.1-.2-.2-.4-.4-.5c-.4-.2-.8-.2-1.2.1c-.1.1-.3.2-.3.4l-2.6 7.9H10.8L8.2 3.2c0-.2-.2-.3-.3-.5c-.4-.2-.8-.3-1.2 0c-.2.1-.3.2-.4.4L2.5 13v.1c-1.1 2.9-.2 6.3 2.3 8.2l5.8 4.3l2.9 2.2l1.7 1.3c.4.3 1 .3 1.4 0l1.7-1.3l2.9-2.2l5.8-4.4c2.7-1.7 3.7-5.1 2.5-8"
      />
      <path
        fill={useMulticolor ? '#FC6D26' : color ?? undefined}
        d="M29.5 13.2v-.1c-1.9.4-3.6 1.2-5.1 2.3L16 21.7c2.9 2.2 5.3 4 5.3 4l5.8-4.4c2.6-1.8 3.6-5.2 2.4-8.1"
      />
      <path
        fill={useMulticolor ? '#FCA326' : color ?? undefined}
        d="m10.7 25.8l2.9 2.2l1.7 1.3c.4.3 1 .3 1.4 0l1.7-1.3l2.9-2.2s-2.5-1.9-5.3-4c-2.9 2.1-5.3 4-5.3 4"
      />
      <path
        fill={useMulticolor ? '#FC6D26' : color ?? undefined}
        d="M7.6 15.4c-1.5-1.1-3.3-1.9-5.1-2.3v.1c-1.1 2.9-.2 6.3 2.3 8.2l5.8 4.3s2.5-1.9 5.3-4z"
      />
    </svg>
  );
};
