# @necto/popper

Core positioning engine for popovers, tooltips, dropdowns, and floating elements.

Framework-agnostic positioning utilities using **advanced TypeScript** and **functional programming** patterns.

## 🎯 Design Philosophy

**All the complexity lives here, so framework wrappers stay minimal.**

The vanilla JS package uses advanced TypeScript features to provide:
- ✅ **Type-safe APIs** - Catch errors at compile time
- ✅ **Runtime validation** - Type guards and branded types
- ✅ **Composable middleware** - Functional pipeline pattern
- ✅ **Extensive type utilities** - Make React code trivial

## 🏗️ Architecture

```
src/
├── types/                    # Advanced TypeScript type system
│   ├── placement.ts          # Template literal types, type guards
│   ├── geometry.ts           # Branded types, utility functions
│   ├── middleware.ts         # Higher-order types, middleware pattern
│   ├── options.ts            # Configuration types with defaults
│   └── boundary.ts           # Boundary and overflow types
├── core/                     # Core positioning logic
│   ├── computePosition.ts    # Main orchestrator (async!)
│   └── getElementRects.ts    # DOM measurements
├── middleware/               # Composable modifiers
│   ├── offset.ts             # Add spacing
│   ├── flip.ts               # Auto-flip when overflowing
│   └── shift.ts              # Shift to stay in viewport
└── utils/                    # Pure helper functions
    ├── getPlacementCoords.ts # Coordinate math
    └── detectOverflow.ts     # Boundary detection (uses @necto/dom)
```

## 🚀 Advanced TypeScript Features

### 1. Template Literal Types

```typescript
// Generates all 12 valid placements automatically
type Side = 'top' | 'right' | 'bottom' | 'left';
type Alignment = 'start' | 'end';

// This creates: 'top' | 'top-start' | 'top-end' | 'bottom' | ...
type Placement = Side | `${Side}-${Alignment}`;
```

### 2. Type Guards with Runtime Validation

```typescript
// Type-safe runtime checks
if (isPlacement('top-start')) {
  // TypeScript knows it's a valid Placement
}

// Extract parts type-safely
const side: Side = getSide('top-start'); // 'top'
const alignment: Alignment | undefined = getAlignment('top-start'); // 'start'
```

### 3. Branded Types & Utility Functions

```typescript
// Padding can be a number or per-side object
type Padding = number | Partial<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}>;

// Utility resolves to all four sides
const padding = resolvePadding(8); // { top: 8, right: 8, bottom: 8, left: 8 }
const padding = resolvePadding({ top: 4, bottom: 8 }); // { top: 4, right: 0, bottom: 8, left: 0 }
```

### 4. Middleware Pattern with Higher-Order Types

```typescript
// Middleware is a named, composable function
interface Middleware {
  name: string;
  fn: (state: MiddlewareState) => MiddlewareResult | Promise<MiddlewareResult>;
}

// Helper creates middleware with name
const myMiddleware = createMiddleware('custom', (state) => ({
  x: state.x + 10
}));

// Type-safe middleware factories
type MiddlewareFactory<TOptions = void> =
  TOptions extends void
    ? () => Middleware
    : (options: TOptions) => Middleware;
```

### 5. Readonly & Immutability

```typescript
// All state is readonly - functional purity
interface MiddlewareState {
  readonly x: number;
  readonly y: number;
  readonly placement: Placement;
  readonly rects: ElementRects; // Also readonly internally
}
```

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

## 🎨 Why This Makes React Code Minimal

Because all the heavy lifting is in vanilla JS with full TypeScript support, your React wrapper can be **trivial**:

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

## 🧪 Testing

Pure functions = easy to test!

```typescript
import { computeCoords, getSide } from '@necto/popper';

test('computes top placement correctly', () => {
  const rects = {
    reference: { x: 100, y: 100, width: 50, height: 50 },
    floating: { x: 0, y: 0, width: 100, height: 40 }
  };

  const coords = computeCoords('top', rects);

  expect(coords).toEqual({
    x: 75,   // centered: 100 + 50/2 - 100/2
    y: 60    // above: 100 - 40
  });
});

test('type guards work correctly', () => {
  expect(getSide('top-start')).toBe('top');
  expect(getSide('bottom')).toBe('bottom');
});
```

No mocking, no setup, just pure functions!

## 📦 Built With

- **@necto/dom** - DOM utilities (getContainmentRect, isNode, etc.)
- **@necto/types** - Shared types
- **TypeScript 5+** - Advanced type features

## 🎓 Patterns Used

1. **Functional Programming** - Pure functions, no classes
2. **Middleware Pattern** - Composable transformations
3. **Template Literal Types** - Generate valid placements
4. **Type Guards** - Runtime type validation
5. **Branded Types** - Stronger type safety
6. **Higher-Order Types** - MiddlewareFactory pattern
7. **Readonly/Immutability** - Prevent mutations

## 🔄 Comparison

| Pattern | This Library | Class-Based |
|---------|-------------|-------------|
| Type Safety | ✅ Template literals | ❌ String enums |
| Tree Shaking | ✅ Import what you need | ❌ Import whole class |
| Testing | ✅ Pure functions | ⚠️ Mocking needed |
| Composition | ✅ Middleware pipeline | ⚠️ Inheritance |
| React Wrapper | ✅ ~20 lines | ❌ ~200+ lines |

## 📖 Related Packages

- **@necto-react/popper** - React hooks and components
- **@necto/dom** - DOM utilities (used internally)
