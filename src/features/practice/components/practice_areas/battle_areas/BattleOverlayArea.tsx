import React from 'react';
import { OverlayTimerBar } from './overlay_areas/OverlayTimerBar';
import { OverlayTopUiArea } from './overlay_areas/OverlayTopUiArea';
import { OverlayBottomButtonArea } from './overlay_areas/OverlayBottomButtonArea';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';
import { usePracticeDerivedState } from '../../../hooks/usePracticeDerivedState';

export function BattleOverlayArea() {
  const {
    isQuestMode,
    isOnboardingMode,
    isFreeMode,
    timeLeft,
    currentLevel,
    currentDrillIndex,
    drills,
    questSession,
  } = usePracticeStore();
  const { handleNextDrill } = usePracticeActions();
  const { isCorrect, currentDrill } = usePracticeDerivedState();

  const totalDrills = drills.length;
  const questResults = questSession?.results || [];
  const timeLimit =
    currentLevel === 10 ? 10 : currentLevel < 4 ? 30 : 30 - currentLevel * 2;
  const displayEnglish = !isQuestMode || (isQuestMode && timeLeft === 0);

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
        onNext={handleNextDrill}
        currentDrill={currentDrill}
      />
    </div>
  );
}
