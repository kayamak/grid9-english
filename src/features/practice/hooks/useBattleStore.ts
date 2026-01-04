import { create } from 'zustand';

interface BattleState {
  heroAction: 'idle' | 'run-away' | 'defeated' | 'attack' | 'damaged';
  monsterState: 'idle' | 'defeated' | 'damaged' | 'attack';
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
  resetBattle: () => void;
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
    // 1. Attack Start
    set({ heroAction: 'attack' });

    // 2. Hit Effect & Monster Defeated (delayed to match attack)
    setTimeout(() => {
      set({ isScreenShaking: true });
      set({ isScreenFlashing: true });
      
      set(() => ({
        monsterState: 'defeated'
      }));
      set({ showVictoryEffect: true });
      
      // Stop shaking/flashing
      setTimeout(() => set({ isScreenFlashing: false }), 150);
      setTimeout(() => set({ isScreenShaking: false }), 500);
    }, 150);

    // 3. Hero Back to Idle
    setTimeout(() => {
      set((state) => ({
        heroAction: state.heroAction === 'attack' ? 'idle' : state.heroAction
      }));
    }, 300);
  },

  triggerAttackAnim: () => {
    set({ heroAction: 'attack' });
    setTimeout(() => {
      // Only set to damaged if not already defeated or hit
      set((state) => ({
        monsterState: (state.monsterState === 'idle') ? 'damaged' : state.monsterState
      }));
      
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

  resetBattle: () => set({
    heroAction: 'idle',
    monsterState: 'idle',
    showVictoryEffect: false,
    isScreenShaking: false,
    isScreenFlashing: false,
  }),
}));
