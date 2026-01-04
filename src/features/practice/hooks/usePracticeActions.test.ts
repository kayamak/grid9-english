import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePracticeActions } from './usePracticeActions';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';
import { useTimer } from './useTimer';
import { useSounds } from './useSounds';
import { QuestSession } from '@/domain/practice/entities/QuestSession';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';

// Mock all dependency hooks
vi.mock('./usePracticeStore', () => {
  const mockfn = vi.fn() as any;
  mockfn.setState = vi.fn();
  return { usePracticeStore: mockfn };
});
vi.mock('./useBattleStore', () => ({
  useBattleStore: vi.fn(),
}));
vi.mock('./useTimer', () => ({
  useTimer: vi.fn(),
}));
vi.mock('./useSounds', () => ({
  useSounds: vi.fn(),
}));

describe('usePracticeActions', () => {
  const mockStore = {
    updatePattern: vi.fn(),
    toggleSentenceType: vi.fn(),
    rotateSubject: vi.fn(),
    changeTense: vi.fn(),
    setActiveTab: vi.fn(),
    setQuestSession: vi.fn(),
    setCurrentDrillIndex: vi.fn(),
    setCurrentLevel: vi.fn(),
    drills: [{ id: '1' }, { id: '2' }],
    currentLevel: 1,
    isQuestMode: false,
    questSession: null,
  };

  const mockBattleStore = {
    triggerAttackAnim: vi.fn(),
    setHeroAction: vi.fn(),
    resetBattle: vi.fn(),
  };

  const mockTimer = {
    resetTimer: vi.fn(),
  };

  const mockSounds = {
    playAttackSound: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(usePracticeStore).mockReturnValue(mockStore as any);
    vi.mocked(useBattleStore).mockReturnValue(mockBattleStore as any);
    vi.mocked(useTimer).mockReturnValue(mockTimer as any);
    vi.mocked(useSounds).mockReturnValue(mockSounds as any);
    vi.clearAllMocks();
  });

  it('handleSentenceTypeChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleSentenceTypeChange('negative');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.toggleSentenceType).toHaveBeenCalledWith('negative');
  });

  it('handleTenseChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleTenseChange('past');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.changeTense).toHaveBeenCalledWith('past');
  });

  it('handleFiveSentencePatternChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleFiveSentencePatternChange('SVO');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.updatePattern).toHaveBeenCalledWith({ fiveSentencePattern: 'SVO', verb: 'do' });
  });

  it('handleObjectChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleObjectChange('baseball');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.updatePattern).toHaveBeenCalledWith({ object: 'baseball' });
  });

  it('handleNumberFormChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleNumberFormChange('plural');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.updatePattern).toHaveBeenCalledWith({ numberForm: 'plural' });
  });

  it('handleBeComplementChangeがアニメーションを伴って動作すること', () => {
    const { result } = renderHook(() => usePracticeActions());
    result.current.handleBeComplementChange('happy');
    
    expect(mockSounds.playAttackSound).toHaveBeenCalled();
    expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
    expect(mockStore.updatePattern).toHaveBeenCalledWith({ beComplement: 'happy' });
  });

  describe('handleTabChange', () => {
    it('adminタブへの切り替えはアニメーションなしで行われること', () => {
      const { result } = renderHook(() => usePracticeActions());
      result.current.handleTabChange('admin');
      
      expect(mockSounds.playAttackSound).not.toHaveBeenCalled();
      expect(mockStore.setActiveTab).toHaveBeenCalledWith('admin');
    });

    it('beタブへの切り替えはアニメーションを伴い、初期値が設定されること', () => {
      const { result } = renderHook(() => usePracticeActions());
      result.current.handleTabChange('be');
      
      expect(mockSounds.playAttackSound).toHaveBeenCalled();
      expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
      expect(mockStore.setActiveTab).toHaveBeenCalledWith('be');
      expect(mockStore.updatePattern).toHaveBeenCalledWith({
        verbType: 'be',
        verb: 'be',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
        numberForm: 'a',
      });
    });

    it('doタブへの切り替えはアニメーションを伴い、初期値が設定されること', () => {
      const { result } = renderHook(() => usePracticeActions());
      result.current.handleTabChange('do');
      
      expect(mockSounds.playAttackSound).toHaveBeenCalled();
      expect(mockBattleStore.triggerAttackAnim).toHaveBeenCalled();
      expect(mockStore.setActiveTab).toHaveBeenCalledWith('do');
      expect(mockStore.updatePattern).toHaveBeenCalledWith({
        verbType: 'do',
        verb: 'do',
        fiveSentencePattern: 'SV',
      });
    });
  });

  describe('Quest Mode', () => {
    it('setCorrectCountInLevelが正しく動作すること', () => {
      const mockQuestSession = {
        correctCount: 2,
        drills: [{}, {}, {}, {}],
        withResults: vi.fn(),
      };
      
      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        questSession: mockQuestSession,
      } as any);

      const { result } = renderHook(() => usePracticeActions());
      result.current.setCorrectCountInLevel((prev) => prev + 1);

      expect(mockQuestSession.withResults).toHaveBeenCalledWith(['correct', 'correct', 'correct', null]);
      expect(mockStore.setQuestSession).toHaveBeenCalled();
    });

    it('handleNextDrillがクエストモードで正しく動作すること', () => {
      const mockNextSession = {
        status: 'playing',
        currentIndex: 1,
        getTimeLimit: () => 10,
      };
      const mockQuestSession = {
        nextDrill: vi.fn().mockReturnValue(mockNextSession),
      };

      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        isQuestMode: true,
        questSession: mockQuestSession,
      } as any);

      const { result } = renderHook(() => usePracticeActions());
      result.current.handleNextDrill();

      expect(mockQuestSession.nextDrill).toHaveBeenCalled();
      expect(mockStore.setQuestSession).toHaveBeenCalledWith(mockNextSession);
      expect(mockStore.setCurrentDrillIndex).toHaveBeenCalledWith(1);
      expect(mockTimer.resetTimer).toHaveBeenCalledWith(10);
      expect(mockBattleStore.setHeroAction).toHaveBeenCalledWith('idle');
    });

    it('handleNextDrillでエスケープフラグがtrueの場合、run-awayアクションが設定されること', async () => {
        const { result } = renderHook(() => usePracticeActions());
        const promise = result.current.handleNextDrill(true);
        
        expect(mockBattleStore.setHeroAction).toHaveBeenCalledWith('run-away');
        await promise;
        // その後の通常の処理も呼ばれることを確認
        expect(mockBattleStore.setHeroAction).toHaveBeenCalledWith('idle');
    });

    it('handleRetryLevelが正しく動作すること', () => {
      // Mock for handleRetryLevel
      const mockDrills = [
        { sentencePattern: 'DO_SV', id: '1' },
         { sentencePattern: 'DO_SV', id: '2' }
      ] as any[];
      
      const sessionStartSpy = vi.spyOn(QuestSession, 'start').mockReturnValue({
        getTimeLimit: () => 30,
      } as any);
      
      const sentenceDrillMock = vi.spyOn(SentenceDrill, 'reconstruct').mockImplementation((d) => d as any);

      vi.mocked(usePracticeStore).mockReturnValue({
        ...mockStore,
        currentLevel: 1,
        allDrills: mockDrills,
      } as any);

      const { result } = renderHook(() => usePracticeActions());
      result.current.handleRetryLevel();

      expect(sessionStartSpy).toHaveBeenCalled();
      expect(mockStore.setQuestSession).toHaveBeenCalled();
      expect(mockStore.setCurrentDrillIndex).toHaveBeenCalledWith(0);
      expect(mockTimer.resetTimer).toHaveBeenCalledWith(30);
      expect(mockBattleStore.setHeroAction).toHaveBeenCalledWith('idle');
    });
  });
});
