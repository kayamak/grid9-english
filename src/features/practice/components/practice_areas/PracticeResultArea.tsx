'use client';

import React from 'react';
import { ResultLevelUpArea } from './result_areas/ResultLevelUpArea';
import { ResultFailedArea } from './result_areas/ResultFailedArea';
import { ResultAllClearedArea } from './result_areas/ResultAllClearedArea';
import { usePracticeStore } from '../../hooks/usePracticeStore';

export function PracticeResultArea() {
  const { questSession } = usePracticeStore();

  const questStatus = questSession?.status || 'playing';

  if (questStatus === 'playing') return null;

  return (
    <div className="w-full flex flex-col items-center px-4">
      {questStatus === 'result' && (
        <ResultLevelUpArea />
      )}
      {questStatus === 'failed' && (
        <ResultFailedArea />
      )}
      {questStatus === 'all-cleared' && <ResultAllClearedArea />}
    </div>
  );
}
