/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react';

import type {
  DelayGroupContext,
  UseDelayGroupOptions,
  UseDelayGroupReturn,
  DelayGroupProviderProps
} from './types';

const DelayGroupCtx = createContext<DelayGroupContext | null>(null);

/**
 * Provides shared delay context for a group of floating elements.
 * @param props - Configuration options.
 * @returns Provider component wrapping children.
 */
export function DelayGroupProvider(
  props: DelayGroupProviderProps
): React.ReactElement {
  const { delay, timeoutMs = 0, children } = props;

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isInstantPhase, setIsInstantPhase] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSetCurrentId = useCallback(
    (id: string | null) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (id === null) {
        if (timeoutMs > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsInstantPhase(false);
            setCurrentId(null);
          }, timeoutMs);
        } else {
          setIsInstantPhase(false);
          setCurrentId(null);
        }
      } else {
        setCurrentId(id);
        setIsInstantPhase(true);
      }
    },
    [timeoutMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const contextValue: DelayGroupContext = {
    delay,
    setCurrentId: handleSetCurrentId,
    currentId,
    isInstantPhase,
    timeoutMs
  };

  return React.createElement(
    DelayGroupCtx.Provider,
    { value: contextValue },
    children
  );
}

/**
 * Provides delay group functionality for a floating element.
 * @param options - Configuration options.
 * @returns Delay value and group control functions.
 */
export function useDelayGroup(
  options: UseDelayGroupOptions
): UseDelayGroupReturn {
  const { id } = options;

  const context = useContext(DelayGroupCtx);

  const setAsCurrentId = useCallback(() => {
    context?.setCurrentId(id);
  }, [context, id]);

  if (!context) {
    return {
      delay: 0,
      setAsCurrentId: () => {},
      isInstantPhase: false
    };
  }

  const delay = context.isInstantPhase ? 0 : context.delay;

  return {
    delay,
    setAsCurrentId,
    isInstantPhase: context.isInstantPhase
  };
}
