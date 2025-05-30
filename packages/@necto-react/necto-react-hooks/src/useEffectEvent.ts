import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef(fn);

  useIsomorphicLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    ((...args: Parameters<T>): ReturnType<T> => {
      return fnRef.current(...args);
    }) as T,
    []
  );
}
