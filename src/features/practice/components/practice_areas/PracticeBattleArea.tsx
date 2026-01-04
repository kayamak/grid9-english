'use client';

import React, { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/assets';

import { BattleSubjectArea } from './battle_areas/BattleSubjectArea';
import { VerbArea } from './battle_areas/BattleVerbArea';
import { BattleObjectArea } from './battle_areas/BattleObjectArea';
import { BattleOverlayArea } from './battle_areas/BattleOverlayArea';
import { usePracticeStore } from '../../hooks/usePracticeStore';
import { useBattleStore } from '../../hooks/useBattleStore';
import { usePracticeActions } from '../../hooks/usePracticeActions';
import { usePracticeDerivedState } from '../../hooks/usePracticeDerivedState';

export function PracticeBattleArea() {
  const {
    isQuestMode,
    isFreeMode,
    questSession,
  } = usePracticeStore();
  const { currentDrill } = usePracticeDerivedState();

  const questStatus = questSession?.status || 'playing';

  const [attackDistance, setAttackDistance] = useState(150);

  useEffect(() => {
    const updateDistance = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setAttackDistance(300);
      } else {
        setAttackDistance(120);
      }
    };

    updateDistance();
    window.addEventListener('resize', updateDistance);
    return () => window.removeEventListener('resize', updateDistance);
  }, []);

  if (isQuestMode && (!currentDrill || questStatus !== 'playing')) {
    return null;
  }

  return (
    <div
      className="dq-battle-bg relative w-full h-[333px] md:h-[474px] mb-4 flex justify-around items-end px-4 gap-2 rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl group"
      style={{
        backgroundImage: `url(${getAssetPath(isQuestMode ? '/assets/backgrounds/battle_bg.jpeg' : isFreeMode ? '/assets/backgrounds/dungeon.jpeg' : '/assets/backgrounds/stadium_bg.jpeg')})`,
      }}
    >
      <BattleOverlayArea />

      {/* Subject Area (Hero) */}
      <BattleSubjectArea
        attackDistance={attackDistance}
      />

      {/* Verb Area (Monster) */}
      <VerbArea
        attackDistance={attackDistance}
      />

      {/* Object Area (Item) */}
      <BattleObjectArea
        attackDistance={attackDistance}
      />
    </div>
  );
}
