import { useEffect, useRef, useState, useCallback } from 'react';

import type { RefObject } from 'react';

interface ElementVisibilityProps {
  // How much of hte element must be visible for it to be in view.
  threshold?: number | number[];

  // Margin around the root.
  rootMargin?: string;

  // The root that will be used for detection.
  root?: Element | null;

  // Wether the element should be set to false if goes out of view.
  once?: boolean;
}

function useElementVisibility<T extends Element = Element>(
  elementRef?: RefObject<T> | null,
  props: ElementVisibilityProps = {}
): [boolean, RefObject<T>] {
  const { threshold = 0, rootMargin, root = null, once = false } = props;

  const internalRef = useRef<T>(null!);
  const ref = elementRef || internalRef;

  const [isVisible, setIsVisible] = useState(false);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      let latest = entries[0];
      for (const entry of entries) {
        if (entry.time > latest.time) latest = entry;
      }
      setIsVisible(latest.isIntersecting);

      // If "once" is true, disconnect after first intersection
      if (once && latest.isIntersecting) {
        observer.disconnect();
      }
    },
    [once]
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Create the observer with the provided options
    const observer = new window.IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin
    });

    observer.observe(node);

    // Cleanup on unmount or dependency change
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, root, observerCallback]);

  return [isVisible, ref];
}

export { useElementVisibility, type ElementVisibilityProps };
