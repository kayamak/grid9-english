import React from 'react';
import { OverlayTimerBar } from './overlay_areas/OverlayTimerBar';
import { OverlayTopUiArea } from './overlay_areas/OverlayTopUiArea';
import { OverlayBottomButtonArea } from './overlay_areas/OverlayBottomButtonArea';

interface BattleOverlayAreaProps {
  isQuestMode: boolean;
  isOnboardingMode?: boolean;
  isFreeMode?: boolean;
  timeLeft: number;
  timeLimit: number;
  currentLevel: number;
  currentDrillIndex: number;
  totalDrills: number;
  questResults: ('correct' | 'wrong' | null)[];
  currentDrill?: { english: string; japanese: string };
  displayEnglish: boolean;
  isCorrect: boolean;
  onNext: (isEscape?: boolean) => void;
}

export function BattleOverlayArea({
  isQuestMode,
  isOnboardingMode,
  isFreeMode,
  timeLeft,
  timeLimit,
  currentLevel,
  currentDrillIndex,
  totalDrills,
  questResults,
  currentDrill,
  displayEnglish,
  isCorrect,
  onNext,
}: BattleOverlayAreaProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-20">
      <OverlayTimerBar
        isQuestMode={isQuestMode}
        timeLeft={timeLeft}
        timeLimit={timeLimit}
      />

      <OverlayTopUiArea
        isQuestMode={isQuestMode}
        isOnboardingMode={isOnboardingMode}
        isFreeMode={isFreeMode}
        currentLevel={currentLevel}
        currentDrillIndex={currentDrillIndex}
        totalDrills={totalDrills}
        questResults={questResults}
        currentDrill={currentDrill}
        displayEnglish={displayEnglish}
        isCorrect={isCorrect}
        timeLeft={timeLeft}
      />

      <OverlayBottomButtonArea
        isCorrect={isCorrect}
        isQuestMode={isQuestMode}
        timeLeft={timeLeft}
        currentDrillIndex={currentDrillIndex}
        totalDrills={totalDrills}
        onNext={onNext}
        currentDrill={currentDrill}
      />
    </div>
  );
}
