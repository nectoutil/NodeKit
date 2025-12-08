import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { defu } from 'defu';
import { useLatestRef } from '@necto-react/hooks';
import { computePosition } from '@necto/popper';
import type { UsePopperOptions, UsePopperReturn } from './usePopper.types';
import type { ComputePositionResult } from '@necto/popper';

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a == null ||
    b == null
  ) {
    return a === b;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

function getDPR(element: Element): number {
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element: Element, value: number): number {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

export function usePopper(options: UsePopperOptions = {}): UsePopperReturn {
  const {
    placement,
    strategy,
    middleware,
    reference: externalReference,
    floating: externalFloating,
    transform,
    whileElementsMounted,
    open
  } = defu(options, {
    placement: 'bottom' as const,
    strategy: 'absolute' as const,
    middleware: [],
    transform: true
  });

  const [latestMiddleware, setLatestMiddleware] = React.useState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const [data, setData] = React.useState<
    ComputePositionResult & { isPositioned: boolean }
  >({
    x: 0,
    y: 0,
    placement,
    strategy,
    middlewareData: {},
    isPositioned: false
  });

  const [_reference, _setReference] = React.useState<Element | null>(null);
  const [_floating, _setFloating] = React.useState<HTMLElement | null>(null);

  const referenceRef = React.useRef<Element | null>(null);
  const floatingRef = React.useRef<HTMLElement | null>(null);
  const dataRef = React.useRef(data);
  const isMountedRef = React.useRef(false);

  const setReference = React.useCallback((node: Element | null) => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);

  const setFloating = React.useCallback((node: HTMLElement | null) => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);

  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;

  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const openRef = useLatestRef(open);

  const update = React.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) return;

    computePosition(referenceRef.current, floatingRef.current, {
      placement,
      strategy,
      middleware: latestMiddleware
    }).then((positionData) => {
      const fullData = {
        ...positionData,
        isPositioned: openRef.current !== false
      };

      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        ReactDOM.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, openRef]);

  React.useLayoutEffect(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data) => ({ ...data, isPositioned: false }));
    }
  }, [open]);

  React.useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  React.useLayoutEffect(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;

    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [
    referenceEl,
    floatingEl,
    update,
    whileElementsMountedRef,
    hasWhileElementsMounted
  ]);

  const refs = React.useMemo(
    () => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }),
    [setReference, setFloating]
  );

  const elements = React.useMemo(
    () => ({ reference: referenceEl, floating: floatingEl }),
    [referenceEl, floatingEl]
  );

  const floatingStyles = React.useMemo(() => {
    const initialStyles: React.CSSProperties = {
      position: strategy,
      left: 0,
      top: 0
    };

    if (!elements.floating) return initialStyles;

    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);

    if (transform) {
      return {
        ...initialStyles,
        transform: `translate(${x}px, ${y}px)`,
        ...(getDPR(elements.floating) >= 1.5 && { willChange: 'transform' })
      };
    }

    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);

  return React.useMemo(
    () => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }),
    [data, update, refs, elements, floatingStyles]
  );
}
