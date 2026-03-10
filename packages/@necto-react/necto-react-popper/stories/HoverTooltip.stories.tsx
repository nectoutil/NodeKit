import type { Meta, StoryObj } from '@storybook/react';
import { useState, useMemo } from 'react';
import { usePopper } from '../src/hooks/usePopper';
import { PopperPortal } from '../src/hooks/usePopperPortal';
import { offset, flip, shift, arrow, autoUpdate, getSide } from '@necto/popper';
import type { Placement } from '../src/hooks/usePopper';

interface PopperDemoArgs {
  placement: Placement;
  offsetDistance: number;
  showArrow: boolean;
}

const meta: Meta<PopperDemoArgs> = {
  title: 'Hooks/usePopper',
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end'
      ]
    },
    offsetDistance: {
      control: { type: 'range', min: 0, max: 24, step: 2 }
    },
    showArrow: {
      control: 'boolean'
    }
  },
  args: {
    placement: 'top',
    offsetDistance: 8,
    showArrow: true
  }
};

export default meta;

const ARROW_SIZE = 8;

const PopperDemo = ({ placement, offsetDistance, showArrow }: PopperDemoArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  // Use state instead of ref so middleware re-runs when arrow element mounts
  const [arrowEl, setArrowEl] = useState<HTMLDivElement | null>(null);

  const middleware = useMemo(
    () => [
      offset(offsetDistance),
      flip(),
      shift({ padding: 8 }),
      ...(showArrow ? [arrow({ element: arrowEl, padding: 4 })] : [])
    ],
    [offsetDistance, showArrow, arrowEl]
  );

  const { refs, floatingStyles, middlewareData, placement: finalPlacement } = usePopper({
    placement,
    open: isOpen,
    middleware,
    whileElementsMounted: autoUpdate
  });

  const side = getSide(finalPlacement);
  const isVertical = side === 'top' || side === 'bottom';
  const arrowData = middlewareData.arrow as { x?: number; y?: number } | undefined;

  // Position arrow half-in, half-out on the correct edge
  const oppositeSide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    backgroundColor: '#1a1a1a',
    transform: 'rotate(45deg)',
    [oppositeSide[side]]: -ARROW_SIZE / 2,
    ...(isVertical
      ? { left: arrowData?.x ?? 0 }
      : { top: arrowData?.y ?? 0 })
  };

  return (
    <div style={{ padding: '100px' }}>
      <button
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        {isOpen ? 'Close' : 'Open'} Popper
      </button>

      {isOpen && (
        <PopperPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          >
            Popper content ({finalPlacement})

            {showArrow && (
              <div
                ref={setArrowEl}
                style={arrowStyle}
              />
            )}
          </div>
        </PopperPortal>
      )}
    </div>
  );
};

export const Default: StoryObj<PopperDemoArgs> = {
  render: (args) => <PopperDemo {...args} />
};
