/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import { useLayoutEffect } from 'react';

import type { UseSyncContextRefProps } from './useSyncContextRef.types';

export function useSyncContextRef<T>(
  props: UseSyncContextRefProps<T> = {}
): void {
  const { ref, context } = props;

  (typeof document !== 'undefined' ? useLayoutEffect : (): void => {})(
    (): (() => void) | undefined => {
      if (context && context.ref && ref) {
        context.ref.current = ref.current;
        return (): void => {
          if (context.ref) {
            context.ref.current = null;
          }
        };
      }
    }
  );
}
