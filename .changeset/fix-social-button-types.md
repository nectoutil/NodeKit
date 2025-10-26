---
'@necto-react/components': patch
---

Fix social button component type annotations to resolve "cannot be used as a JSX component" errors. All button components now use explicit ForwardRefExoticComponent types instead of FC, ensuring proper TypeScript compatibility when consuming the package.
