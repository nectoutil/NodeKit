/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Tracks currently transitioning properties for each element
const transitionsByElement = new Map<EventTarget, Set<string>>();
// Stores callbacks to run after all transitions are finished
const transitionCallbacks = new Set<() => void>();

/**
 * Handles the start of a CSS transition.
 * Tracks which properties of which elements are currently transitioning.
 */
function onTransitionStart(e: Event): void {
  if (!('propertyName' in e) || !e.target) return;

  let transitions = transitionsByElement.get(e.target);
  if (!transitions) {
    transitions = new Set();
    transitionsByElement.set(e.target, transitions);
    (e.target as Element).addEventListener(
      'transitioncancel',
      onTransitionEnd,
      { once: true }
    );
  }
  transitions.add((e as TransitionEvent).propertyName);
}

/**
 * Handles the end or cancellation of a CSS transition.
 * Cleans up tracking and fires callbacks when all transitions are complete.
 */
function onTransitionEnd(e: Event): void {
  if (!('propertyName' in e) || !e.target) return;

  const transitions = transitionsByElement.get(e.target);
  if (!transitions) return;

  transitions.delete((e as TransitionEvent).propertyName);

  if (transitions.size === 0) {
    (e.target as Element).removeEventListener(
      'transitioncancel',
      onTransitionEnd
    );
    transitionsByElement.delete(e.target);
  }

  if (transitionsByElement.size === 0) {
    for (const cb of transitionCallbacks) {
      cb();
    }
    transitionCallbacks.clear();
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const setup = () => {
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

/**
 * Runs a callback after all current transitions have finished.
 * If no transitions are running, runs immediately.
 */
function runAfterTransition(callback: () => void): void {
  requestAnimationFrame(() => {
    // Inline cleanupDetachedElements logic
    for (const [eventTarget] of transitionsByElement) {
      if (
        'isConnected' in eventTarget &&
        !(eventTarget as Element).isConnected
      ) {
        transitionsByElement.delete(eventTarget);
      }
    }
    if (transitionsByElement.size === 0) {
      callback();
    } else {
      transitionCallbacks.add(callback);
    }
  });
}

export { runAfterTransition };
