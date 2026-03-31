<div align="center">
  <a href="https://necto.dev">
    <img alt="Necto Logo" src="https://avatars.githubusercontent.com/u/158605331?s=100&v=4">
  <a>

<h2>Necto - Popover Positioning Engine</h2>

  <p>Necto's Core positioning engine for popovers, tooltips, dropdowns, and floating elements.</p>

  <a aria-label="Corinvo" href="https://corinvo.github.io">
    <img src="https://img.shields.io/badge/Made%20by-Corinvo-black.svg?style=for-the-badge&color=black">
  </a>
  <a href="https://www.npmjs.com/package/@necto/popper">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@necto/popper.svg?style=for-the-badge">
  </a>
  <a aria-label="License" href="https://github.com/corinvo/necto/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-97CA25.svg?style=for-the-badge">
  </a>
</div>

## 📚 Usage

### Basic Example

```typescript
import { computePosition, offset, flip, shift } from '@necto/popper';

const button = document.querySelector('#button')!;
const tooltip = document.querySelector('#tooltip')!;

// Async for potential future middleware
const { x, y, placement, middlewareData } = await computePosition(button, tooltip, {
  placement: 'top',
  strategy: 'absolute',
  middleware: [
    offset(8),      // 8px gap
    flip(),         // Auto-flip if no space
    shift()         // Shift to stay in viewport
  ]
});

// Apply position
Object.assign(tooltip.style, {
  position: 'absolute',
  left: `${x}px`,
  top: `${y}px`
});

// Access middleware data
console.log(middlewareData.flip); // { flipped: true, originalPlacement: 'top' }
```

### Advanced Example with Options

```typescript
const { x, y, placement } = await computePosition(button, tooltip, {
  placement: 'bottom-start',
  strategy: 'fixed',
  middleware: [
    offset({ value: 12 }),
    flip({
      boundary: document.querySelector('#container'),
      padding: { top: 10, bottom: 10 }
    }),
    shift({
      padding: 8,
      maxShift: 100, // Don't shift more than 100px
      axis: 'x'      // Only shift horizontally
    })
  ]
});
```

### Type-Safe Helpers

```typescript
import { getSide, getAlignment, getOppositeSide, isPlacement } from '@necto/popper';

// Extract placement parts
const side = getSide('top-start'); // 'top'
const alignment = getAlignment('top-start'); // 'start'

// Get opposites
const opposite = getOppositeSide('top'); // 'bottom'

// Runtime validation
if (isPlacement(userInput)) {
  // TypeScript knows userInput is Placement
}
```

## React code interop

```typescript
// React wrapper - just 20 lines!
import { computePosition } from '@necto/popper';
import type { ComputePositionOptions } from '@necto/popper';

export function usePopper(
  reference: Element | null,
  floating: HTMLElement | null,
  options: ComputePositionOptions = {}
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!reference || !floating) return;

    // All the logic is in @necto/popper!
    computePosition(reference, floating, options).then(setPosition);
  }, [reference, floating, options]);

  return position;
}
```

That's it! The vanilla package handles:
- ✅ All positioning logic
- ✅ All type definitions
- ✅ All middleware
- ✅ All validation
- ✅ All utilities

The React package just wraps it with hooks!