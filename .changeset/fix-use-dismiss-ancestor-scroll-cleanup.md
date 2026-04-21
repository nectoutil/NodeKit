---
"@necto-react/popper": patch
---

Fix a `TypeError: Cannot read properties of null (reading 'removeEventListener')` thrown on unmount when `useDismiss` was configured with `ancestorScroll: true`. The ancestor-traversal loop captured its `current` variable by reference in each cleanup closure, so by the time React invoked them the binding had already been reassigned to `null`. Each cleanup closure now captures its element in a per-iteration `const`, so scroll listeners are correctly removed from the exact element they were attached to.
