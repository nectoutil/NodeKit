/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getCurrentInstance, onMounted, shallowRef } from 'vue';

import type { ComponentInternalInstance, ShallowRef } from 'vue';

export function useMounted(): ShallowRef<boolean, boolean> {
  const isMounted: ShallowRef<boolean, boolean> = shallowRef(false);

  const instance: ComponentInternalInstance | null = getCurrentInstance();

  if (instance) {
    onMounted((): void => {
      isMounted.value = true;
    }, instance);
  }

  return isMounted;
}
