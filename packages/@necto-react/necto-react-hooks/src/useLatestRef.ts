import { useRef, useLayoutEffect } from 'react';

import type { RefObject } from 'react';

export function useLatestRef<T>(value: T): React.RefObject<T> {
  const ref: RefObject<T> = useRef(value);
  useLayoutEffect((): void => {
    ref.current = value;
  });
  return ref;
}
