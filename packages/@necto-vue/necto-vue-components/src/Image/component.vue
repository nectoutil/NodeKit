<!--
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 -->

<template>
  <slot
    v-if="custom"
    :img-attrs="imgAttrs"
    :is-loaded="isLoaded"
    :has-error="hasError"
  />

  <span
    v-else-if="inline"
    class="_necto:image"
    v-html="svgContent"
  />

  <svg
    v-else-if="hasError"
    xmlns="http://www.w3.org/2000/svg"
    :width="computedWidth || '100%'"
    :height="computedHeight || 200"
    viewBox="0 0 16 16"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect width="16" height="16" fill="#eee" />
    <path d="M4 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm8 6.5l-3-3-1.5 1.5-2-2L2 12h12v-0.5z" fill="#aaa" />
  </svg>

  <img v-else v-bind="imgAttrs" />
</template>

<script setup lang="ts">
import { transformProps } from '@necto/image';
import { ref, computed, watch, toRefs } from 'vue';
import { useMounted, useImage } from '@necto-vue/composables';
import { isSvgContent, injectSvgDimensions } from '@necto/dom';

import type { Ref, ComputedRef, ShallowRef } from 'vue';
import type { ImageAttributes } from '@necto/image';
import type { ImageProps, ImageEmits, ImageSlotProps } from './types';

const props = defineProps<ImageProps>();
const emit: ImageEmits = defineEmits<ImageEmits>();

defineSlots<{
  default(props: ImageSlotProps): unknown;
}>();

const { inline, custom, src } = toRefs(props);
const isMounted: ShallowRef<boolean> = useMounted();
const svgContent: Ref<string | null> = ref<string | null>(null);

const computedWidth: ComputedRef<string | number | undefined> = computed(
  (): string | number | undefined => props.width ?? props.size
);
const computedHeight: ComputedRef<string | number | undefined> = computed(
  (): string | number | undefined => props.height ?? props.size
);

const inlineWidth: ComputedRef<string> = computed((): string =>
  computedWidth.value ? `${computedWidth.value}px` : 'auto'
);
const inlineHeight: ComputedRef<string> = computed((): string =>
  computedHeight.value ? `${computedHeight.value}px` : 'auto'
);

const imageOptions: ComputedRef<{
  src: string;
  width: number | undefined;
  height: number | undefined;
}> = computed(() => ({
  src: inline.value ? '' : src.value,
  width:
    typeof computedWidth.value === 'number' ? computedWidth.value : undefined,
  height:
    typeof computedHeight.value === 'number' ? computedHeight.value : undefined
}));

const { error: imageError, isReady } = useImage(imageOptions);

const isLoaded: ComputedRef<boolean> = computed((): boolean =>
  inline.value ? !!svgContent.value : isReady.value
);
const hasError: ComputedRef<boolean> = computed((): boolean =>
  inline.value ? false : imageError.value != null
);

watch(isReady, (ready: boolean): void => {
  if (ready && !inline.value) emit('load', new Event('load'));
});

watch(imageError, (err: unknown): void => {
  if (err && !inline.value) emit('error', new Event('error'));
});

const imgAttrs: ComputedRef<ImageAttributes & { alt: string }> = computed(
  () => ({
    ...transformProps({
      src: src.value,
      width: computedWidth.value,
      height: computedHeight.value,
      aspectRatio: props.aspectRatio,
      layout: props.layout,
      priority: props.priority,
      background: props.background,
      objectFit: props.objectFit,
      unstyled: props.unstyled
    }),
    width: computedWidth.value,
    height: computedHeight.value,
    alt: props.alt,
    sizes: Array.isArray(props.sizes) ? props.sizes.join(', ') : props.sizes
  })
);

async function fetchInlineSvg(url: string): Promise<void> {
  try {
    const response = await fetch(url);
    const text: string = await response.text();

    if (isSvgContent(text, { validate: false })) {
      svgContent.value = injectSvgDimensions(
        text,
        computedWidth.value ?? '100%',
        computedHeight.value ?? '100%'
      );
    }
  } catch {}
}

watch(
  () => [src.value, inline.value, isMounted.value] as const,
  ([url, isInline, mounted]) => {
    if (mounted && isInline && url) fetchInlineSvg(url);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
._necto\:image {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: v-bind(inlineWidth);
  height: v-bind(inlineHeight);
}
</style>