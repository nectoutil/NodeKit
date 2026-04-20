// biome-ignore-all lint/suspicious/noExplicitAny: Focusable types require any.

import type { FocusableDOMProps, FocusEvents } from '@necto-react/types';

/**
 * Options for the useFocusable hook.
 */
export interface UseFocusableOptions extends FocusableDOMProps, FocusEvents {
  isDisabled?: boolean;

  autoFocus?: boolean;
}

export type UseFocusableReturn = Readonly<{
  focusableProps: Record<string, any>;
}>;
