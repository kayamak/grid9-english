import React, { useState, useEffect } from 'react';
import { SentencePattern } from '@/domain/practice/types';
import { getAssetPath } from '@/lib/assets';

import { BattleSubjectArea } from './battle_areas/BattleSubjectArea';
import { VerbArea } from './battle_areas/BattleVerbArea';
import { BattleObjectArea } from './battle_areas/BattleObjectArea';
import { BattleOverlayArea } from './battle_areas/BattleOverlayArea';

interface PracticeBattleAreaProps {
  isQuestMode: boolean;
  isFreeMode?: boolean;
  isOnboardingMode?: boolean;
  state: SentencePattern;
  currentDrillIndex: number;
  heroAction: 'idle' | 'run-away' | 'defeated' | 'attack' | 'damaged';
  monsterState: 'idle' | 'hit' | 'defeated' | 'damaged' | 'attack';
  battleImages: {
    subjectImg: string;
    monsterImg: string;
    itemImg: string | null;
    monsterScale: number;
  };
  heroOpacity: number;
  monsterOpacity: number;
  // Props moved from PracticeQuestionArea
  currentLevel: number;
  currentDrill?: { english: string; japanese: string };
  timeLeft: number;
  questResults: ('correct' | 'wrong' | null)[];
  totalDrills: number;
  correctCountInLevel: number;
  isCorrect: boolean;
  onNext: (isEscape?: boolean) => void;
  showVictoryEffect: boolean;
  displayEnglish?: boolean;
  questStatus?: string;
}

export function PracticeBattleArea({
  isQuestMode,
  isFreeMode,
  isOnboardingMode,
  state,
  currentDrillIndex,
  heroAction,
  monsterState,
  battleImages,
  heroOpacity,
  monsterOpacity,
  currentLevel,
  currentDrill,
  timeLeft,
  questResults,
  totalDrills,
  isCorrect,
  onNext,
  displayEnglish = false,
  questStatus = 'playing',
}: PracticeBattleAreaProps) {
  const [attackDistance, setAttackDistance] = useState(150);
  const timeLimit =
    currentLevel === 10 ? 10 : currentLevel < 4 ? 30 : 30 - currentLevel * 2;

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
      <BattleOverlayArea
        isQuestMode={isQuestMode}
        isOnboardingMode={isOnboardingMode}
        isFreeMode={isFreeMode}
        timeLeft={timeLeft}
        timeLimit={timeLimit}
        currentLevel={currentLevel}
        currentDrillIndex={currentDrillIndex}
        totalDrills={totalDrills}
        questResults={questResults}
        currentDrill={currentDrill}
        displayEnglish={displayEnglish}
        isCorrect={isCorrect}
        onNext={onNext}
      />

      {/* Subject Area (Hero) */}
      <BattleSubjectArea
        subject={state.subject}
        currentDrillIndex={currentDrillIndex}
        heroAction={heroAction}
        heroOpacity={heroOpacity}
        attackDistance={attackDistance}
        subjectImg={battleImages.subjectImg}
      />

      {/* Verb Area (Monster) */}
      <VerbArea
        currentDrillIndex={currentDrillIndex}
        monsterState={monsterState}
        monsterOpacity={monsterOpacity}
        monsterImg={battleImages.monsterImg}
        monsterScale={battleImages.monsterScale}
        attackDistance={attackDistance}
      />

      {/* Object Area (Item) */}
      <BattleObjectArea
        object={state.object}
        monsterState={monsterState}
        attackDistance={attackDistance}
        itemImg={battleImages.itemImg}
      />
    </div>
  );
}
