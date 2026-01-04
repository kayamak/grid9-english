import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSounds } from './useSounds';
import { usePracticeStore } from './usePracticeStore';

// Mock usePracticeStore
vi.mock('./usePracticeStore', () => ({
  usePracticeStore: vi.fn(),
}));

// Mock getAssetPath
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => path,
}));

describe('useSounds', () => {
  let mockAudio: {
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock Audio
    mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
    };
    
    vi.stubGlobal('Audio', vi.fn(function() { return mockAudio; }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setMockSubject = (subject: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(usePracticeStore).mockImplementation(((selector: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selector({ state: { subject } })) as any);
  };

  it('playSoundが正しく動作すること', () => {
    setMockSubject('first'); // default
    const { result } = renderHook(() => useSounds());

    result.current.playSound('test.wav');

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/test.wav');
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('playAttackSound: デフォルトの攻撃音が再生されること', () => {
    setMockSubject('first');
    const { result } = renderHook(() => useSounds());

    result.current.playAttackSound();

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/hero_attack.wav');
  });

  it('playAttackSound: 魔法使い（second）の場合はmagic_attackが再生されること', () => {
    setMockSubject('second');
    const { result } = renderHook(() => useSounds());

    result.current.playAttackSound();

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/magic_attack.wav');
  });

  it('playAttackSound: 魔法使い（second_p）の場合もmagic_attackが再生されること', () => {
    setMockSubject('second_p');
    const { result } = renderHook(() => useSounds());

    result.current.playAttackSound();

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/magic_attack.wav');
  });

  it('playAttackSound: 戦士（third_s）の場合はwarrior_attackが再生されること', () => {
    setMockSubject('third_s');
    const { result } = renderHook(() => useSounds());

    result.current.playAttackSound();

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/warrior_attack.wav');
  });

  it('playAttackSound: 戦士（third_p）の場合もwarrior_attackが再生されること', () => {
    setMockSubject('third_p');
    const { result } = renderHook(() => useSounds());

    result.current.playAttackSound();

    expect(global.Audio).toHaveBeenCalledWith('/assets/sounds/warrior_attack.wav');
  });
});
