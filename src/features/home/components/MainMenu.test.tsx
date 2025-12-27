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

describe('MainMenu', () => {
  it('renders "たたかう" as the default selected category', () => {
    render(<MainMenu />);
    
    // Check if "たたかう" is highlighted as selected
    const tatakauBtn = screen.getByRole('button', { name: /たたかう/i });
    expect(tatakauBtn.className).toContain('text-yellow-400');
    
    // Check if right pane shows "ドリルクエスト"
    expect(screen.getByText('ドリルクエスト')).toBeDefined();
  });

  it('switches to "じゅもん" category when clicked', () => {
    render(<MainMenu />);
    
    const jumonBtn = screen.getByRole('button', { name: /じゅもん/i });
    fireEvent.click(jumonBtn);
    
    // "じゅもん" should now be highlighted
    expect(jumonBtn.className).toContain('text-yellow-400');
    
    // Right pane should show magic patterns
    expect(screen.getByText('DO_SV')).toBeDefined();
    expect(screen.getByText('DO_SVO')).toBeDefined();
    expect(screen.getByText('BE_SBC')).toBeDefined();
  });

  it('switches to "どうぐ" category when clicked', () => {
    render(<MainMenu />);
    
    const doguBtn = screen.getByRole('button', { name: /どうぐ/i });
    fireEvent.click(doguBtn);
    
    // "どうぐ" should now be highlighted
    expect(doguBtn.className).toContain('text-yellow-400');
    
    // Right pane should show free practice
    expect(screen.getByText('じゆうトレーニング')).toBeDefined();
  });
});
