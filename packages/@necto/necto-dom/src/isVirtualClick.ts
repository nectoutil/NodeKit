/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Event type requires any.

import { isAndroid } from '@necto/platform';

export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  // JAWS/NVDA with Firefox.
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  // Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
  // If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
  // to detect TalkBack virtual clicks.
  if (isAndroid() && (event as PointerEvent).pointerType) {
    return event.type === 'click' && event.buttons === 1;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}
