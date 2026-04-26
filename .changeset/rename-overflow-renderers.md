---
'@necto-react/components': minor
---

Rename Overflow component renderer props for clarity.

- `renderItem` (unchanged from original API)
- `renderMore` → `renderOverflow`

Earlier 3.2.x releases shipped these props but had broken type imports due to a
build issue (hashed `.d.ts` filenames), so adoption is expected to be minimal.
The rename clarifies that the prop renders the overflow indicator slot, not
literally "more" content.

Migration:

```tsx
// Before
<Overflow
  items={tags}
  renderItem={(tag) => <Tag key={tag.id}>{tag.label}</Tag>}
  renderMore={({ count }) => <Chip>+{count}</Chip>}
/>

// After
<Overflow
  items={tags}
  renderItem={(tag) => <Tag key={tag.id}>{tag.label}</Tag>}
  renderOverflow={({ count, hidden }) => <Chip>+{count}</Chip>}
/>
```
