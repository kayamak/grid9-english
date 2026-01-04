import React from 'react';
import { usePracticeStore } from '@/features/practice/hooks/usePracticeStore';
import { usePracticeActions } from '@/features/practice/hooks/usePracticeActions';
import { usePracticeDerivedState } from '@/features/practice/hooks/usePracticeDerivedState';

export function OverlayBottomButtonArea() {
  const { isQuestMode, timeLeft, currentDrillIndex, drills } =
    usePracticeStore();
  const { handleNextDrill } = usePracticeActions();
  const { isCorrect, currentDrill } = usePracticeDerivedState();

  const totalDrills = drills.length;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      {isCorrect || (isQuestMode && timeLeft === 0) ? (
        <button
          onClick={() => handleNextDrill()}
          className="dq-button animate-bounce text-lg px-8 py-3 shadow-[0_0_15px_rgba(255,255,0,0.5)] border-yellow-400"
        >
          {isQuestMode && currentDrillIndex + 1 === totalDrills
            ? 'けっかへ'
            : 'つぎへすすむ'}
        </button>
      ) : (
        currentDrill && (
          <button
            onClick={() => handleNextDrill(true)}
            className="dq-button text-xs py-1 px-4 bg-gray-800 border-gray-500 opacity-80 hover:opacity-100"
          >
            にげる
          </button>
        )
      )}
    </div>
  );
}
