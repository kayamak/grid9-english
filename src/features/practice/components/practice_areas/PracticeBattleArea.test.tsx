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
    div: ({ children, animate, transition, ...props }: { children?: React.ReactNode, animate?: Record<string, unknown>, transition?: Record<string, unknown> }) => (
      <div 
        {...props} 
        data-animate={JSON.stringify(animate)} 
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
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
    questSession: { status: 'playing', results: [], getTimeLimit: vi.fn().mockReturnValue(30) },
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
    vi.mocked(usePracticeStore).mockReturnValue(mockStore as unknown as ReturnType<typeof usePracticeStore>);
    vi.mocked(useBattleStore).mockReturnValue(mockBattleStore as unknown as ReturnType<typeof useBattleStore>);
    vi.mocked(usePracticeActions).mockReturnValue(mockActions as unknown as ReturnType<typeof usePracticeActions>);
    vi.mocked(usePracticeDerivedState).mockReturnValue(mockDerivedState as unknown as ReturnType<typeof usePracticeDerivedState>);
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
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isQuestMode: true,
      } as unknown as ReturnType<typeof usePracticeStore>);
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
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      } as unknown as ReturnType<typeof usePracticeStore>);
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
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        currentDrill: { english: 'I run.', japanese: 'わたしははしる', id: '1', sentencePattern: 'SV' },
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      render(<PracticeBattleArea />);

      expect(screen.getByText('わたしははしる')).toBeDefined();
    });

    it('displays "English" hint when it is quest mode and time is up', () => {
      // In BattleOverlayArea logic: displayEnglish = !isQuestMode || (isQuestMode && timeLeft === 0);
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isQuestMode: true,
        timeLeft: 0,
      } as unknown as ReturnType<typeof usePracticeStore>);
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        currentDrill: { english: 'I run.', japanese: 'わたしははしる', id: '1', sentencePattern: 'SV' },
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      
      render(<PracticeBattleArea />);

      expect(screen.getByText('I run.')).toBeDefined();
    });

    it('displays instruction text when no drill is provided (Free Mode)', () => {
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      } as unknown as ReturnType<typeof usePracticeStore>);
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        currentDrill: undefined,
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      
      render(<PracticeBattleArea />);

      // Use regex to be resilient against whitespace differences
      expect(
        screen.getByText(/じゆうに.*えいぶんを.*つくるべし/)
      ).toBeDefined();
    });
  });

  describe('Interactions', () => {
    it('calls handleNextDrill when "Next" button is clicked (Victory)', () => {
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        isCorrect: true,
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      render(<PracticeBattleArea />);

      const nextButton = screen.getByText('つぎへすすむ');
      fireEvent.click(nextButton);

      expect(mockActions.handleNextDrill).toHaveBeenCalled();
    });

    it('displays "Run Away" button when drill exists and not correct', () => {
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        isCorrect: false,
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      render(<PracticeBattleArea />);

      const runAwayButton = screen.getByText('にげる');
      expect(runAwayButton).toBeDefined();

      fireEvent.click(runAwayButton);
      expect(mockActions.handleNextDrill).toHaveBeenCalledWith(true);
    });

    it('does not display Run Away button in Free Mode if there is no drill', () => {
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isFreeMode: true,
      } as unknown as ReturnType<typeof usePracticeStore>);
      vi.mocked(usePracticeDerivedState).mockReturnValue({
        ...mockDerivedState,
        currentDrill: undefined,
      } as unknown as ReturnType<typeof usePracticeDerivedState>);
      
      render(<PracticeBattleArea />);

      expect(screen.queryByText('にげる')).toBeNull();
    });
  });

  describe('Visual Elements', () => {
  it('renders Hero image', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_s' },
    } as unknown as ReturnType<typeof usePracticeStore>);
    render(<PracticeBattleArea />);
    expect(screen.getByAltText('Hero')).toBeDefined();
    expect(screen.getByAltText('Hero').getAttribute('src')).toBe(
      'mocked-asset/hero.png'
    );
  });

  it('renders plural Hero images', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_p' },
    } as unknown as ReturnType<typeof usePracticeStore>);
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
    vi.mocked(usePracticeDerivedState).mockReturnValue({
      ...mockDerivedState,
      battleImages: {
        ...mockDerivedState.battleImages,
        itemImg: '/item.png',
      },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);
    render(<PracticeBattleArea />);
    expect(screen.getByAltText('Item')).toBeDefined();
    });

    it('sets defeated animation props when monster is defeated', () => {
      vi.mocked(useBattleStore).mockReturnValue({
        ...mockBattleStore,
        monsterState: 'defeated',
      } as unknown as ReturnType<typeof useBattleStore>);
      
      render(<PracticeBattleArea />);
      
      const monsterImg = screen.getByAltText(/Monster/);
      const monsterContainer = monsterImg.closest('div[data-animate]');
      
      const animateAttr = monsterContainer?.getAttribute('data-animate');
      expect(animateAttr).toBeDefined();
      
      const animate = JSON.parse(animateAttr || '{}');
      // Verify keyframes for defeated state
      expect(animate.y).toEqual([0, -20, 20]);
      expect(animate.rotate).toEqual([0, 0, 90]);
      expect(animate.filter).toContain('grayscale(100%) brightness(1)');
    });
  });
});
