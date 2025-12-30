import React from 'react';
import { Timer } from 'lucide-react';

interface PracticeQuestionAreaProps {
  isQuestMode: boolean;
  currentLevel: number;
  currentDrillIndex: number;
  totalDrills: number;
  timeLeft: number;
  questResults: ('correct' | 'wrong' | null)[];
  correctCountInLevel: number;
  currentDrill: { english: string; japanese: string };
  isCorrect: boolean;
  onNext: (isEscape?: boolean) => void;
  showVictoryEffect: boolean;
  displayEnglish?: boolean;
}

export function PracticeQuestionArea({
  isQuestMode,
  currentLevel,
  currentDrillIndex,
  totalDrills,
  timeLeft,
  questResults,
  correctCountInLevel,
  currentDrill,
  isCorrect,
  onNext,
  showVictoryEffect,
  displayEnglish = false
}: PracticeQuestionAreaProps) {
    const timeLimit = currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : 30 - currentLevel * 2);

    return (
        <div className="dq-window w-full flex flex-col items-center gap-2 overflow-hidden relative shadow-xl">
            {/* Timer Bar */}
            {isQuestMode && (
                <div className="absolute top-0 left-0 h-2 bg-yellow-400 transition-all duration-1000" style={{ width: `${Math.max(0, (timeLeft / timeLimit) * 100)}%` }}></div>
            )}
            
            <div className="w-full flex justify-between items-center px-4 mt-2">
            <div className="flex items-center gap-3">
                <div className="dq-window bg-black px-3 py-1 text-white font-normal text-xl">
                Lv{currentLevel}
                </div>
                <div>
                <p className="text-xs text-white/60">しんちょく</p>
                <p className="text-sm">{currentDrillIndex + 1} / {totalDrills}</p>
                </div>
            </div>

            {isQuestMode && (
                 <div className={`flex flex-col items-end ${timeLeft <= 5 ? 'animate-pulse text-red-500' : 'text-white'}`}>
                    <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-400'}`} />
                    <span className="text-2xl font-normal tabular-nums">{timeLeft}びょう</span>
                    </div>
                </div>
            )}
            </div>

            <div className="flex flex-col items-center py-2 bg-black/40 w-full border-y-2 border-white/20 relative min-h-[120px] justify-center">
            {showVictoryEffect && (
                <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0"></div>
            )}
            
            <p className="text-sm text-white/60 mb-2 z-10">
                {displayEnglish ? 'えいご:' : 'えいごに　なおせ！'}
            </p>
            
            {displayEnglish && (
                 <h2 className="text-2xl md:text-3xl font-normal text-center px-4 md:px-8 z-10 text-yellow-200 mb-2">
                    {currentDrill.english}
                 </h2>
            )}

            <h2 className={`text-2xl md:text-3xl font-normal text-center px-4 md:px-8 z-10 ${displayEnglish ? 'text-white/80' : 'text-white'}`}>
                {currentDrill.japanese}
            </h2>

            {(isCorrect || (isQuestMode && timeLeft === 0)) && (
                <div className="mt-4 flex flex-col items-center z-10 gap-2">
                    {isCorrect && (
                    <p className="text-sm text-green-400 font-bold animate-bounce mt-2 bg-black/60 px-4 py-1 border border-green-400">
                        モンスターを　たおした！
                    </p>
                    )}
                </div>
            )}
            </div>

            <div className="w-full flex justify-between items-center px-4 pb-2">
                <div className="flex items-center gap-4">
                <div className="flex gap-1">
                    {isQuestMode && [...Array(10)].map((_, i) => (
                        <div 
                        key={i} 
                        className={`w-3 h-3 border-2 ${
                            questResults[i] === 'correct' 
                            ? 'bg-green-500 border-white' 
                            : questResults[i] === 'wrong' 
                                ? 'bg-red-500 border-white' 
                                : (i === currentDrillIndex ? 'bg-yellow-400 border-white animate-pulse' : 'bg-transparent border-white/30')
                        }`}
                        />
                    ))}
                </div>
                {isQuestMode && (
                    <span className="text-xs text-white/60">{correctCountInLevel} / 10 せいかい</span>
                )}
                </div>

                {(isCorrect || (isQuestMode && timeLeft === 0)) ? (
                <button 
                    onClick={() => onNext()}
                    className="dq-button animate-bounce"
                >
                    {isQuestMode && currentDrillIndex + 1 === totalDrills ? 'けっかへ' : 'つぎへ'}
                </button>
                ) : (
                <button 
                    onClick={() => onNext(true)}
                    className="dq-button text-xs py-1"
                >
                    にげる
                </button>
                )}
            </div>
        </div>
    );
}
