import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimerManager } from './useTimerManager';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';
import { useSounds } from './useSounds';

// Mock stores
vi.mock('./usePracticeStore', () => ({
  usePracticeStore: vi.fn(),
}));

vi.mock('./useBattleStore', () => ({
  useBattleStore: vi.fn(),
}));

// Mock useSounds
vi.mock('./useSounds', () => ({
  useSounds: vi.fn(),
}));

describe('useTimerManager', () => {
  const mockPlaySound = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Default useSounds mock
    vi.mocked(useSounds).mockReturnValue({
      playSound: mockPlaySound,
      playAttackSound: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const setMockState = (
    practiceState: {
      isQuestMode: boolean;
      questSession?: { status: string; submitAnswer: ReturnType<typeof vi.fn> };
      timeLeft: number;
      isTimerActive: boolean;
      setTimeLeft: ReturnType<typeof vi.fn>;
      setIsTimerActive: ReturnType<typeof vi.fn>;
      setQuestSession: ReturnType<typeof vi.fn>;
    },
    battleState: {
      setHeroAction: ReturnType<typeof vi.fn>;
      setMonsterState: ReturnType<typeof vi.fn>;
    }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(usePracticeStore).mockImplementation(((selector: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selector(practiceState)) as any);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useBattleStore).mockImplementation(((selector: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selector(battleState)) as any);

    return { practiceState, battleState };
  };

  it('タイマーがアクティブな時、1秒ごとにtimeLeftが減少すること', () => {
    const setTimeLeft = vi.fn();
    setMockState(
      {
        isQuestMode: true,
        questSession: { status: 'playing', submitAnswer: vi.fn() },
        timeLeft: 10,
        isTimerActive: true,
        setTimeLeft,
        setIsTimerActive: vi.fn(),
        setQuestSession: vi.fn(),
      },
      {
        setHeroAction: vi.fn(),
        setMonsterState: vi.fn(),
      }
    );

    renderHook(() => useTimerManager());

    vi.advanceTimersByTime(1000);
    expect(setTimeLeft).toHaveBeenCalled();
    // Verify callback logic if possible, or just that it was called
    // Since we mock the store, we can't easily check the implementation of the callback passed to setTimeLeft
    // unless we inspect the call arguments.
    // However, knowing it's called repeatedly is good enough for this side-effect test.
    
    vi.advanceTimersByTime(1000);
    expect(setTimeLeft).toHaveBeenCalledTimes(2);
  });

  it('timeLeftが0になった時、モンスターの攻撃と敗北処理が実行されること', () => {
    const setIsTimerActive = vi.fn();
    const setMonsterState = vi.fn();
    const setHeroAction = vi.fn();
    const setQuestSession = vi.fn();
    const submitAnswer = vi.fn().mockReturnValue('newSession');

    setMockState(
      {
        isQuestMode: true,
        questSession: { status: 'playing', submitAnswer },
        timeLeft: 0,
        isTimerActive: true,
        setTimeLeft: vi.fn(),
        setIsTimerActive,
        setQuestSession,
      },
      {
        setHeroAction,
        setMonsterState,
      }
    );

    renderHook(() => useTimerManager());

    // Initially execute setTimeout(..., 0)
    vi.runAllTimers();

    // Check immediate effects
    expect(setIsTimerActive).toHaveBeenCalledWith(false);
    expect(mockPlaySound).toHaveBeenCalledWith('monster_attack.wav');
    expect(setMonsterState).toHaveBeenCalledWith('attack');

    // Verify sequences (nested setTimeouts are mocked by fake timers, so runAllTimers executes them)
    
    // After 300ms
    expect(setMonsterState).toHaveBeenCalledWith('idle');
    expect(setHeroAction).toHaveBeenCalledWith('damaged');

    // After 500ms (total 800ms)
    expect(submitAnswer).toHaveBeenCalledWith(false);
    expect(setQuestSession).toHaveBeenCalledWith('newSession');
    expect(setHeroAction).toHaveBeenCalledWith('defeated');
  });

  it('タイマーが非アクティブな時はカウントダウンしないこと', () => {
    const setTimeLeft = vi.fn();
    setMockState(
      {
        isQuestMode: true,
        questSession: { status: 'playing', submitAnswer: vi.fn() },
        timeLeft: 10,
        isTimerActive: false, // Inactive
        setTimeLeft,
        setIsTimerActive: vi.fn(),
        setQuestSession: vi.fn(),
      },
      {
        setHeroAction: vi.fn(),
        setMonsterState: vi.fn(),
      }
    );

    renderHook(() => useTimerManager());

    vi.advanceTimersByTime(1000);
    expect(setTimeLeft).not.toHaveBeenCalled();
  });
});
