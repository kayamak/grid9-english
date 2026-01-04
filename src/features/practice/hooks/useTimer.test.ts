import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimer } from './useTimer';
import { usePracticeStore } from './usePracticeStore';

// Mock usePracticeStore
vi.mock('./usePracticeStore', () => ({
  usePracticeStore: vi.fn(),
}));

describe('useTimer', () => {
  const mockStore = {
    timeLeft: 30,
    isTimerActive: false,
    resetTimer: vi.fn(),
    stopTimer: vi.fn(),
    setIsTimerActive: vi.fn(),
    setTimeLeft: vi.fn(),
  };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(usePracticeStore).mockImplementation(((selector: any) => selector(mockStore)) as any);
  });

  it('タイマーの状態に正しくアクセスできること', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.timeLeft).toBe(30);
    expect(result.current.isTimerActive).toBe(false);
  });

  it('タイマーのアクションに正しくアクセスできること', () => {
    const { result } = renderHook(() => useTimer());
    
    result.current.resetTimer(10);
    expect(mockStore.resetTimer).toHaveBeenCalledWith(10);

    result.current.stopTimer();
    expect(mockStore.stopTimer).toHaveBeenCalled();

    result.current.setIsTimerActive(true);
    expect(mockStore.setIsTimerActive).toHaveBeenCalledWith(true);

    result.current.setTimeLeft(5);
    expect(mockStore.setTimeLeft).toHaveBeenCalledWith(5);
  });
});
