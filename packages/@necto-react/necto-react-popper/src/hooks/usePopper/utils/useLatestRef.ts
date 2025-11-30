/**
 * Keep a ref always updated with the latest value
 * Prevents stale closures in effects
 */

import { useRef, useLayoutEffect } from 'react';

export function useLatestRef<T>(value: T): React.RefObject<T> {
  const ref: RefObject<T> = useRef(value);

  useLayoutEffect((): void => {
    ref.current = value;
  });

  return ref;
}
