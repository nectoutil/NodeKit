/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import type { RefObject, Ref } from "react";

export function mergeRefs<T>(...refs: Array<Ref<T> | RefObject<T> | null | undefined>): Ref<T> {
  if (refs.length === 1 && refs[0]) {
    return refs[0];
  }

  return (value: T | null) => {
    let hasCleanup = false;

    const cleanups = refs.map(ref => {
      const cleanup = setRef(ref, value);
      hasCleanup ||= typeof cleanup == 'function';
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        cleanups.forEach((cleanup, i) => {
          if (typeof cleanup === 'function') {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        });
      };
    }
  };
}

function setRef<T>(ref: Ref<T> | RefObject<T> | null | undefined, value: T) {
  if (typeof ref === 'function') {
    return ref(value);
  } else if (ref != null) {
    ref.current = value;
  }
}