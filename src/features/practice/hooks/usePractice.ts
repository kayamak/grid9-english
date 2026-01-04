import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestSession } from '@/domain/practice/entities/QuestSession';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';
import {
  WordProps,
} from '@/domain/practice/types';

import { usePracticeStore } from '../hooks/usePracticeStore';
import { useBattleStore } from '../hooks/useBattleStore';
import { useTimer } from '../hooks/useTimer';
import { usePracticeDerivedState } from './usePracticeDerivedState';

/**
 * Manager hook for the practice lifecycle side effects.
 * SHOULD ONLY BE CALLED ONCE in PracticeContainer.
 */
export function usePractice(
  initialWords?: {
    nouns: WordProps[];
    verbs: WordProps[];
    adjectives: WordProps[];
    adverbs: WordProps[];
  },
  allDrills: {
    id: string;
    sentencePattern: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }[] = []
) {
  const searchParams = useSearchParams();
  const isQuestMode = searchParams.get('mode') === 'quest';
  const isFreeMode = searchParams.get('mode') === 'free';
  const isOnboardingMode = searchParams.get('onboarding') === 'true';
  const selectedPattern = searchParams.get('pattern') || undefined;
  const initialDrillIndex = parseInt(searchParams.get('drill') || '1') - 1;
  const isAdmin = searchParams.get('role') === 'ADMIN';

  const store = usePracticeStore();
  const battleStore = useBattleStore();
  const { resetTimer, stopTimer } = useTimer();
  const { isCorrect } = usePracticeDerivedState();

  // Initialization
  useEffect(() => {
    let initialLevel = 1;
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; playerLevel=`);
      if (parts.length === 2) {
        const val = parts.pop()?.split('').shift();
        if (val) initialLevel = parseInt(val);
      }
    }

    store.setInitialState({
      isQuestMode,
      isFreeMode,
      isOnboardingMode,
      isAdmin,
      currentLevel: initialLevel,
      allDrills,
      initialWords,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cookie Sync
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `playerLevel=${store.currentLevel}${expires}; path=/`;
  }, [store.currentLevel]);

  // Session & Drills Initialization
  useEffect(() => {
    // Avoid double initialization if allDrills is empty (sub-component call mitigation)
    if (allDrills.length === 0 && store.allDrills.length > 0) return;

    let selectedDrills = [];
    if (isQuestMode) {
      let pattern = '';
      let filtered = [];
      if (store.currentLevel === 10) {
        filtered = allDrills;
      } else {
        if ([1, 4, 7].includes(store.currentLevel)) pattern = 'DO_SV';
        else if ([2, 5, 8].includes(store.currentLevel)) pattern = 'DO_SVO';
        else if ([3, 6, 9].includes(store.currentLevel)) pattern = 'BE_SVC';
        filtered = allDrills.filter((d) => d.sentencePattern === pattern);
      }

      if (store.currentLevel <= 3) {
        selectedDrills = filtered.slice(0, 10);
      } else {
        selectedDrills = [...filtered]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
      }

      if (selectedDrills.length === 0) return;

      const drillEntities = selectedDrills.map((d) => SentenceDrill.reconstruct(d));
      const session = QuestSession.start(store.currentLevel, drillEntities);
      
      store.setQuestSession(session);
      usePracticeStore.setState({ drills: selectedDrills });
      store.setCurrentDrillIndex(0);
      resetTimer(session.getTimeLimit());
    } else {
      if (isFreeMode) {
        usePracticeStore.setState({ drills: [] });
        store.setQuestSession(null);
      } else {
        selectedDrills = selectedPattern
          ? allDrills.filter((d) => d.sentencePattern === selectedPattern)
          : allDrills;
        usePracticeStore.setState({ drills: selectedDrills });
        store.setQuestSession(null);
        store.setCurrentDrillIndex(Math.max(0, initialDrillIndex));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuestMode, store.currentLevel, selectedPattern, allDrills]);

  // Handle Correct Answer
  useEffect(() => {
    if (isCorrect && !battleStore.showVictoryEffect) {
      setTimeout(() => {
        if (isQuestMode && store.questSession?.status === 'playing') {
          const updatedSession = store.questSession.submitAnswer(true);
          store.setQuestSession(updatedSession);
          stopTimer();
          battleStore.triggerVictoryEffect();
        } else if (!isQuestMode) {
          battleStore.triggerVictoryEffect();
        }
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorrect]);

  // Reset effects on change
  useEffect(() => {
    if (isCorrect) return;

    const timer = setTimeout(() => {
      battleStore.setMonsterState('idle');
      battleStore.setShowVictoryEffect(false);
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentDrillIndex, store.state.subject, store.state.verb, store.state.object, isCorrect]);
}
