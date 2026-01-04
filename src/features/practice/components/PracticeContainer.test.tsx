import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { PracticeContainer } from './PracticeContainer';
import { usePracticeStore } from '../hooks/usePracticeStore';
import { useBattleStore } from '../hooks/useBattleStore';
import { usePracticeActions } from '../hooks/usePracticeActions';
import { usePracticeDerivedState } from '../hooks/usePracticeDerivedState';
import { useTimerManager } from '../hooks/useTimerManager';
import { useBGMManager } from '../hooks/useBGMManager';
import { usePractice } from '../hooks/usePractice';

// Mock everything that PracticeContainer uses
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock('../hooks/usePracticeStore');
vi.mock('../hooks/useBattleStore');
vi.mock('../hooks/usePracticeActions');
vi.mock('../hooks/usePracticeDerivedState');
vi.mock('../hooks/useTimerManager');
vi.mock('../hooks/useBGMManager');
vi.mock('../hooks/usePractice');

// Mock child components that we don't need to deeply test,
// BUT we want PracticeBattleArea and PracticeAnswerArea to be REAL so we can check their interaction states.
// Actually, PracticeContainer imports them. We mocked hooks they use.
// We need to verify if we should mock them.
// If we want to check internal structure of PracticeAnswerArea (className), we should render it.
// If we want to check buttons in PracticeBattleArea, we should render it.
// So we DO NOT mock sub-components here, only the hooks they consume.

// However, we need to mock modules that sub-components import if they cause trouble.
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => `mocked-asset${path}`,
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock framer-motion to avoid animation complexity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('PracticeContainer Interaction Spec', () => {
  const mockStoreState = {
    isQuestMode: true,
    isFreeMode: false,
    isOnboardingMode: false,
    currentLevel: 1,
    currentDrillIndex: 0,
    drills: [{ id: '1', japanese: 'test', english: 'test' }],
    questSession: {
      status: 'playing',
      results: [],
      getTimeLimit: vi.fn().mockReturnValue(30),
    },
    timeLeft: 30,
    words: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
    state: {
      verbType: 'do',
      fiveSentencePattern: 'SVO',
      subject: 'first_s',
      object: 'apple',
    },
    sessionId: 'test-session',
  };

  const mockBattleState = {
    heroAction: 'idle',
    heroOpacity: 1,
    monsterState: 'idle',
    monsterOpacity: 1,
    isScreenShaking: false,
    isScreenFlashing: false,
  };

  const mockDerivedState = {
    isCorrect: false,
    currentDrill: { japanese: 'test', english: 'test' },
    battleImages: {
      subjectImg: 'hero.png',
      monsterImg: 'monster.png',
      itemImg: 'item.png',
      monsterScale: 1,
    },
    generatedText: 'test text',
  };

  const mockActions = {
    handleNextDrill: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeStore).mockReturnValue(
      mockStoreState as unknown as ReturnType<typeof usePracticeStore>
    );
    vi.mocked(useBattleStore).mockReturnValue(
      mockBattleState as unknown as ReturnType<typeof useBattleStore>
    );
    vi.mocked(usePracticeDerivedState).mockReturnValue(
      mockDerivedState as unknown as ReturnType<typeof usePracticeDerivedState>
    );
    vi.mocked(usePracticeActions).mockReturnValue(
      mockActions as unknown as ReturnType<typeof usePracticeActions>
    );
    vi.mocked(useTimerManager).mockReturnValue(
      {} as unknown as ReturnType<typeof useTimerManager>
    );
    vi.mocked(useBGMManager).mockReturnValue(
      {} as unknown as ReturnType<typeof useBGMManager>
    );
    vi.mocked(usePractice).mockReturnValue(
      {} as unknown as ReturnType<typeof usePractice>
    );
  });

  it('spec: when monster is defeated, answer area is disabled but Next/Back buttons are clickable', () => {
    // Set state to Victory (Correct)
    vi.mocked(usePracticeDerivedState).mockReturnValue({
      ...mockDerivedState,
      isCorrect: true,
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(
      <PracticeContainer
        initialWords={{ nouns: [], verbs: [], adjectives: [], adverbs: [] }}
        allDrills={[]}
      />
    );

    // 1. Verify Answer Area is DISABLED (grayscale + pointer-events-none)
    // We look for the container in PracticeAnswerArea.
    // Usually we find it by looking for a unique child like NineKeyPanel and going up.
    // Or we can look for the text "けっか" (Result) which is rendered in AnswerArea
    const answerAreaResult = screen.getByText('★ せいかい！ ★');
    answerAreaResult.closest('.dq-window');
    // The disable class is on the wrapping div of the inputs, NOT the result window itself.
    // Let's look for "NineKeyPanel" wrapper which implies the input area.
    // Since NineKeyPanel is not text, let's assume we can find it by some button text inside it if we rendered real one?
    // Actually, NineKeyPanel likely renders keys "1-9" or similar.
    // BUT we mocked PracticeAnswerArea children in the unit test, here we are using REAL PracticeAnswerArea.
    // PracticeAnswerArea renders <NineKeyPanel />.

    // Let's use a simpler approach: check for specific class presence on the large container.
    // We can find the container by checking for the presence of selectors.
    // e.g. "Doどうし" selector text if visible.
    // Based on code, when isCorrect is true, selectors are still visible?
    // Yes:
    // {(state.verbType === 'do' || state.verbType === 'be') && ( ... selectors ... )}
    // And wrapper has class: `className={... || isCorrect ? 'pointer-events-none grayscale' : ''}`

    // So we find a selector or the panel and check its parent.
    // NineKeyPanel usually has "1", "2", etc. or we can look for "SVO" selector text if current tab is do.

    // Wait, locating by exact DOM structure is brittle in integration tests without test-ids.
    // But we know the fix adds `pointer-events-none grayscale` to a div.
    // Let's try to query by class just to see if ANY element has it.
    const disabledElements = document.getElementsByClassName(
      'pointer-events-none grayscale'
    );
    expect(disabledElements.length).toBeGreaterThan(0);

    // 2. Verify "Next" button is CLICKABLE
    // "Next" button text is "けっかへ" or "つぎへすすむ" depending on drill count.
    // Default mock has 1 drill, current index 0 => "けっかへ" (Go to Results)
    const nextButton = screen.getByText('けっかへ');
    expect(nextButton).toBeDefined();
    // Verify it does NOT have pointer-events-none
    expect(nextButton.className).not.toContain('pointer-events-none');
    expect(nextButton.closest('.pointer-events-none')).toBeNull(); // Ensure no parent disables it either (except the one we explicity check for, wait. If parent has it, then it is disabled).
    // OverlayBottomButtonArea has pointer-events-auto on itself, so it overrides any parent pointer-events-none if it existed.
    // But it is absolutely positioned, likely child of BattleOverlayArea -> PracticeBattleArea -> Container.
    // Container does not have pointer-events-none.

    // 3. Verify "Back" button is CLICKABLE
    const backButton = screen.getByText(/もどる/); // "&larr; もどる"
    expect(backButton).toBeDefined();
    expect(backButton.className).not.toContain('pointer-events-none');
    // Ensure its touch/click is not blocked by a parent.
    // Its parent has `pointer-events-auto` class: <div className="flex items-center gap-2 pointer-events-auto">
    expect(backButton.closest('.pointer-events-auto')).not.toBeNull();
  });

  it('spec: follows onboarding steps correctly', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStoreState,
      isOnboardingMode: true,
    } as unknown as ReturnType<typeof usePracticeStore>);

    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<
      typeof useRouter
    >);

    render(
      <PracticeContainer
        initialWords={{ nouns: [], verbs: [], adjectives: [], adverbs: [] }}
        allDrills={[]}
      />
    );

    // Initial step (1)
    let bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 1 -> 2

    // Step 2
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 2 -> 3

    // Step 3
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 3 -> 4

    // Step 4
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 4 -> 5

    // Step 5
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 5 -> 6

    // Step 6
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 6 -> 7

    // Step 7
    bubble = screen.getByText(/\(クリックしてすすむ\)/);
    fireEvent.click(bubble); // 7 -> Finish

    expect(push).toHaveBeenCalledWith('/');
  });
});
