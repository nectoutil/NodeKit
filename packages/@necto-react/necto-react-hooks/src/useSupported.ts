/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useMounted } from '@necto-react/hooks';

/**
 * React hook that determines if a browser feature is supported.
 *
 * @param {() => unknown} fn - Function that tests for feature support.
 * @returns {boolean} Whether the feature is supported in the current environment.
 */
export function useSupported(fn: () => unknown): boolean {
  const isMounted = useMounted();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (isMounted()) {
      setIsSupported(Boolean(fn()));
    }
  }, [fn, isMounted]);

  return isSupported;
}
