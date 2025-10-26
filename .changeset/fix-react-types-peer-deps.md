---
'@necto-react/components': patch
---

Fix TypeScript type conflicts by moving @types/react to peerDependencies. This resolves "cannot be used as a JSX component" errors when consuming the package.
