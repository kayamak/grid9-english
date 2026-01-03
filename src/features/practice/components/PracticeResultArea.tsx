"use client";

import React from 'react';
import { PracticeLevelUpArea } from './PracticeLevelUpArea';
import { PracticeFailedArea } from './PracticeFailedArea';
import { PracticeAllClearedArea } from './PracticeAllClearedArea';

interface PracticeResultAreaProps {
  isQuestMode: boolean;
  questStatus: string;
  correctCountInLevel: number;
  currentLevel: number;
  onLevelUp: () => void;
  onRetry: () => void;
}

export function PracticeResultArea({
  isQuestMode,
  questStatus,
  correctCountInLevel,
  currentLevel,
  onLevelUp,
  onRetry,
}: PracticeResultAreaProps) {
  if (!isQuestMode) return null;

  return (
    <>
      {questStatus === 'result' && (
        <PracticeLevelUpArea
          correctCountInLevel={correctCountInLevel}
          currentLevel={currentLevel}
          onLevelUp={onLevelUp}
        />
      )}

      {questStatus === 'failed' && (
        <PracticeFailedArea
          correctCountInLevel={correctCountInLevel}
          onRetry={onRetry}
        />
      )}

      {questStatus === 'all-cleared' && (
        <PracticeAllClearedArea />
      )}
    </>
  );
}
