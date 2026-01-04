import { create } from 'zustand';

interface BattleState {
  heroAction: 'idle' | 'run-away' | 'defeated' | 'attack' | 'damaged';
  monsterState: 'idle' | 'hit' | 'defeated' | 'damaged' | 'attack';
  showVictoryEffect: boolean;
  isScreenShaking: boolean;
  isScreenFlashing: boolean;

  setHeroAction: (action: BattleState['heroAction']) => void;
  setMonsterState: (state: BattleState['monsterState']) => void;
  setShowVictoryEffect: (show: boolean) => void;
  setScreenShaking: (shaking: boolean) => void;
  setScreenFlashing: (flashing: boolean) => void;
  
  triggerVictoryEffect: () => void;
  triggerAttackAnim: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  heroAction: 'idle',
  monsterState: 'idle',
  showVictoryEffect: false,
  isScreenShaking: false,
  isScreenFlashing: false,

  setHeroAction: (heroAction) => set({ heroAction }),
  setMonsterState: (monsterState) => set({ monsterState }),
  setShowVictoryEffect: (showVictoryEffect) => set({ showVictoryEffect }),
  setScreenShaking: (isScreenShaking) => set({ isScreenShaking }),
  setScreenFlashing: (isScreenFlashing) => set({ isScreenFlashing }),

  triggerVictoryEffect: () => {
    set({ isScreenFlashing: true });
    setTimeout(() => set({ isScreenFlashing: false }), 150);
    set({ isScreenShaking: true });
    setTimeout(() => set({ isScreenShaking: false }), 500);
    set({ monsterState: 'hit' });
    setTimeout(() => set((state) => ({ 
      monsterState: state.monsterState === 'hit' ? 'defeated' : state.monsterState 
    })), 300);
    set({ showVictoryEffect: true });
  },

  triggerAttackAnim: () => {
    set({ heroAction: 'attack' });
    setTimeout(() => {
      set({ monsterState: 'damaged' });
      setTimeout(() => set((state) => ({
        monsterState: state.monsterState === 'damaged' ? 'idle' : state.monsterState
      })), 300);
    }, 150);
    setTimeout(() => {
      set((state) => ({
        heroAction: state.heroAction === 'attack' ? 'idle' : state.heroAction
      }));
    }, 300);
  },
}));
