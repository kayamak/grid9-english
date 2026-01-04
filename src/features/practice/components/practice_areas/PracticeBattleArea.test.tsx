import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeBattleArea } from './PracticeBattleArea';
import React from 'react';
import { usePracticeStore } from '../../hooks/usePracticeStore';
import { useBattleStore } from '../../hooks/useBattleStore';
import { usePracticeActions } from '../../hooks/usePracticeActions';
import { usePracticeDerivedState } from '../../hooks/usePracticeDerivedState';

// Mock the hooks
vi.mock('../../hooks/usePracticeStore');
vi.mock('../../hooks/useBattleStore');
vi.mock('../../hooks/usePracticeActions');
vi.mock('../../hooks/usePracticeDerivedState');

// Mock getAssetPath
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => `mocked-asset${path}`,
}));

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Timer: () => <div data-testid="timer-icon" />,
}));

describe('BattleArea', () => {
  const mockStore = {
    isQuestMode: false,
    isFreeMode: false,
    questSession: { status: 'playing', results: [] },
    drills: [],
    currentDrillIndex: 0,
    currentLevel: 1,
    timeLeft: 30,
    state: {},
  };

  const mockBattleStore = {
    heroAction: 'idle',
    heroOpacity: 1,
    monsterState: 'idle',
    monsterOpacity: 1,
    showVictoryEffect: false,
  };

  const mockActions = {
    handleNextDrill: vi.fn(),
  };

  const mockDerivedState = {
    currentDrill: { english: 'Test English', japanese: 'テスト日本語' },
    isCorrect: false,
    battleImages: {
      subjectImg: '/hero.png',
      monsterImg: '/monster.png',
      itemImg: null,
      monsterScale: 1,
    },
    heroOpacity: 1,
    monsterOpacity: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePracticeStore as any).mockReturnValue(mockStore);
    (useBattleStore as any).mockReturnValue(mockBattleStore);
    (usePracticeActions as any).mockReturnValue(mockActions);
    (usePracticeDerivedState as any).mockReturnValue(mockDerivedState);
  });

  describe('Mode Rendering', () => {
    it('renders in Practice Mode (default)', () => {
      render(<PracticeBattleArea />);

      // Check for background image style indirectly
      const container = screen
        .getByText(/ぶんしょうトレーニング/)
        .closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain(
        'assets/backgrounds/stadium_bg.jpeg'
      );

      // Check title
      expect(screen.getByText('ぶんしょうトレーニング')).toBeDefined();
    });

    it('renders in Quest Mode', () => {
      (usePracticeStore as any).mockReturnValue({
        ...mockStore,
        isQuestMode: true,
      });
      render(<PracticeBattleArea />);

      const container = screen
        .getByText(/ドリルクエスト/)
        .closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain(
        'assets/backgrounds/battle_bg.jpeg'
      );

      expect(screen.getByText('ドリルクエスト')).toBeDefined();
      expect(screen.getByTestId('timer-icon')).toBeDefined();
    });

    it('renders in Free Mode', () => {
      (usePracticeStore as any).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      });
      render(<PracticeBattleArea />);

      const container = screen
        .getByText(/じゆうトレーニング/)
        .closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain(
        'assets/backgrounds/dungeon.jpeg'
      );

      expect(screen.getByText('じゆうトレーニング')).toBeDefined();
    });
  });

  describe('Content Rendering', () => {
    it('displays the current drill when provided', () => {
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        currentDrill: { english: 'I run.', japanese: 'わたしははしる' },
      });
      render(<PracticeBattleArea />);

      expect(screen.getByText('わたしははしる')).toBeDefined();
    });

    it('displays "English" hint when it is quest mode and time is up', () => {
      // In BattleOverlayArea logic: displayEnglish = !isQuestMode || (isQuestMode && timeLeft === 0);
      (usePracticeStore as any).mockReturnValue({
        ...mockStore,
        isQuestMode: true,
        timeLeft: 0,
      });
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        currentDrill: { english: 'I run.', japanese: 'わたしははしる' },
      });
      
      render(<PracticeBattleArea />);

      expect(screen.getByText('I run.')).toBeDefined();
    });

    it('displays instruction text when no drill is provided (Free Mode)', () => {
      (usePracticeStore as any).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      });
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        currentDrill: undefined,
      });
      
      render(<PracticeBattleArea />);

      // Use regex to be resilient against whitespace differences
      expect(
        screen.getByText(/じゆうに.*えいぶんを.*つくるべし/)
      ).toBeDefined();
    });
  });

  describe('Interactions', () => {
    it('calls handleNextDrill when "Next" button is clicked (Victory)', () => {
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        isCorrect: true,
      });
      render(<PracticeBattleArea />);

      const nextButton = screen.getByText('つぎへすすむ');
      fireEvent.click(nextButton);

      expect(mockActions.handleNextDrill).toHaveBeenCalled();
    });

    it('displays "Run Away" button when drill exists and not correct', () => {
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        isCorrect: false,
      });
      render(<PracticeBattleArea />);

      const runAwayButton = screen.getByText('にげる');
      expect(runAwayButton).toBeDefined();

      fireEvent.click(runAwayButton);
      expect(mockActions.handleNextDrill).toHaveBeenCalledWith(true);
    });

    it('does not display Run Away button in Free Mode if there is no drill', () => {
      (usePracticeStore as any).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      });
      (usePracticeDerivedState as any).mockReturnValue({
        ...mockDerivedState,
        currentDrill: undefined,
      });
      
      render(<PracticeBattleArea />);

      expect(screen.queryByText('にげる')).toBeNull();
    });
  });

  describe('Visual Elements', () => {
  it('renders Hero image', () => {
    (usePracticeStore as any).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_s' },
    });
    render(<PracticeBattleArea />);
    expect(screen.getByAltText('Hero')).toBeDefined();
    expect(screen.getByAltText('Hero').getAttribute('src')).toBe(
      'mocked-asset/hero.png'
    );
  });

  it('renders plural Hero images', () => {
    (usePracticeStore as any).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_p' },
    });
    render(<PracticeBattleArea />);
    expect(screen.getByAltText('Hero')).toBeDefined();
    expect(screen.getByAltText('Hero Second')).toBeDefined();
  });

  it('renders Monster image', () => {
    render(<PracticeBattleArea />);
    expect(screen.getByAltText(/Monster/)).toBeDefined();
    expect(screen.getByAltText(/Monster/).getAttribute('src')).toBe(
      'mocked-asset/monster.png'
    );
  });

  it('renders Item image when present', () => {
    (usePracticeDerivedState as any).mockReturnValue({
      ...mockDerivedState,
      battleImages: {
        ...mockDerivedState.battleImages,
        itemImg: '/item.png',
      },
    });
    render(<PracticeBattleArea />);
    expect(screen.getByAltText('Item')).toBeDefined();
    });
  });
});
