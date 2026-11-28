# @necto/cookie

## 1.1.3

### Patch Changes

- Updated dependencies [3e16777]
  - @necto/dom@1.13.0

## 1.1.2

### Patch Changes

- Updated dependencies [b0227ba]
  - @necto/dom@1.12.0

## 1.1.0

### Minor Changes

- 3c0e17f: Release `@necto/cookie`, a cookie library for the browser and the server.

  - `parseCookie` parses a `Cookie` header into a null-prototype object (first value wins, safe percent-decoding).
  - `parseSetCookie` parses a `Set-Cookie` header into a cookie with typed attributes.
  - `stringifySetCookie` builds a `Set-Cookie` string and validates names, values, attributes, `SameSite=None`/`Partitioned` requiring `Secure`, `__Secure-`/`__Host-` prefix rules and the 4096-byte limit.
  - `CookieSameSite` and `CookiePriority` constants.
  - `@necto/cookie/browser` entry with `CookieClient` and a shared `cookies` instance: `get`, `getAll`, `has`, `set`, `delete`, `subscribe` and `withAttributes`. Changes are synced across clients, tabs (Cookie Store API, with a `BroadcastChannel` and window-focus fallback) and are safe to import during SSR.
