---
'@necto-react/hooks': minor
'@necto/types': minor
---

Add `useEventListener` and `useOnClickOutside` hooks.

## `useEventListener`

Subscribe to a DOM event for the lifetime of a component. Single signature
with conditional types — narrows event payload from the target ref:

```tsx
// Window event (default target)
useEventListener('resize', handleResize);

// Element event — `event` typed as MouseEvent automatically
const buttonRef = useRef<HTMLButtonElement>(null);
useEventListener('click', (event) => console.log(event.button), buttonRef);

// MediaQueryList — `event` typed as MediaQueryListEvent automatically
const mql = useRef(window.matchMedia('(prefers-color-scheme: dark)'));
useEventListener('change', (event) => setDark(event.matches), mql);
```

Supports targets: `Window`, `Document`, `HTMLElement`, `SVGElement`,
`MediaQueryList`. Includes an `enabled` option for toggling the
subscription without unmounting the host component.

## `useOnClickOutside`

Fire a handler when an interaction happens outside one or more refs.
Composes on top of `useEventListener`:

```tsx
const menuRef = useRef<HTMLDivElement>(null);
useOnClickOutside(menuRef, () => setOpen(false));

// Multiple refs — handler only fires when target is outside all of them
useOnClickOutside([menuRef, triggerRef], close, { eventType: 'mouseup' });
```

Defaults: `eventType: 'mousedown'` (fastest dismiss), listener attached
with `{ passive: true }` since the hook never calls `preventDefault`.
Skips if the click target is detached from the document.

## `InteractionEventName` type added to `@necto/types`

Shared string-literal union covering pointer-down/up, touch-start/end, and
focus-in/out events. Used by `useOnClickOutside` and intended for any
hook that exposes a configurable interaction-trigger event name.
