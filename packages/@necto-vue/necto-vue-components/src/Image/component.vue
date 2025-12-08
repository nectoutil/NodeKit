<!--
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 -->

<template>
  <slot
    v-if="props.custom"
    :img-attrs="imgAttrs"
    :is-loaded="isLoaded"
    :has-error="hasError"
  />

  <span
    v-else-if="props.inline && svgContent"
    class="necto-image necto-image--inline"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: props.width ? `${props.width}px` : undefined,
      height: props.height ? `${props.height}px` : undefined,
    }"
    v-html="svgContent"
  />

  <svg
    v-else-if="hasError"
    xmlns="http://www.w3.org/2000/svg"
    :width="props.width || '100%'"
    :height="props.height || 200"
    viewBox="0 0 16 16"
    preserveAspectRatio="xMidYMid slice"
  >
    <rect width="16" height="16" fill="#eee" />
    <path d="M4 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm8 6.5l-3-3-1.5 1.5-2-2L2 12h12v-0.5z" fill="#aaa" />
  </svg>

  <img
    v-else
    v-bind="imgAttrs"
    @load="onLoad"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { transformProps } from '@necto/image';

import type { Ref } from 'vue';
import type { ImageAttributes } from '@necto/image';
import type { ImageProps, ImageEmits, ImageSlotProps } from './types';

const props = defineProps<ImageProps>();
const emit: ImageEmits = defineEmits<ImageEmits>();

defineSlots<{
  default(props: ImageSlotProps): unknown;
}>();

const isLoaded: Ref<boolean, boolean> = ref<boolean>(false);
const hasError: Ref<boolean, boolean> = ref<boolean>(false);
const svgContent: Ref<string | null, string | null> = ref<string | null>(null);

const imgAttrs = computed<ImageAttributes & { alt: string }>(() => {
  const transformed: ImageAttributes = transformProps({
    src: props.src,
    width: props.width,
    height: props.height,
    aspectRatio: props.aspectRatio,
    layout: props.layout,
    priority: props.priority,
    background: props.background,
    objectFit: props.objectFit,
    unstyled: props.unstyled
  });

  return {
    ...transformed,
    alt: props.alt,
    sizes: Array.isArray(props.sizes) ? props.sizes.join(', ') : props.sizes
  };
});

async function fetchSvg(url: string): Promise<void> {
  try {
    const response = await fetch(url);
    const text: string = await response.text();

    if (text.includes('<svg')) {
      svgContent.value = text;
      isLoaded.value = true;
    } else {
      hasError.value = true;
    }
  } catch {
    hasError.value = true;
  }
}

watch(
  (): readonly [string, boolean] => [props.src, props.inline] as const,
  ([src, inline]: readonly [string, boolean]): void => {
    if (inline && src?.endsWith('.svg')) {
      fetchSvg(src);
    }
  },
  { immediate: true }
);

function onLoad(event: Event): void {
  isLoaded.value = true;
  hasError.value = false;
  emit('load', event);
}

function onError(event: Event): void {
  hasError.value = true;
  emit('error', event);
}
</script>
