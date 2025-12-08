/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { toValue, watch } from 'vue';
import { useAsyncState } from '@vueuse/core';

import type { MaybeRefOrGetter } from 'vue';
import type { UseImageOptions } from './types';
import type { UseAsyncStateOptions } from '@vueuse/core';

const isBrowser: boolean = typeof window !== 'undefined';

/**
 * Reactive load an image in the browser, you can wait the result to display it or show a fallback.
 *
 * @param options - Image attributes, as used in the <img> tag
 * @param asyncStateOptions - Options for useAsyncState
 */
export function useImage<Shallow extends true>(
  options: MaybeRefOrGetter<UseImageOptions>,
  asyncStateOptions: UseAsyncStateOptions<Shallow> = {}
): any {
  const state: any = useAsyncState<HTMLImageElement | undefined>(
    (): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject): void => {
        if (!isBrowser) {
          return;
        }

        const img = new Image();
        const {
          src,
          srcset,
          sizes,
          class: clazz,
          loading,
          crossorigin,
          referrerPolicy,
          width,
          height,
          decoding,
          fetchPriority,
          ismap,
          usemap
        } = toValue(options);

        img.src = src;

        if (srcset != null) img.srcset = srcset;
        if (sizes != null) img.sizes = sizes;
        if (clazz != null) img.className = clazz;
        if (loading != null) img.loading = loading;
        if (crossorigin != null) img.crossOrigin = crossorigin;
        if (referrerPolicy != null) img.referrerPolicy = referrerPolicy;
        if (width != null) img.width = width;
        if (height != null) img.height = height;
        if (decoding != null) img.decoding = decoding;
        if (fetchPriority != null) img.fetchPriority = fetchPriority;
        if (ismap != null) img.isMap = ismap;
        if (usemap != null) img.useMap = usemap;

        img.onload = (): void => resolve(img);
        img.onerror = reject;
      });
    },
    undefined,
    {
      resetOnExecute: true,
      ...asyncStateOptions
    }
  );

  if (isBrowser) {
    watch(
      (): UseImageOptions => toValue(options),
      (): any => state.execute(asyncStateOptions.delay),
      { deep: true }
    );
  }

  return state;
}
