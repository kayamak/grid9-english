'use client';

import React from 'react';
import { NineKeyPanel } from './answer_areas/NineKeyPanel';
import { OnboardingBubble } from './answer_areas/OnboardingBubble';
import { VerbTypeSelector } from './answer_areas/VerbTypeSelector';
import { FiveSentencePatternSelector } from './answer_areas/FiveSentencePatternSelector';
import { VerbSelector } from './answer_areas/VerbSelector';
import { ObjectSelector } from './answer_areas/ObjectSelector';
import { NounDeterminerSelector } from './answer_areas/NounDeterminerSelector';
import { ComplementSelector } from './answer_areas/ComplementSelector';
import { usePracticeStore } from '../../hooks/usePracticeStore';
import { usePracticeDerivedState } from '../../hooks/usePracticeDerivedState';
import { usePracticeActions } from '../../hooks/usePracticeActions';

interface PracticeAnswerAreaProps {
  isOnboardingMode?: boolean;
  onboardingStep?: number;
  onOnboardingNext?: () => void;
}

export function PracticeAnswerArea({
  isOnboardingMode,
  onboardingStep,
  onOnboardingNext,
}: PracticeAnswerAreaProps) {
  const {
    activeTab,
    isAdmin,
    currentLevel,
    questSession,
    state,
    isQuestMode,
    setCurrentLevel,
    timeLeft,
  } = usePracticeStore();

  const {
    setCorrectCountInLevel,
  } = usePracticeActions();

  const { generatedText, isCorrect } = usePracticeDerivedState();

  const correctCountInLevel = questSession?.correctCount || 0;

  const showBubble = (step: number) =>
    isOnboardingMode && onboardingStep === step;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full px-4 md:px-8 flex justify-start">
        <div className="relative">
          <VerbTypeSelector />
          {showBubble(1) && onOnboardingNext && (
            <OnboardingBubble
              message="まずは動詞の種類を選びます。&#10;タブの「Doどうし」か「Beどうし」の&#10;どちらかを選択してください。"
              onClick={onOnboardingNext}
              position="top"
              className="mb-4"
            />
          )}
        </div>
      </div>

      {/* 2. DQ Window Container */}
      <section className="dq-window-fancy w-full p-4 md:p-8 flex flex-col items-center min-h-[500px]">
        {activeTab === 'admin' ? (
          <div className="w-full max-w-xl flex flex-col gap-8 py-8 animate-in fade-in duration-500">
            <h3 className="text-2xl text-yellow-400 border-b-2 border-yellow-400 pb-2 mb-4">
              デバッグ管理
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-white/60 text-sm">現在のレベル</span>
                  <span className="text-4xl font-normal text-white">
                    Lv {currentLevel}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setCurrentLevel(Math.max(1, currentLevel - 1))
                    }
                    className="dq-button !py-2 !px-6 text-2xl"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setCurrentLevel(Math.min(10, currentLevel + 1))
                    }
                    className="dq-button !py-2 !px-6 text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-white/60 text-sm">現在の正解数</span>
                  <span className="text-4xl font-normal text-white">
                    {correctCountInLevel} / 10
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setCorrectCountInLevel(Math.max(0, correctCountInLevel - 1))
                    }
                    className="dq-button !py-2 !px-6 text-2xl"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setCorrectCountInLevel(Math.min(10, correctCountInLevel + 1))
                    }
                    className="dq-button !py-2 !px-6 text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-white/40 text-sm">
                <p>※レベルは自動的にクッキーに保存されます。</p>
                <p>※正解数を変更するとクエストモードの判定に影響します。</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                (isQuestMode && timeLeft === 0)
                  ? 'pointer-events-none grayscale'
                  : isCorrect
                    ? 'pointer-events-none'
                    : ''
              }
            >
              <div className="w-full max-w-xl">
                <NineKeyPanel
                  onboardingStep={onboardingStep}
                  onOnboardingNext={onOnboardingNext}
                />
              </div>

              {/* Verb and Sentence Pattern Selector Dropdowns */}
              {(state.verbType === 'do' || state.verbType === 'be') && (
                <div className="mt-6 w-full max-w-xl flex flex-col gap-4 relative z-20">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-fit">
                      <FiveSentencePatternSelector />
                      {showBubble(5) && onOnboardingNext && (
                        <OnboardingBubble
                          message="リストから「ぶんけい」を選びます。&#10;Sは主語、Vは動詞、&#10;Oは目的語、Cは補語を表します。"
                          onClick={onOnboardingNext}
                          position="bottom"
                          align="start"
                        />
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <VerbSelector />
                      {showBubble(6) && onOnboardingNext && (
                        <OnboardingBubble
                          message="リストから「どうし」を選びます。&#10;問題文の動詞と同じものを&#10;探して選択してください。"
                          onClick={onOnboardingNext}
                          position="top"
                        />
                      )}
                    </div>
                  </div>
                  {state.verbType === 'do' &&
                    state.fiveSentencePattern === 'SVO' && (
                      <ObjectSelector>
                        <NounDeterminerSelector />
                      </ObjectSelector>
                    )}
                  {state.verbType === 'be' &&
                    (state.fiveSentencePattern === 'SVC' ? (
                      <ComplementSelector>
                        <NounDeterminerSelector
                          isAdjective={true}
                        />
                      </ComplementSelector>
                    ) : (
                      <ComplementSelector />
                    ))}
                </div>
              )}
            </div>

            <div className="mt-8 w-full max-w-lg relative">
              {/* DQ style result box */}
              <div
                className={`dq-window transition-colors duration-500 p-4 text-center ${isCorrect ? 'border-yellow-400 bg-black/80' : 'border-white bg-black'}`}
              >
                <p
                  className={`text-sm uppercase tracking-widest mb-1 ${isCorrect ? 'text-yellow-400' : isQuestMode && timeLeft === 0 ? 'text-red-500' : 'text-white/40'}`}
                >
                  {isCorrect
                    ? '★ せいかい！ ★'
                    : isQuestMode && timeLeft === 0
                      ? '⏰ じかんぎれ！ ⏰'
                      : 'けっか'}
                </p>
                <p
                  className={`text-3xl md:text-5xl font-normal leading-tight transition-all duration-300 ${isCorrect ? 'text-white scale-105' : isQuestMode && timeLeft === 0 ? 'text-red-500 opacity-50' : 'text-white'}`}
                >
                  {generatedText}
                </p>
              </div>
              {showBubble(7) && onOnboardingNext && (
                <OnboardingBubble
                  message="「けっか」の枠を見てください。&#10;作成された英文が問題と同じなら、&#10;モンスターを攻撃します。"
                  onClick={onOnboardingNext}
                  position="top"
                />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
