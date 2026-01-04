
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PracticeAnswerArea } from './PracticeAnswerArea';
import { usePracticeStore } from '../../hooks/usePracticeStore';
import { usePracticeDerivedState } from '../../hooks/usePracticeDerivedState';
import { usePracticeActions } from '../../hooks/usePracticeActions';

// Mock hooks
vi.mock('../../hooks/usePracticeStore');
vi.mock('../../hooks/usePracticeDerivedState');
vi.mock('../../hooks/usePracticeActions');

// Mock child components to simplify testing
vi.mock('./answer_areas/NineKeyPanel', () => ({
  NineKeyPanel: () => <div data-testid="nine-key-panel">NineKeyPanel</div>,
}));
vi.mock('./answer_areas/VerbTypeSelector', () => ({
  VerbTypeSelector: () => <div data-testid="verb-type-selector">VerbTypeSelector</div>,
}));
vi.mock('./answer_areas/FiveSentencePatternSelector', () => ({
  FiveSentencePatternSelector: () => <div>FiveSentencePatternSelector</div>,
}));
vi.mock('./answer_areas/VerbSelector', () => ({
  VerbSelector: () => <div>VerbSelector</div>,
}));
vi.mock('./answer_areas/ObjectSelector', () => ({
  ObjectSelector: ({ children }: { children: React.ReactNode }) => <div>ObjectSelector {children}</div>,
}));
vi.mock('./answer_areas/NounDeterminerSelector', () => ({
  NounDeterminerSelector: () => <div>NounDeterminerSelector</div>,
}));
vi.mock('./answer_areas/ComplementSelector', () => ({
  ComplementSelector: ({ children }: { children: React.ReactNode }) => <div>ComplementSelector {children}</div>,
}));
vi.mock('./answer_areas/OnboardingBubble', () => ({
  OnboardingBubble: () => <div>OnboardingBubble</div>,
}));

describe('PracticeAnswerArea', () => {
  const mockUsePracticeStore = usePracticeStore as unknown as ReturnType<typeof vi.fn>;
  const mockUsePracticeDerivedState = usePracticeDerivedState as unknown as ReturnType<typeof vi.fn>;
  const mockUsePracticeActions = usePracticeActions as unknown as ReturnType<typeof vi.fn>;

  const defaultStoreState = {
    activeTab: 'practice',
    isAdmin: false,
    currentLevel: 1,
    questSession: { correctCount: 0 },
    state: { verbType: 'do', fiveSentencePattern: 'SVO' },
    isQuestMode: false,
    setCurrentLevel: vi.fn(),
    timeLeft: 60,
  };

  const defaultDerivedState = {
    generatedText: '',
    isCorrect: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePracticeStore.mockReturnValue(defaultStoreState);
    mockUsePracticeDerivedState.mockReturnValue(defaultDerivedState);
    mockUsePracticeActions.mockReturnValue({
      setCorrectCountInLevel: vi.fn(),
    });
  });

  it('renders correctly in default state', () => {
    render(<PracticeAnswerArea />);
    expect(screen.getByTestId('nine-key-panel')).toBeTruthy();
  });

  it('disables interactions when isCorrect is true', () => {
    mockUsePracticeDerivedState.mockReturnValue({
      ...defaultDerivedState,
      isCorrect: true,
    });

    render(<PracticeAnswerArea />);
    
    // Check if the pointer-events-none class is applied to the wrapper div
    const wrapperDiv = screen.getByTestId('nine-key-panel').closest('.pointer-events-none');
    expect(wrapperDiv).not.toBeNull();
    expect(wrapperDiv?.classList.contains('grayscale')).toBe(true);
  });

  it('disables interactions and greys out when time runs out in Quest Mode', () => {
    mockUsePracticeStore.mockReturnValue({
      ...defaultStoreState,
      isQuestMode: true,
      timeLeft: 0,
    });

    render(<PracticeAnswerArea />);
    
    const wrapperDiv = screen.getByTestId('nine-key-panel').closest('.pointer-events-none');
    expect(wrapperDiv).not.toBeNull();
    expect(wrapperDiv?.classList.contains('grayscale')).toBe(true);
  });

  it('enables interactions when not correct and time remains', () => {
    render(<PracticeAnswerArea />);
    
    const panel = screen.getByTestId('nine-key-panel');
    const wrapperDiv = panel.parentElement?.parentElement;
    
    expect(wrapperDiv?.classList.contains('pointer-events-none')).toBe(false);
    expect(wrapperDiv?.classList.contains('grayscale')).toBe(false);
  });
});
