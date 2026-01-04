import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { OverlayTimerBar } from './OverlayTimerBar';
import { usePracticeStore } from '@/features/practice/hooks/usePracticeStore';

vi.mock('@/features/practice/hooks/usePracticeStore');

describe('OverlayTimerBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if not quest mode', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: false,
      questSession: {},
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { container } = render(<OverlayTimerBar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders bar with correct width', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      timeLeft: 30,
      questSession: {
        getTimeLimit: () => 60,
      },
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { container } = render(<OverlayTimerBar />);

    // Find the inner div
    // structure: div > div.style width
    const bar = container.firstChild?.firstChild as HTMLElement;
    expect(bar).toBeDefined();
    // width: (30/60)*100 = 50%
    expect(bar.style.width).toBe('50%');
  });

  it('handles 0 time left', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      isQuestMode: true,
      timeLeft: 0,
      questSession: {
        getTimeLimit: () => 60,
      },
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { container } = render(<OverlayTimerBar />);
    const bar = container.firstChild?.firstChild as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });
});
