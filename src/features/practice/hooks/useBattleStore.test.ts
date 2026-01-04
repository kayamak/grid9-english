import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useBattleStore } from './useBattleStore';

describe('useBattleStore', () => {
  beforeEach(() => {
    useBattleStore.getState().resetBattle();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('初期状態が正しいこと', () => {
    const state = useBattleStore.getState();
    expect(state.heroAction).toBe('idle');
    expect(state.monsterState).toBe('idle');
    expect(state.showVictoryEffect).toBe(false);
    expect(state.isScreenShaking).toBe(false);
    expect(state.isScreenFlashing).toBe(false);
  });

  it('setHeroActionが正しく動作すること', () => {
    useBattleStore.getState().setHeroAction('attack');
    expect(useBattleStore.getState().heroAction).toBe('attack');
  });

  it('triggerVictoryEffectが正しく動作すること', () => {
    useBattleStore.getState().triggerVictoryEffect();
    
    // 直後は攻撃モーション
    expect(useBattleStore.getState().heroAction).toBe('attack');
    // まだエフェクトは出ない
    expect(useBattleStore.getState().isScreenFlashing).toBe(false);
    expect(useBattleStore.getState().monsterState).toBe('idle');

    // 150ms後：着弾＆撃破
    vi.advanceTimersByTime(150);
    expect(useBattleStore.getState().isScreenFlashing).toBe(true);
    expect(useBattleStore.getState().isScreenShaking).toBe(true);
    expect(useBattleStore.getState().monsterState).toBe('defeated');
    expect(useBattleStore.getState().showVictoryEffect).toBe(true);

    // さらに150ms後（合計300）：攻撃終了
    vi.advanceTimersByTime(150);
    expect(useBattleStore.getState().heroAction).toBe('idle');
    expect(useBattleStore.getState().isScreenFlashing).toBe(false); // flashは150msで消えるので消えているはず

    vi.advanceTimersByTime(350); // 合計650ms (shakeはstart(150)+duration(500)=650で終わる)
    expect(useBattleStore.getState().isScreenShaking).toBe(false);
  });

  it('triggerAttackAnimが正しく動作すること', () => {
    useBattleStore.getState().triggerAttackAnim();
    
    expect(useBattleStore.getState().heroAction).toBe('attack');
    
    // 150ms後：モンスターがダメージを受ける
    vi.advanceTimersByTime(150);
    expect(useBattleStore.getState().monsterState).toBe('damaged');

    // モンスターのダメージから300ms後（合計450）：モンスターがidleに戻る
    vi.advanceTimersByTime(300);
    expect(useBattleStore.getState().monsterState).toBe('idle');

    // 最初から300ms後：ヒーローがidleに戻る
    // 上のタイマー進行ですでに300ms以上経過しているはず
    expect(useBattleStore.getState().heroAction).toBe('idle');
  });

  it('resetBattleが正しく動作すること', () => {
    useBattleStore.getState().setHeroAction('attack');
    useBattleStore.getState().setMonsterState('damaged');
    useBattleStore.getState().resetBattle();
    
    expect(useBattleStore.getState().heroAction).toBe('idle');
    expect(useBattleStore.getState().monsterState).toBe('idle');
  });
});
