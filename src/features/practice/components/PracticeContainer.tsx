'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PracticeBattleArea } from './practice_areas/PracticeBattleArea';
import { PracticeAnswerArea } from './practice_areas/PracticeAnswerArea';
import { PracticeResultArea } from './practice_areas/PracticeResultArea';
import { usePractice } from '../hooks/usePractice';
import { WordProps } from '@/domain/practice/types';

export function PracticeContainer({
  initialWords,
  allDrills,
}: {
  initialWords: {
    nouns: WordProps[];
    verbs: WordProps[];
    adjectives: WordProps[];
    adverbs: WordProps[];
  };
  allDrills: {
    id: string;
    sentencePattern: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }[];
}) {
  const {
    isQuestMode,
    isFreeMode,
    isOnboardingMode,
    isAdmin,
    currentLevel,
    setCurrentLevel,
    questSession,
    heroAction,
    monsterState,
    showVictoryEffect,
    isScreenShaking,
    isScreenFlashing,
    state,
    words,
    isLoadingWords,
    drills,
    currentDrillIndex,
    timeLeft,
    generatedText,
    isCorrect,
    currentDrill,
    handleNextDrill,
    handleRetryLevel,
    handleLevelUp,
    setCorrectCountInLevel,
    handleSentenceTypeChange,
    handleSubjectChange,
    handleTenseChange,
    handleFiveSentencePatternChange,
    handleVerbChange,
    handleObjectChange,
    handleNumberFormChange,
    handleBeComplementChange,
    handleTabChange,
    battleImages,
    heroOpacity,
    monsterOpacity,
    activeTab,
    sessionId,
  } = usePractice(initialWords, allDrills);

  const questStatus = questSession?.status || 'playing';
  const questResults = questSession?.results || [];
  const correctCountInLevel = questSession?.correctCount || 0;

  // Onboarding Logic
  const [onboardingStep, setOnboardingStep] = React.useState(1);
  const router = useRouter();

  const handleOnboardingNext = () => {
    if (onboardingStep >= 7) {
      router.push('/');
    } else {
      setOnboardingStep((prev) => prev + 1);
    }
  };

  return (
    <main
      className={`min-h-screen bg-[#000840] flex flex-col items-center p-4 md:p-8 font-dot text-white transition-all duration-75 ${isScreenShaking ? 'translate-x-2 -translate-y-1 rotate-1' : ''}`}
    >
      {isScreenFlashing && (
        <div className="fixed inset-0 bg-white z-[1000] opacity-80 pointer-events-none" />
      )}

      <div className="w-full max-w-4xl relative flex flex-col gap-4">
        <PracticeBattleArea
          isQuestMode={isQuestMode}
          isFreeMode={isFreeMode}
          isOnboardingMode={isOnboardingMode}
          state={state}
          currentDrillIndex={currentDrillIndex}
          heroAction={heroAction}
          monsterState={monsterState}
          battleImages={battleImages}
          heroOpacity={heroOpacity}
          monsterOpacity={monsterOpacity}
          currentLevel={currentLevel}
          currentDrill={currentDrill}
          timeLeft={timeLeft}
          questResults={questResults}
          totalDrills={drills.length}
          correctCountInLevel={correctCountInLevel}
          isCorrect={isCorrect}
          onNext={handleNextDrill}
          showVictoryEffect={showVictoryEffect}
          displayEnglish={!isQuestMode || (isQuestMode && timeLeft === 0)}
          questStatus={questStatus}
        />

        <PracticeResultArea
          isQuestMode={isQuestMode}
          questStatus={questStatus}
          correctCountInLevel={correctCountInLevel}
          currentLevel={currentLevel}
          onLevelUp={handleLevelUp}
          onRetry={handleRetryLevel}
        />

        <PracticeAnswerArea
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          isAdmin={isAdmin}
          currentLevel={currentLevel}
          setCurrentLevel={(val) => {
            if (typeof val === 'function') {
              setCurrentLevel(val(currentLevel));
            } else {
              setCurrentLevel(val);
            }
          }}
          correctCountInLevel={correctCountInLevel}
          setCorrectCountInLevel={setCorrectCountInLevel}
          state={state}
          handleSentenceTypeChange={handleSentenceTypeChange}
          handleSubjectChange={handleSubjectChange}
          handleTenseChange={handleTenseChange}
          handleFiveSentencePatternChange={handleFiveSentencePatternChange}
          handleVerbChange={handleVerbChange}
          handleObjectChange={handleObjectChange}
          handleNumberFormChange={handleNumberFormChange}
          handleBeComplementChange={handleBeComplementChange}
          nounWords={words.nouns}
          verbWords={words.verbs}
          adjectiveWords={words.adjectives}
          adverbWords={words.adverbs}
          isLoadingNouns={isLoadingWords}
          generatedText={generatedText}
          isCorrect={isCorrect}
          isQuestMode={isQuestMode}
          timeLeft={timeLeft}
          isOnboardingMode={isOnboardingMode}
          onboardingStep={onboardingStep}
          onOnboardingNext={handleOnboardingNext}
        />

        <div className="mt-12 text-center opacity-30 text-xs font-mono">
          SESSION_ID: {sessionId}
        </div>
      </div>
    </main>
  );
}
