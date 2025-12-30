import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainMenu } from './MainMenu';
import React from 'react';

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('MainMenu', () => {
  it('renders category list initially', () => {
    render(<MainMenu />);
    
    // Check if category buttons exist
    expect(screen.getByRole('button', { name: /たたかう/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /じゅもん/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /どうぐ/i })).toBeDefined();

    // Items should not be visible yet
    expect(screen.queryByText('ドリルクエスト')).toBeNull();
  });

  it('switches to "たたかう" category and shows its items when clicked', async () => {
    render(<MainMenu />);
    
    const tatakauBtn = screen.getByRole('button', { name: /たたかう/i });
    fireEvent.click(tatakauBtn);
    
    // Header should update
    const header = screen.getByRole('heading', { level: 2 });
    expect(header.textContent).toBe('たたかう');
    expect(header.className).toContain('text-yellow-400');
    
    // Items should appear
    expect(screen.getByText('ドリルクエスト')).toBeDefined();
  });

  it('switches to "じゅもん" category and shows its items when clicked', () => {
    render(<MainMenu />);
    
    const jumonBtn = screen.getByRole('button', { name: /じゅもん/i });
    fireEvent.click(jumonBtn);
    
    // Header should update
    const header = screen.getByRole('heading', { level: 2 });
    expect(header.textContent).toBe('じゅもん');
    
    // Items should appear
    expect(screen.getByText('主語+動詞(DO)')).toBeDefined(); // Label for DO_SV
  });

  it('switches to "どうぐ" category and shows its items when clicked', () => {
    render(<MainMenu />);
    
    const doguBtn = screen.getByRole('button', { name: /どうぐ/i });
    fireEvent.click(doguBtn);
    
    // Header should update
    const header = screen.getByRole('heading', { level: 2 });
    expect(header.textContent).toBe('どうぐ');
    
    // Items should appear
    expect(screen.getByText('じゆうトレーニング')).toBeDefined();
  });
  
  it('allows going back to category list', () => {
    render(<MainMenu />);
    
    // Enter a category
    fireEvent.click(screen.getByRole('button', { name: /たたかう/i }));
    expect(screen.getByText('ドリルクエスト')).toBeDefined();
    
    // Click back
    const backBtn = screen.getByText('[もどる]');
    fireEvent.click(backBtn);
    
    // Should be back to initial state
    expect(screen.getByRole('button', { name: /たたかう/i })).toBeDefined();
    expect(screen.queryByText('ドリルクエスト')).toBeNull();
  });
});
