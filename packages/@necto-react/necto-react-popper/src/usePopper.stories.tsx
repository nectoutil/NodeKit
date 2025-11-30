import type { Meta, StoryObj } from '@storybook/react';
import { useState, useRef, useEffect } from 'react';
import { usePopper } from './hooks/usePopper';
import type { Placement } from './hooks/usePopper';

const meta: Meta = {
  title: 'Hooks/usePopper',
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

const PopperDemo = ({
  placement = 'bottom',
  transform = true,
  middleware = []
}: {
  placement?: Placement;
  transform?: boolean;
  middleware?: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, elements } = usePopper({
    placement,
    transform,
    middleware,
    open: isOpen
  });

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
        {isOpen ? 'Close' : 'Open'} Tooltip
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          This is a floating tooltip positioned at {placement}
        </div>
      )}
    </div>
  );
};

const ScrollDemo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, update } = usePopper({
    placement: 'right',
    open: isOpen
  });

  useEffect(() => {
    if (!scrollRef.current || !refs.reference.current || !refs.floating.current)
      return;

    const handleScroll = () => {
      update();
    };

    const container = scrollRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [update, refs.reference, refs.floating]);

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          marginBottom: '16px',
          padding: '8px 16px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isOpen ? 'Hide' : 'Show'} Tooltip
      </button>

      <div
        ref={scrollRef}
        style={{
          width: '400px',
          height: '300px',
          overflow: 'auto',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <div style={{ height: '600px', position: 'relative' }}>
          <p style={{ marginBottom: '100px' }}>
            Scroll down to see the reference element...
          </p>

          <div
            ref={refs.setReference}
            style={{
              padding: '12px',
              backgroundColor: '#0066cc',
              color: 'white',
              borderRadius: '6px',
              display: 'inline-block',
              marginTop: '150px'
            }}
          >
            Reference Element
          </div>

          <p style={{ marginTop: '100px' }}>Continue scrolling...</p>
        </div>
      </div>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '180px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          Tooltip follows on scroll!
        </div>
      )}
    </div>
  );
};

const AllPlacementsDemo = () => {
  const placements: Placement[] = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end'
  ];

  const [activePlacement, setActivePlacement] = useState<Placement>('bottom');
  const [isOpen, setIsOpen] = useState(true);

  const { refs, floatingStyles } = usePopper({
    placement: activePlacement,
    open: isOpen
  });

  return (
    <div style={{ padding: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
          Select Placement:
        </h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            maxWidth: '500px'
          }}
        >
          {placements.map((placement) => (
            <button
              key={placement}
              onClick={() => setActivePlacement(placement)}
              style={{
                padding: '6px 12px',
                backgroundColor:
                  activePlacement === placement ? '#0066cc' : '#e0e0e0',
                color: activePlacement === placement ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {placement}
            </button>
          ))}
        </div>
      </div>

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
        Reference Element
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          Placement: {activePlacement}
        </div>
      )}
    </div>
  );
};

const TransformVsPositionDemo = () => {
  const [useTransform, setUseTransform] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const { refs, floatingStyles } = usePopper({
    placement: 'bottom',
    transform: useTransform,
    open: isOpen
  });

  return (
    <div style={{ padding: '100px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setUseTransform(!useTransform)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          Using: {useTransform ? 'Transform' : 'Position'}
        </button>
        <span style={{ fontSize: '14px', color: '#666' }}>
          (Transform is more performant)
        </span>
      </div>

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
        Reference Element
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '250px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 600 }}>
            Current styles:
          </div>
          <code
            style={{
              fontSize: '12px',
              display: 'block',
              whiteSpace: 'pre-wrap'
            }}
          >
            {JSON.stringify(floatingStyles, null, 2)}
          </code>
        </div>
      )}
    </div>
  );
};

export const Basic: StoryObj = {
  render: () => <PopperDemo />
};

export const TopPlacement: StoryObj = {
  render: () => <PopperDemo placement="top" />
};

export const RightPlacement: StoryObj = {
  render: () => <PopperDemo placement="right" />
};

export const LeftPlacement: StoryObj = {
  render: () => <PopperDemo placement="left" />
};

export const WithScroll: StoryObj = {
  render: () => <ScrollDemo />
};

export const AllPlacements: StoryObj = {
  render: () => <AllPlacementsDemo />
};

export const TransformVsPosition: StoryObj = {
  render: () => <TransformVsPositionDemo />
};
