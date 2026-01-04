import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainMenu } from './MainMenu';
import React from 'react';

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => {
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
    expect(screen.getByRole('button', { name: /れんしゅう/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /おためし/i })).toBeDefined();

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

  it('switches to "れんしゅう" category and shows its items when clicked', () => {
    render(<MainMenu />);

    const jumonBtn = screen.getByRole('button', { name: /れんしゅう/i });
    fireEvent.click(jumonBtn);

    // Header should update
    const header = screen.getByRole('heading', { level: 2 });
    expect(header.textContent).toBe('れんしゅう');

    // Items should appear
    expect(screen.getByText('しゅご ＋ Doどうし')).toBeDefined(); // Label for DO_SV
    expect(screen.getByText('しゅご ＋ Doどうし ＋ もくてきご')).toBeDefined(); // Label for DO_SVO
    expect(screen.getByText('しゅご ＋ Beどうし ＋ ほご')).toBeDefined(); // Label for BE_SVC
  });

  it('switches to "おためし" category and shows its items when clicked', () => {
    render(<MainMenu />);

    const doguBtn = screen.getByRole('button', { name: /おためし/i });
    fireEvent.click(doguBtn);

    // Header should update
    const header = screen.getByRole('heading', { level: 2 });
    expect(header.textContent).toBe('おためし');

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

  it('updates description when hovering "にげる" button', () => {
    render(<MainMenu />);
    const nigeruBtn = screen.getByText('にげる');

    // Initial description check (optional, but good for validity)
    // We can't easily check initial state unless we mock useMainMenu to return specific state,
    // but here we use the real hook implicitly (implied by previous tests not mocking it? Wait.)

    // MainMenu uses `useMainMenu` hook.
    // Is `useMainMenu` mocked in THIS test file?
    // No, MainMenu is imported. useMainMenu is used inside.
    // The previous tests didn't mock useMainMenu, but they mocked next/navigation and next/link.
    // MainMenu.tsx imports `useMainMenu`.
    // If we haven't mocked `useMainMenu`, it uses the real one.
    // The real one sets 'コマンドを　えらんでください。' initially.

    fireEvent.mouseEnter(nigeruBtn);
    expect(
      screen.getByText(
        (content) =>
          content.includes('レベルを') &&
          content.includes('しょきか') &&
          content.includes('できるぞ')
      )
    ).toBeDefined();
  });

  it('opens clear level menu when clicking "にげる"', () => {
    render(<MainMenu />);
    const nigeruBtn = screen.getByText('にげる');

    fireEvent.click(nigeruBtn);

    expect(screen.getByText('メニュー')).toBeDefined();
    expect(screen.getByText('レベルクリア')).toBeDefined();
    expect(screen.getByText('とじる')).toBeDefined();
  });

  it('closes clear level menu when clicking "とじる"', () => {
    render(<MainMenu />);
    const nigeruBtn = screen.getByText('にげる');
    fireEvent.click(nigeruBtn);

    const closeBtn = screen.getByText('とじる');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('メニュー')).toBeNull();
  });

  it('clears level when clicking "レベルクリア"', () => {
    // We need to verify if cookie is set or state updated.
    // Since we are using real hook, we can check if "レベルを　しょきか　しました。" appears in bottom message.
    render(<MainMenu />);
    const nigeruBtn = screen.getByText('にげる');
    fireEvent.click(nigeruBtn);

    const clearBtn = screen.getByText('レベルクリア');
    fireEvent.click(clearBtn);

    // Check for updated bottom message. Bottom message is displayed in "▼ ..."
    expect(
      screen.getByText(
        (content) =>
          content.includes('レベルを') &&
          content.includes('しょきか') &&
          content.includes('しました')
      )
    ).toBeDefined();
  });

  it('updates description when hovering items', () => {
    render(<MainMenu />);
    const tatakauBtn = screen.getByRole('button', { name: /たたかう/i });
    fireEvent.click(tatakauBtn);

    const drillQuestBtn = screen.getByText('ドリルクエスト');
    fireEvent.mouseEnter(drillQuestBtn);

    // Check if description updated.
    // We need to know the description of Drill Quest.
    // In MENU_DATA: 'せまりくる　せいげんじかんないに　あまたの　もんだいを　ときあかせ！'
    expect(
      screen.getByText(
        (content) =>
          content.includes('せまりくる') &&
          content.includes('せいげんじかんないに')
      )
    ).toBeDefined();

    fireEvent.mouseLeave(drillQuestBtn);

    // Should revert to category description
    // 'きびしい　しれんに　いどみ、おのれの　スキルを　みがきあげろ！'
    expect(
      screen.getByText(
        (content) =>
          content.includes('きびしい') && content.includes('しれんに')
      )
    ).toBeDefined();
  });
});
