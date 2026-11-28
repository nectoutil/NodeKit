/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const transitionsByElement = new Map<EventTarget, Set<string>>();
const transitionCallbacks = new Set<() => void>();

export function runAfterTransition(callback: () => void): void {
  requestAnimationFrame(() => {
    cleanupDetachedTransitions();

    if (transitionsByElement.size === 0) {
      callback();
    } else {
      transitionCallbacks.add(callback);
    }
  });
}

function cleanupDetachedTransitions(): void {
  for (const [target] of transitionsByElement) {
    if ('isConnected' in target && !(target as Element).isConnected) {
      transitionsByElement.delete(target);
    }
  }
}

function onTransitionStart(event: Event): void {
  if (!('propertyName' in event) || !event.target) return;

  let transitions = transitionsByElement.get(event.target);

  if (!transitions) {
    transitions = new Set();
    transitionsByElement.set(event.target, transitions);
    (event.target as Element).addEventListener('transitioncancel', onTransitionEnd, { once: true });
  }

  transitions.add((event as TransitionEvent).propertyName);
}

function onTransitionEnd(event: Event): void {
  if (!('propertyName' in event) || !event.target) return;

  const transitions = transitionsByElement.get(event.target);
  if (!transitions) return;

  transitions.delete((event as TransitionEvent).propertyName);

  if (transitions.size === 0) {
    (event.target as Element).removeEventListener('transitioncancel', onTransitionEnd);
    transitionsByElement.delete(event.target);
  }

  if (transitionsByElement.size === 0) {
    for (const callback of transitionCallbacks) {
      callback();
    }

    transitionCallbacks.clear();
  }
}

function setupTransitionListeners(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const setup = (): void => {
    const body = document.body;
    if (!body) return;

    body.addEventListener('transitionrun', onTransitionStart);
    body.addEventListener('transitionend', onTransitionEnd);
  };

  if (document.readyState !== 'loading') {
    setup();
  } else {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  }
}

setupTransitionListeners();
