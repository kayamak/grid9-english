'use client';

import React from 'react';
import { ResultLevelUpArea } from './result_areas/ResultLevelUpArea';
import { ResultFailedArea } from './result_areas/ResultFailedArea';
import { ResultAllClearedArea } from './result_areas/ResultAllClearedArea';

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
        <ResultLevelUpArea
          correctCountInLevel={correctCountInLevel}
          currentLevel={currentLevel}
          onLevelUp={onLevelUp}
        />
      )}

      {questStatus === 'failed' && (
        <ResultFailedArea
          correctCountInLevel={correctCountInLevel}
          onRetry={onRetry}
        />
      )}

      {questStatus === 'all-cleared' && <ResultAllClearedArea />}
    </>
  );
}
