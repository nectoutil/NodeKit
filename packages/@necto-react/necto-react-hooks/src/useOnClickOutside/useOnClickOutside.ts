import { useEventListener } from '../useEventListener';

import type { RefObject } from 'react';
import type { UseOnClickOutsideOptions } from './useOnClickOutside.types';

export function useOnClickOutside<T extends Element = Element>(
  ref: RefObject<T | null> | Array<RefObject<T | null>>,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  options?: UseOnClickOutsideOptions
): void {
  const { eventType = 'mousedown', eventListenerOptions = { passive: true } } =
    options ?? {};

  useEventListener(
    eventType,
    (event): void => {
      const target = event.target as Node | null;

      if (!target?.isConnected) {
        return;
      }

      const refs: ReadonlyArray<RefObject<T | null>> = Array.isArray(ref)
        ? ref
        : [ref];

      const isInside: boolean = refs.some((r): boolean =>
        Boolean(r.current?.contains(target))
      );

      if (!isInside) {
        handler(event as MouseEvent | TouchEvent | FocusEvent);
      }
    },
    undefined,
    eventListenerOptions
  );
}
