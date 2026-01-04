import React from 'react';
import Link from 'next/link';
import { Timer } from 'lucide-react';
import { usePracticeStore } from '@/features/practice/hooks/usePracticeStore';
import { usePracticeDerivedState } from '@/features/practice/hooks/usePracticeDerivedState';

export function OverlayTopUiArea() {
  const {
    isQuestMode,
    isOnboardingMode,
    isFreeMode,
    currentLevel,
    currentDrillIndex,
    drills,
    questSession,
    timeLeft,
  } = usePracticeStore();
  const { isCorrect, currentDrill } = usePracticeDerivedState();

  const totalDrills = drills.length;
  const questResults = questSession?.results || [];
  const displayEnglish = !isQuestMode || (isQuestMode && timeLeft === 0);

  return (
    <div className="absolute top-0 left-0 right-0 p-2 md:p-4 z-30 flex flex-col gap-2 pointer-events-none">
      <div className="relative w-full flex justify-between items-center">
        {/* Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <div className="text-white text-[10px] md:text-xs font-bold drop-shadow-md bg-black/30 px-2 py-1 rounded">
            {isOnboardingMode
              ? 'オンボーディング'
              : isQuestMode
                ? 'ドリルクエスト'
                : isFreeMode
                  ? 'じゆうトレーニング'
                  : 'ぶんしょうトレーニング'}
          </div>
        </div>

        {/* Top Left: Back & Level */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/"
            className="dq-button !py-1 !px-2 md:!px-3 text-[10px] md:text-xs bg-black/40 hover:bg-black/60 border-white/40"
          >
            &larr; もどる
          </Link>
          <div className="flex items-center gap-2 text-white bg-black/40 px-2 py-1 rounded border border-white/20">
            <span className="font-bold text-sm md:text-base">
              Lv{currentLevel}
            </span>
            {totalDrills > 0 && (
              <span className="text-[10px] md:text-xs opacity-70">
                {currentDrillIndex + 1}/{totalDrills}
              </span>
            )}
          </div>
        </div>

        {/* Top Right: Mode Label & Timer & Progress Dots */}
        <div className="flex items-center gap-2">
          {isQuestMode && (
            <div className="flex items-center gap-3">
              {/* Progress Dots */}
              <div className="flex gap-1">
                {questResults.map((result, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 md:w-3 md:h-3 border border-white/50 ${
                      result === 'correct'
                        ? 'bg-green-500'
                        : result === 'wrong'
                          ? 'bg-red-500'
                          : i === currentDrillIndex
                            ? 'bg-yellow-400 animate-pulse'
                            : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              {/* Timer */}
              <div
                className={`flex items-center gap-1 ${timeLeft <= 5 ? 'animate-pulse text-red-500' : 'text-white'}`}
              >
                <Timer className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-lg font-bold tabular-nums">
                  {timeLeft}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Question Text */}
      <div className="absolute top-12 left-0 right-0 flex flex-col items-center justify-center p-2 pointer-events-none">
        <div className="bg-black/60 border border-white/20 p-3 md:p-4 rounded-lg text-center backdrop-blur-sm shadow-lg max-w-[90%] md:max-w-xl">
          {currentDrill ? (
            <>
              <h2
                className={`text-xl md:text-3xl font-normal leading-tight ${displayEnglish ? 'text-white/90' : 'text-white'}`}
              >
                {currentDrill.japanese}
              </h2>
              {displayEnglish && (
                <h2 className="text-lg md:text-2xl font-normal text-yellow-200 mt-2 leading-tight">
                  {currentDrill.english}
                </h2>
              )}
            </>
          ) : (
            <h2 className="text-xl md:text-3xl font-normal leading-tight text-white">
              じゆうに　えいぶんを　つくるべし！
            </h2>
          )}
        </div>

        {/* Victory Message */}
        {(isCorrect || (isQuestMode && timeLeft === 0)) && (
          <div className="mt-2 text-center">
            {isCorrect && (
              <p className="text-xs md:text-sm text-green-400 font-bold animate-bounce bg-black/80 px-4 py-1 border border-green-400 inline-block rounded">
                モンスターを　たおした！
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
