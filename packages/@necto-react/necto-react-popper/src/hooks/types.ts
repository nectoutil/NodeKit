/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';

export type ElementProps = Record<string, unknown>;

export interface PopperContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refs: {
    reference: RefObject<Element | null>;
    floating: RefObject<HTMLElement | null>;
  };
  elements: {
    reference: Element | null;
    floating: HTMLElement | null;
  };
  dataRef: RefObject<Record<string, unknown>>;
}

export interface InteractionProps {
  reference: ElementProps;
  floating: ElementProps;
  item?: ElementProps;
}
