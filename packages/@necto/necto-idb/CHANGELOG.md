# @necto/idb

## 0.2.0

### Minor Changes

- 3c0e17f: Release `@necto/idb`, an IndexedDB key-value library for the browser.

  - `KVStore` wraps a single object store with `get`, `getMany`, `has`, `keys`, `values`, `entries`, `set`, `setMany`, `update`, `delete`, `clear`, `subscribe`, `subscribeAll` and `scope`. An optional schema type parameter checks keys and values, and `getMany` infers a tuple from the keys it is given.
  - A shared `kv` instance, also exported as `keyvalue`, over the default database.
  - `KVStoreOptions` takes `database`, `store`, `prefix`, `scope` and `onError`. Without `onError` a failed operation rejects; with it, the error is reported and the operation resolves to an empty result instead.
  - `scope(name)` returns a store confined to a key prefix. Keys are prefixed and stripped transparently, and `keys`, `values`, `entries` and `clear` stay inside the scope.
  - `subscribe` and `subscribeAll` report changes in the current tab and across tabs over `BroadcastChannel`.
  - Connections are shared per database, upgraded when a store is missing, and dropped when another tab needs a version change or the connection closes.
  - Every operation falls back to an empty result where `indexedDB` is undefined, so the package is safe to import during server rendering.
  - `getIndexedDB`, `openDatabase`, `deleteDatabase` and `promisifyRequest` for working against IndexedDB directly.
  - `KVOperations` constant, plus `KVKey`, `KVValue`, `KVListener`, `KVOperation`, `KVStoreOptions` and `OpenDatabaseOptions` types.
  - Separate development and production builds. The development build carries full error messages and is picked automatically through the `development` export condition; the production build reports a code and a link.
