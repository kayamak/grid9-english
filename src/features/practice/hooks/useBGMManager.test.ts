import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBGMManager } from './useBGMManager';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';

// Mock stores
vi.mock('./usePracticeStore', () => ({
  usePracticeStore: vi.fn(),
}));

vi.mock('./useBattleStore', () => ({
  useBattleStore: vi.fn(),
}));

// Mock getAssetPath
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => path,
}));

describe('useBGMManager', () => {
  let mockAudio: {
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    currentTime: number;
    loop: boolean;
    volume: number;
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock Audio
    mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      loop: false,
      volume: 1,
    };

    vi.stubGlobal(
      'Audio',
      vi.fn(function () {
        return mockAudio;
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setMockState = (
    practiceState: { isQuestMode: boolean; isFreeMode: boolean },
    battleState: { heroAction: string }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(usePracticeStore).mockImplementation(((selector: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selector(practiceState)) as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useBattleStore).mockImplementation(((selector: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selector(battleState)) as any);
  };

  it('倒された時はdead_bgmが再生されること', () => {
    setMockState(
      { isQuestMode: true, isFreeMode: false },
      { heroAction: 'defeated' }
    );

    const { unmount } = renderHook(() => useBGMManager());

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/dead_bgm.mp3');
    expect(mockAudio.loop).toBe(true);
    expect(mockAudio.volume).toBe(0.2);
    expect(mockAudio.play).toHaveBeenCalled();

    unmount();
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(mockAudio.currentTime).toBe(0);
  });

  it('クエストモードの時はdrill_quest_bgmが再生されること', () => {
    setMockState(
      { isQuestMode: true, isFreeMode: false },
      { heroAction: 'idle' }
    );

    renderHook(() => useBGMManager());

    expect(global.Audio).toHaveBeenCalledWith(
      '/assets/sounds/drill_quest_bgm.mp3'
    );
  });

  it('フリーモードの時はwriting_training_bgmが再生されること', () => {
    setMockState(
      { isQuestMode: false, isFreeMode: true },
      { heroAction: 'idle' }
    );

    renderHook(() => useBGMManager());

    expect(global.Audio).toHaveBeenCalledWith(
      '/assets/sounds/writing_training_bgm.mp3'
    );
  });

  it('デフォルト（どちらでもない場合）はfree_training_bgmが再生されること', () => {
    setMockState(
      { isQuestMode: false, isFreeMode: false },
      { heroAction: 'idle' }
    );

    renderHook(() => useBGMManager());

    expect(global.Audio).toHaveBeenCalledWith(
      '/assets/sounds/free_training_bgm.mp3'
    );
  });
});
