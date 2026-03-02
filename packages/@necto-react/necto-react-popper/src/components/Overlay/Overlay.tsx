/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';

import type { OverlayProps } from './Overlay.types';

export function Overlay(props: OverlayProps) {
  const { lockScroll = false, style, ...rest } = props;

  useEffect(() => {
    if (!lockScroll) return;

    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [lockScroll]);

  return (
    <div
      {...rest}
      style={{
        position: 'fixed',
        inset: 0,
        ...style
      }}
    />
  );
}
