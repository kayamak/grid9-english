import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { DragonVEffect } from './DragonVEffect';

// Mock framer-motion to render normally
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<'div'>) => (
      <div className={className} data-testid="dragon-v-motion">
        {children}
      </div>
    ),
  },
}));

describe('DragonVEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initially', () => {
    const { getByTestId } = render(<DragonVEffect />);
    expect(getByTestId('dragon-v-motion')).toBeDefined();
  });

  it('hides after 3 seconds', () => {
    const { queryByTestId } = render(<DragonVEffect />);

    expect(queryByTestId('dragon-v-motion')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(queryByTestId('dragon-v-motion')).toBeNull();
  });
});
