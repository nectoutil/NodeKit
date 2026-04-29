// biome-ignore-all lint/suspicious/noExplicitAny: Popper hook requires any.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useLayoutEffect
} from 'react';
import { defu } from 'defu';
import { flushSync } from 'react-dom';
import { computePosition } from '@necto/popper';
import { useLocalState } from '@necto-react/state';
import { useLatestRef, useMounted } from '@necto-react/hooks';

import {
  deepEqual,
  getDevicePixelRatio,
  roundByDevicePixelRatio
} from './utils';

import type { CSSProperties, RefObject } from 'react';
import type { ComputePositionResult } from '@necto/popper';
import type { UsePopperOptions, UsePopperReturn } from './usePopper.types';

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

  // Stable reference to the latest middleware. We avoid useState here because
  // middleware is only consumed inside `update()` (never in render output), so
  // a ref is sufficient and skips the extra render that setState-during-render
  // would trigger when the middleware contents change.
  const latestMiddlewareRef = useRef(middleware);
  if (!deepEqual(latestMiddlewareRef.current, middleware)) {
    latestMiddlewareRef.current = middleware;
  }
  const latestMiddleware = latestMiddlewareRef.current;

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

  const dataRef = useRef(data);
  const isMountedRef: RefObject<boolean> = useMounted({ type: 'ref' });
  const referenceRef: RefObject<Element | null> = useRef<Element | null>(null);
  const floatingRef: RefObject<HTMLElement | null> = useRef<HTMLElement | null>(
    null
  );

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

  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const openRef = useLatestRef(open);

  // rAF-coalesce position updates so multiple `update()` calls within a single
  // frame (e.g. during fast scroll/resize bursts) collapse into one synchronous
  // commit instead of many. flushSync is preserved so the floating element
  // still positions before paint — we just don't pay for it more than once
  // per frame.
  const pendingDataRef = useRef<
    (ComputePositionResult & { isPositioned: boolean }) | null
  >(null);
  const rafIdRef = useRef<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isMountedRef is a stable ref from useMounted, not a reactive dependency.
  const flushPending = useCallback(() => {
    rafIdRef.current = null;
    const next = pendingDataRef.current;
    if (!next) return;
    pendingDataRef.current = null;

    if (isMountedRef.current && !deepEqual(dataRef.current, next)) {
      dataRef.current = next;
      flushSync(() => {
        setData(next);
      });
    }
  }, [setData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isMountedRef is a stable ref from useMounted, not a reactive dependency.
  const update = useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) return;

    computePosition(referenceRef.current, floatingRef.current, {
      placement,
      strategy,
      middleware: latestMiddleware
    }).then((positionData) => {
      pendingDataRef.current = {
        ...positionData,
        isPositioned: openRef.current !== false
      };
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(flushPending);
      }
    });
  }, [latestMiddleware, placement, strategy, openRef, flushPending]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data) => ({ ...data, isPositioned: false }));
    }
  }, [open, setData]);

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

    const x = roundByDevicePixelRatio(elements.floating, data.x);
    const y = roundByDevicePixelRatio(elements.floating, data.y);

    if (transform) {
      return {
        ...initialStyles,
        transform: `translate(${x}px, ${y}px)`,
        ...(getDevicePixelRatio(elements.floating) >= 1.5 && {
          willChange: 'transform'
        }),
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
