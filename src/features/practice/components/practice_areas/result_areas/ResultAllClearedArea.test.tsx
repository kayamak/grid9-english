import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultAllClearedArea } from './ResultAllClearedArea';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.ComponentProps<'div'>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    h2: ({ children, className, ...props }: React.ComponentProps<'h2'>) => (
      <h2 className={className} {...props}>
        {children}
      </h2>
    ),
    p: ({ children, className, ...props }: React.ComponentProps<'p'>) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
  },
}));

// Mock Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('ResultAllClearedArea', () => {
  it('renders grandmaster title and messages', () => {
    render(<ResultAllClearedArea />);

    expect(screen.getByText('グランドマスター')).toBeDefined();
    expect(screen.getByText(/すべてを\s*せいした！/)).toBeDefined();
    expect(screen.getByText('かんぱーい！')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined(); // The floating number
  });

  it('renders a link to return to home', () => {
    render(<ResultAllClearedArea />);

    // Use regex for Japanese text which might include varying whitespace
    const button = screen.getByText(/でんせつとして\s*きかんする/);
    const link = button.closest('a');
    expect(link).toBeDefined();
    expect(link?.getAttribute('href')).toBe('/');
  });
});
