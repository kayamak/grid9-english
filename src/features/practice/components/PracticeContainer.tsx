'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PracticeBattleArea } from './practice_areas/PracticeBattleArea';
import { PracticeAnswerArea } from './practice_areas/PracticeAnswerArea';
import { PracticeResultArea } from './practice_areas/PracticeResultArea';
import { usePractice } from '../hooks/usePractice';
import { useTimerManager } from '../hooks/useTimerManager';
import { useBGMManager } from '../hooks/useBGMManager';
import { useBattleStore } from '../hooks/useBattleStore';
import { usePracticeStore } from '../hooks/usePracticeStore';
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
  usePractice(initialWords, allDrills);
  useTimerManager();
  useBGMManager();

  const { isScreenShaking, isScreenFlashing } = useBattleStore();
  const { isOnboardingMode, sessionId } = usePracticeStore();

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
        <PracticeBattleArea />

        <PracticeResultArea />

        <PracticeAnswerArea
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
