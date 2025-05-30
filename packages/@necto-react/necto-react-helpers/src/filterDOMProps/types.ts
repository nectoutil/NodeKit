/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LinkDOMProps } from '@necto-react/types';

/**
 * Options for filtering DOM props.
 */
interface FilterOptions {
  /** Whether to allow labelable props (e.g., htmlFor, aria-label). */
  allowLabelableProps?: boolean;

  /** Whether to allow link-related props (e.g., href, target). */
  allowLinkProps?: boolean;

  /** Extra prop names to allow through the filter. */
  extraAllowedProps?: Set<string>;

  /** Custom set of allowed labelable prop names. */
  allowedLabelableProps?: Set<string>;

  /** Custom set of allowed link-related prop names. */
  allowedLinkProps?: Set<string>;
}

/**
 * Props allowed for DOM filtering, including link props and id.
 */
interface FilterDOMProps extends LinkDOMProps {
  /** The id attribute for the element. */
  id?: string;
}

/**
 * Return type for filtered DOM props.
 */
interface FilterDOMReturn {
  /** The id attribute for the element. */
  id?: string;
}
export type { FilterOptions, FilterDOMProps, FilterDOMReturn };
