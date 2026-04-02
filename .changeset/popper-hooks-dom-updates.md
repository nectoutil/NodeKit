---
"@necto-react/popper": minor
"@necto-react/hooks": minor
"@necto/dom": minor
---

feat: improve popper hooks, add global style injection to usePress, fix arrow positioning

- **@necto-react/popper**: Refactored all hooks to use consistent file naming (`{hookName}.types.ts`), replaced local utilities with shared necto packages (`useLatestRef`, `useMounted`, `useLocalState`, `useIsomorphicLayoutEffect`, `mergeProps`, `mergeRefs`), moved `PopperPortal` component to components directory, fixed `useTransitionStyles` to derive `transitionProperty` from style keys instead of hardcoding `"opacity, transform"`, fixed `PopperArrow` centering with `left: 50%`/`top: 50%` and transform merging, added `useTransitionStyles` tests
- **@necto-react/hooks**: Added `useIsomorphicLayoutEffect` hook for SSR-safe layout effects, added `styleInjection` option to `usePress` (defaults to `'global'`) for injecting `touch-action` via a shared `<style>` tag instead of inline styles, added `elementId` option to `useStyleInjection`
- **@necto/dom**: Added `elementId` option to `injectStyle` for setting a user-facing HTML `id` attribute separate from the internal `necto-style-id` tracking attribute
