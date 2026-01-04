import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock the MainMenu component
vi.mock('@/features/home/components/MainMenu', () => ({
  MainMenu: () => <div data-testid="main-menu">Main Menu Mock</div>,
}));

describe('Home Page', () => {
  it('renders the title and subtitle', async () => {
    // Since Home is an async server component, we need to await it or treat it as a promise if we were rendering it in a real server env,
    // but for unit testing with React Testing Library, standard components are usually fine unless they await data.
    // The current Home component does not await anything, so we can render it directly or wrap it.
    // However, TypeScript might complain about async component in JSX.
    // We can cast it or call it as a function.

    // In strict Next.js 13+ testing, async components need special handling or we just await the function call.
    const Component = await Home();
    render(Component);

    expect(screen.getByText('GRID９ ENGLISH')).toBeDefined();
    expect(
      screen.getByText('視覚的なパターンで英語をマスターせよ！')
    ).toBeDefined();
    expect(screen.getByTestId('main-menu')).toBeDefined();
  });
});
