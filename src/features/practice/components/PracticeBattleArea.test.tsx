import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeBattleArea } from './PracticeBattleArea';
import { SentencePattern } from '@/domain/practice/types';

// Mock getAssetPath
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => `mocked-asset${path}`,
}));

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Timer: () => <div data-testid="timer-icon" />,
}));

describe('PracticeBattleArea', () => {
  const defaultState = SentencePattern.create({
    verbType: 'do',
    verb: 'open',
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
    fiveSentencePattern: 'SVO',
    object: 'door',
    numberForm: 'a',
  });

  const defaultProps = {
    isQuestMode: false,
    state: defaultState,
    currentDrillIndex: 0,
    heroAction: 'idle' as const,
    monsterState: 'idle' as const,
    battleImages: {
      subjectImg: '/hero.png',
      monsterImg: '/monster.png',
      itemImg: null,
      monsterScale: 1,
    },
    heroOpacity: 1,
    monsterOpacity: 1,
    currentLevel: 1,
    timeLeft: 30,
    questResults: [],
    totalDrills: 10,
    correctCountInLevel: 0,
    isCorrect: false,
    onNext: vi.fn(),
    showVictoryEffect: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mode Rendering', () => {
    it('renders in Practice Mode (default)', () => {
      render(<PracticeBattleArea {...defaultProps} />);
      
      // Check for background image style indirectly
      const container = screen.getByText(/ぶんしょうトレーニング/).closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain('assets/backgrounds/stadium_bg.jpeg');
      
      // Check title
      expect(screen.getByText('ぶんしょうトレーニング')).toBeDefined();
    });

    it('renders in Quest Mode', () => {
      render(<PracticeBattleArea {...defaultProps} isQuestMode={true} />);
      
      const container = screen.getByText(/ドリルクエスト/).closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain('assets/backgrounds/battle_bg.jpeg');

      expect(screen.getByText('ドリルクエスト')).toBeDefined();
      expect(screen.getByTestId('timer-icon')).toBeDefined();
    });

    it('renders in Free Mode', () => {
      render(<PracticeBattleArea {...defaultProps} isFreeMode={true} />);
      
      const container = screen.getByText(/じゆうトレーニング/).closest('.dq-battle-bg');
      expect(container?.getAttribute('style')).toContain('assets/backgrounds/dungeon.jpeg');

      expect(screen.getByText('じゆうトレーニング')).toBeDefined();
    });
  });

  describe('Content Rendering', () => {
    it('displays the current drill when provided', () => {
      const drill = { english: 'I run.', japanese: 'わたしははしる' };
      render(<PracticeBattleArea {...defaultProps} currentDrill={drill} />);
      
      expect(screen.getByText('わたしははしる')).toBeDefined();
    });

    it('displays "English" hint when displayEnglish is true', () => {
      const drill = { english: 'I run.', japanese: 'わたしははしる' };
      render(<PracticeBattleArea {...defaultProps} currentDrill={drill} displayEnglish={true} />);
      
      expect(screen.getByText('I run.')).toBeDefined();
    });

    it('displays instruction text when no drill is provided (Free Mode)', () => {
      render(<PracticeBattleArea {...defaultProps} isFreeMode={true} currentDrill={undefined} />);
      
      // Use regex to be resilient against whitespace differences
      expect(screen.getByText(/じゆうに.*えいぶんを.*つくるべし/)).toBeDefined();
    });
  });

  describe('Interactions', () => {
    it('calls onNext when "Next" button is clicked (Victory)', () => {
      render(<PracticeBattleArea {...defaultProps} isCorrect={true} />);
      
      const nextButton = screen.getByText('つぎへすすむ');
      fireEvent.click(nextButton);
      
      expect(defaultProps.onNext).toHaveBeenCalled();
    });

    it('displays "Run Away" button when drill exists and not correct', () => {
       const drill = { english: 'I run.', japanese: 'わたしははしる' };
       render(<PracticeBattleArea {...defaultProps} currentDrill={drill} isCorrect={false} />);
       
       const runAwayButton = screen.getByText('にげる');
       expect(runAwayButton).toBeDefined();
       
       fireEvent.click(runAwayButton);
       expect(defaultProps.onNext).toHaveBeenCalledWith(true);
    });

    it('does not display Run Away button in Free Mode if there is no drill', () => {
        render(<PracticeBattleArea {...defaultProps} isFreeMode={true} currentDrill={undefined} />);
        
        expect(screen.queryByText('にげる')).toBeNull();
    });
  });

  describe('Visual Elements', () => {
      it('renders Hero image', () => {
          render(<PracticeBattleArea {...defaultProps} />);
          expect(screen.getByAltText('Hero')).toBeDefined();
          expect(screen.getByAltText('Hero').getAttribute('src')).toBe('mocked-asset/hero.png');
      });

      it('renders Monster image', () => {
          render(<PracticeBattleArea {...defaultProps} />);
          expect(screen.getByAltText('Monster')).toBeDefined();
          expect(screen.getByAltText('Monster').getAttribute('src')).toBe('mocked-asset/monster.png');
      });

      it('renders Item image when present', () => {
          const propsWithItem = {
              ...defaultProps,
              battleImages: {
                  ...defaultProps.battleImages,
                  itemImg: '/item.png',
              }
          };
          render(<PracticeBattleArea {...propsWithItem} />);
          expect(screen.getByAltText('Item')).toBeDefined();
      });
  });
});
