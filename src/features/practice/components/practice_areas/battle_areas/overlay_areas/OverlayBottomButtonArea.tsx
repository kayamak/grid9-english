import React from 'react';

interface OverlayBottomButtonAreaProps {
  isCorrect: boolean;
  isQuestMode: boolean;
  timeLeft: number;
  currentDrillIndex: number;
  totalDrills: number;
  onNext: (isEscape?: boolean) => void;
  currentDrill?: { english: string; japanese: string };
}

export function OverlayBottomButtonArea({
  isCorrect,
  isQuestMode,
  timeLeft,
  currentDrillIndex,
  totalDrills,
  onNext,
  currentDrill,
}: OverlayBottomButtonAreaProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      {isCorrect || (isQuestMode && timeLeft === 0) ? (
        <button
          onClick={() => onNext()}
          className="dq-button animate-bounce text-lg px-8 py-3 shadow-[0_0_15px_rgba(255,255,0,0.5)] border-yellow-400"
        >
          {isQuestMode && currentDrillIndex + 1 === totalDrills
            ? 'けっかへ'
            : 'つぎへすすむ'}
        </button>
      ) : (
        currentDrill && (
          <button
            onClick={() => onNext(true)}
            className="dq-button text-xs py-1 px-4 bg-gray-800 border-gray-500 opacity-80 hover:opacity-100"
          >
            にげる
          </button>
        )
      )}
    </div>
  );
}
