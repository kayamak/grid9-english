import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverlayBottomButtonArea } from './OverlayBottomButtonArea';
import { usePracticeStore } from '@/features/practice/hooks/usePracticeStore';
import { usePracticeActions } from '@/features/practice/hooks/usePracticeActions';
import { usePracticeDerivedState } from '@/features/practice/hooks/usePracticeDerivedState';

// Mocks
vi.mock('@/features/practice/hooks/usePracticeStore');
vi.mock('@/features/practice/hooks/usePracticeActions');
vi.mock('@/features/practice/hooks/usePracticeDerivedState');

describe('OverlayBottomButtonArea', () => {
  const mockHandleNextDrill = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeActions).mockReturnValue({
      handleNextDrill: mockHandleNextDrill,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders "give up" button when playing and not correct', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: false,
      timeLeft: 60,
      currentDrillIndex: 0,
      drills: [{ id: '1' }, { id: '2' }],
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false,
      currentDrill: { id: '1' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayBottomButtonArea />);

    expect(screen.getByText('にげる')).toBeDefined();

    // Click calls handleNextDrill(true)
    fireEvent.click(screen.getByText('にげる'));
    expect(mockHandleNextDrill).toHaveBeenCalledWith(true); // true means skip/giveup
  });

  it('renders "next" button when correct', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: false,
      timeLeft: 60,
      currentDrillIndex: 0,
      drills: [{ id: '1' }, { id: '2' }],
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: true,
      currentDrill: { id: '1' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayBottomButtonArea />);

    expect(screen.getByText('つぎへすすむ')).toBeDefined();
    expect(screen.queryByText('にげる')).toBeNull();

    fireEvent.click(screen.getByText('つぎへすすむ'));
    expect(mockHandleNextDrill).toHaveBeenCalledWith(); // undefined or no args
  });

  it('renders "result" button on last drill of quest when correct', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      timeLeft: 60,
      currentDrillIndex: 1, // Last index (0, 1) -> length 2 is wrong logic?
      // Code: currentDrillIndex + 1 === totalDrills
      drills: [{ id: '1' }, { id: '2' }],
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: true,
      currentDrill: { id: '2' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayBottomButtonArea />);

    expect(screen.getByText('けっかへ')).toBeDefined();
  });

  it('renders next/result button when time is up in Quest Mode', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      timeLeft: 0,
      currentDrillIndex: 0,
      drills: [{ id: '1' }],
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(usePracticeDerivedState).mockReturnValue({
      isCorrect: false, // Not correct, but time up
      currentDrill: { id: '1' },
    } as unknown as ReturnType<typeof usePracticeDerivedState>);

    render(<OverlayBottomButtonArea />);

    // Should show 'けっかへ' since it's 1/1
    expect(screen.getByText('けっかへ')).toBeDefined();
  });
});
