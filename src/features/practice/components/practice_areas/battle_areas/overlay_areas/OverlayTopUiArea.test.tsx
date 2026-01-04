import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverlayTopUiArea } from './OverlayTopUiArea';
import { usePracticeStore } from '@/features/practice/hooks/usePracticeStore';
import { usePracticeDerivedState } from '@/features/practice/hooks/usePracticeDerivedState';

// Mock dependencies
vi.mock('@/features/practice/hooks/usePracticeStore');
vi.mock('@/features/practice/hooks/usePracticeDerivedState');

// Mock Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('OverlayTopUiArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in normal mode', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: false,
      currentLevel: 5,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
      questSession: null,
      timeLeft: 60,
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { japanese: 'こんにちは', english: 'Hello' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayTopUiArea />);

    expect(screen.getByText('Lv5')).toBeDefined();
    expect(screen.getByText('こんにちは')).toBeDefined();
    expect(screen.getByText('Hello')).toBeDefined(); // displayEnglish=true in non-quest
    expect(screen.getByText('ぶんしょうトレーニング')).toBeDefined();
  });

  it('renders correct title in Quest Mode', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      currentLevel: 5,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
      questSession: { results: [] },
      timeLeft: 60,
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { japanese: 'test', english: 'test' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayTopUiArea />);
    expect(screen.getByText('ドリルクエスト')).toBeDefined();
  });

  it('hides English text in Quest Mode while playing', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      currentLevel: 5,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
      questSession: { results: [] },
      timeLeft: 60,
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { japanese: 'こんにちは', english: 'Hello' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayTopUiArea />);
    expect(screen.getByText('こんにちは')).toBeDefined();
    expect(screen.queryByText('Hello')).toBeNull();
  });

  it('shows English text in Quest Mode when timeout', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      currentLevel: 5,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
      questSession: { results: [] },
      timeLeft: 0, // Timeout
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { japanese: 'こんにちは', english: 'Hello' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayTopUiArea />);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('renders progress dots and timer in Quest Mode', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      currentLevel: 5,
      currentDrillIndex: 2,
      drills: [{ id: '1' }, { id: '2' }, { id: '3' }],
      questSession: { results: ['correct', 'wrong', 'pending'] },
      timeLeft: 45,
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { japanese: 'test', english: 'test' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    const { container } = render(<OverlayTopUiArea />);

    // Check Timer
    expect(screen.getByText('45')).toBeDefined();

    // Check Dots implies checking classes or existence
    // We can rely on structure or just snapshot.
    // Or check if we have 3 results rendered
    const dots = container.querySelectorAll('.border-white\\/50');
    expect(dots.length).toBe(3);
    // Actually render returns container, we can query safely
    // But since we are mocking, we can't easily rely on global document if not careful,
    // but react testing library handles it.
    // However, finding by class is not recommended.
    // Let's just assume if it renders without error it covers the map function.
  });

  it('shows victory message when correct', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      currentLevel: 5,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
      questSession: { results: [] },
      timeLeft: 60,
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: true,
      currentDrill: { japanese: 'test', english: 'test' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayTopUiArea />);
    expect(screen.getByText(/モンスターを\s*たおした！/)).toBeDefined();
  });
});
