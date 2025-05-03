/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  AriaRole,
  CSSProperties,
  AriaAttributes,
  HTMLAttributeAnchorTarget,
  HTMLAttributeReferrerPolicy,
  DOMAttributes as ReactDOMAttributes,
} from "react";

export interface FocusableElement extends Element, HTMLOrSVGElement {};

export interface DOMAttributes<T = FocusableElement> extends AriaAttributes, ReactDOMAttributes<T> {
  id?: string | undefined,
  role?: AriaRole | undefined,
  tabIndex?: number | undefined,
  style?: CSSProperties | undefined,
  className?: string | undefined
};

export interface FocusableElement extends Element, HTMLOrSVGElement {};

export interface LinkDOMProps {
  href?: any,
  hrefLang?: string,
  target?: HTMLAttributeAnchorTarget,
  rel?: string,
  download?: boolean | string,
  ping?: string,
  referrerPolicy?: HTMLAttributeReferrerPolicy,
  routerOptions?: any
}