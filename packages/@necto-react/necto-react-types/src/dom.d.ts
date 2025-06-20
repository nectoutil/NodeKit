/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  AriaRole,
  CSSProperties,
  AriaAttributes,
  HTMLAttributeAnchorTarget,
  HTMLAttributeReferrerPolicy,
  DOMAttributes as ReactDOMAttributes
} from 'react';

/**
 * Props for DOM elements that may require an id.
 */
export interface DOMProps {
  /** The unique id for the DOM element. */
  id?: string | undefined;
}

/**
 * Props for focusable DOM elements, extending basic DOM props.
 */
export interface FocusableDOMProps extends DOMProps {
  /**
   * Whether the element should be excluded from the tab order.
   */
  excludeFromTabOrder?: boolean;
}

/**
 * Standard DOM attributes for focusable elements, including ARIA and React DOM attributes.
 *
 * @template T The element type, defaults to FocusableElement.
 */
export interface DOMAttributes<T = FocusableElement>
  extends AriaAttributes,
    ReactDOMAttributes<T> {
  /** The unique id for the DOM element. */
  id?: string | undefined;

  /** The ARIA role for the element. */
  role?: AriaRole | undefined;

  /** The tab index of the element. */
  tabIndex?: number | undefined;

  /** Inline CSS styles for the element. */
  style?: CSSProperties | undefined;

  /** The CSS class name for the element. */
  className?: string | undefined;
}

/**
 * Props for anchor/link elements.
 */
export interface LinkDOMProps {
  /** The URL to link to. */
  href?: string | undefined;

  /** The language of the linked resource. */
  hrefLang?: string;

  /** The browsing context for the link. */
  target?: HTMLAttributeAnchorTarget;

  /** The relationship of the linked resource. */
  rel?: string;

  /** Prompts the user to save the linked URL instead of navigating to it. */
  download?: boolean | string;

  /** Space-separated list of URLs to notify when the user follows the hyperlink. */
  ping?: string;

  /** Referrer policy for the link. */
  referrerPolicy?: HTMLAttributeReferrerPolicy;

  /** Additional router options (type depends on router implementation). */
  routerOptions?: unknown;
}
