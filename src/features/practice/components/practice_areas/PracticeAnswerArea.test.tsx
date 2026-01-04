import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  VerbTypeSelector: () => (
    <div data-testid="verb-type-selector">VerbTypeSelector</div>
  ),
}));
vi.mock('./answer_areas/FiveSentencePatternSelector', () => ({
  FiveSentencePatternSelector: () => <div>FiveSentencePatternSelector</div>,
}));
vi.mock('./answer_areas/VerbSelector', () => ({
  VerbSelector: () => <div>VerbSelector</div>,
}));
vi.mock('./answer_areas/ObjectSelector', () => ({
  ObjectSelector: ({ children }: { children: React.ReactNode }) => (
    <div>ObjectSelector {children}</div>
  ),
}));
vi.mock('./answer_areas/NounDeterminerSelector', () => ({
  NounDeterminerSelector: () => <div>NounDeterminerSelector</div>,
}));
vi.mock('./answer_areas/ComplementSelector', () => ({
  ComplementSelector: ({ children }: { children: React.ReactNode }) => (
    <div>ComplementSelector {children}</div>
  ),
}));
vi.mock('./answer_areas/OnboardingBubble', () => ({
  OnboardingBubble: () => <div>OnboardingBubble</div>,
}));

describe('PracticeAnswerArea', () => {
  const mockUsePracticeStore = usePracticeStore as unknown as ReturnType<
    typeof vi.fn
  >;
  const mockUsePracticeDerivedState =
    usePracticeDerivedState as unknown as ReturnType<typeof vi.fn>;
  const mockUsePracticeActions = usePracticeActions as unknown as ReturnType<
    typeof vi.fn
  >;

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
    const wrapperDiv = screen
      .getByTestId('nine-key-panel')
      .closest('.pointer-events-none');
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

    const wrapperDiv = screen
      .getByTestId('nine-key-panel')
      .closest('.pointer-events-none');
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

  describe('Admin Tab', () => {
    beforeEach(() => {
      mockUsePracticeStore.mockReturnValue({
        ...defaultStoreState,
        activeTab: 'admin',
        currentLevel: 5,
        questSession: { correctCount: 5 },
      });
    });

    it('renders admin interface', () => {
      render(<PracticeAnswerArea />);
      expect(screen.getByText('デバッグ管理')).toBeDefined();
      expect(screen.getByText('Lv 5')).toBeDefined();
      expect(screen.getByText('5 / 10')).toBeDefined();
    });

    it('can increment and decrement level', async () => {
      const setCurrentLevel = vi.fn();
      mockUsePracticeStore.mockReturnValue({
        ...defaultStoreState,
        activeTab: 'admin',
        currentLevel: 5,
        setCurrentLevel,
      });

      render(<PracticeAnswerArea />);

      // Find buttons by text "-" and "+"
      // There are two sets of "-" and "+" buttons.
      // 1st set is for Level (index 0 and 1)
      const decrementButtons = screen.getAllByText('-');
      const incrementButtons = screen.getAllByText('+');

      // Click Level -
      fireEvent.click(decrementButtons[0]);
      expect(setCurrentLevel).toHaveBeenCalledWith(4);

      // Click Level +
      fireEvent.click(incrementButtons[0]);
      expect(setCurrentLevel).toHaveBeenCalledWith(6);
    });

    it('can increment and decrement correct count', () => {
      const setCorrectCountInLevel = vi.fn();
      mockUsePracticeActions.mockReturnValue({
        setCorrectCountInLevel,
      });

      render(<PracticeAnswerArea />);

      const decrementButtons = screen.getAllByText('-');
      const incrementButtons = screen.getAllByText('+');

      // Click Correct Count - (2nd set)
      fireEvent.click(decrementButtons[1]);
      expect(setCorrectCountInLevel).toHaveBeenCalledWith(4);

      // Click Correct Count + (2nd set)
      fireEvent.click(incrementButtons[1]);
      expect(setCorrectCountInLevel).toHaveBeenCalledWith(6);
    });

    it('limits level range', () => {
      const setCurrentLevel = vi.fn();
      // Test lower bound
      mockUsePracticeStore.mockReturnValue({
        ...defaultStoreState,
        activeTab: 'admin',
        currentLevel: 1,
        setCurrentLevel,
      });

      const { unmount } = render(<PracticeAnswerArea />);
      const decrementButtons = screen.getAllByText('-');
      fireEvent.click(decrementButtons[0]);
      expect(setCurrentLevel).toHaveBeenCalledWith(1); // Should not go below 1
      unmount();

      // Test upper bound
      mockUsePracticeStore.mockReturnValue({
        ...defaultStoreState,
        activeTab: 'admin',
        currentLevel: 10,
        setCurrentLevel,
      });

      render(<PracticeAnswerArea />);
      const incrementButtons = screen.getAllByText('+');
      fireEvent.click(incrementButtons[0]);
      expect(setCurrentLevel).toHaveBeenCalledWith(10); // Should not go above 10
    });
  });
});
