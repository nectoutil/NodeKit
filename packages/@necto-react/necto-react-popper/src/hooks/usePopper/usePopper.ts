// biome-ignore-all lint/suspicious/noExplicitAny: Popper hook requires any.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defu } from 'defu';
import { flushSync } from 'react-dom';
import { computePosition } from '@necto/popper';
import { useLatestRef } from '@necto-react/hooks';
import { useLocalState } from '@necto-react/state';
import { useMemo, useCallback, useRef, useLayoutEffect } from 'react';

import type { CSSProperties } from 'react';
import type { ComputePositionResult } from '@necto/popper';
import type { UsePopperOptions, UsePopperReturn } from './usePopper.types';

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

  const [latestMiddleware, setLatestMiddleware] = useLocalState(middleware);

  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }

  const [data, setData] = useLocalState<
    ComputePositionResult & { isPositioned: boolean }
  >({
    x: 0,
    y: 0,
    placement,
    strategy,
    middlewareData: {},
    isPositioned: false
  });

  const [_reference, _setReference] = useLocalState<Element | null>(null);
  const [_floating, _setFloating] = useLocalState<HTMLElement | null>(null);

  const referenceRef = useRef<Element | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const dataRef = useRef(data);
  const isMountedRef = useRef(false);

  const setReference = useCallback(
    (node: Element | null) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    },
    [_setReference]
  );

  const setFloating = useCallback(
    (node: HTMLElement | null) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    },
    [_setFloating]
  );

  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;

  const _hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const openRef = useLatestRef(open);

  const update = useCallback(() => {
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
        flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, openRef, setData]);

  useLayoutEffect(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data) => ({ ...data, isPositioned: false }));
    }
  }, [open, setData]);

  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;

    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef]);

  const refs = useMemo(
    () => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }),
    [setReference, setFloating]
  );

  const elements = useMemo(
    () => ({ reference: referenceEl, floating: floatingEl }),
    [referenceEl, floatingEl]
  );

  const floatingStyles = useMemo(() => {
    const initialStyles: CSSProperties = {
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
        ...(getDPR(elements.floating) >= 1.5 && { willChange: 'transform' }),
        ...(!data.isPositioned && { visibility: 'hidden' as const })
      };
    }

    return {
      position: strategy,
      left: x,
      top: y,
      ...(!data.isPositioned && { visibility: 'hidden' as const })
    };
  }, [
    strategy,
    transform,
    elements.floating,
    data.x,
    data.y,
    data.isPositioned
  ]);

  return useMemo(
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
