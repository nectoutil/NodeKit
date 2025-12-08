/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HTMLProps, MutableRefObject } from 'react';

export type ElementProps = Record<string, unknown>;

export interface FloatingContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refs: {
    reference: MutableRefObject<Element | null>;
    floating: MutableRefObject<HTMLElement | null>;
  };
  elements: {
    reference: Element | null;
    floating: HTMLElement | null;
  };
  dataRef: MutableRefObject<Record<string, unknown>>;
}

export interface InteractionProps {
  reference: ElementProps;
  floating: ElementProps;
  item?: ElementProps;
}
