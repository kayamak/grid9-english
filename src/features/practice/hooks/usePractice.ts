import { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestSession } from '@/domain/practice/entities/QuestSession';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';
import {
  SentencePattern,
  WordProps,
  VerbType,
  Verb,
  SentenceType,
  Subject,
  Tense,
  FiveSentencePattern,
  Object as ObjectType,
  NumberForm,
  BeComplement,
} from '@/domain/practice/types';
import { PatternGenerator } from '@/domain/practice/services/PatternGenerator';

import { usePracticeStore } from '../hooks/usePracticeStore';
import { useBattleStore } from '../hooks/useBattleStore';
import { useTimer } from '../hooks/useTimer';
import { useSounds } from '../hooks/useSounds';

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
  const { timeLeft, resetTimer, stopTimer, setIsTimerActive } = useTimer();
  const { playAttackSound } = useSounds();

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

      const drillEntities = selectedDrills.map((d) => SentenceDrill.reconstruct(d));
      const session = QuestSession.start(store.currentLevel, drillEntities);
      
      store.setQuestSession(session);
      usePracticeStore.setState({ drills: selectedDrills }); // Update drills in store
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

  // Derived State
  const generatedText = useMemo(
    () => PatternGenerator.generate(store.state, store.words.nouns, store.words.verbs),
    [store.state, store.words.nouns, store.words.verbs]
  );

  const currentDrill = usePracticeStore((s) => s.drills[s.currentDrillIndex]);
  const isCorrect = useMemo(() => {
    if (!currentDrill) return false;
    return QuestSession.checkAnswer(generatedText, currentDrill.english);
  }, [generatedText, currentDrill]);

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
    setTimeout(() => {
      battleStore.setMonsterState('idle');
      battleStore.setShowVictoryEffect(false);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentDrillIndex, store.state.subject, store.state.verb, store.state.object]);

  // Handlers
  const handleNextDrill = useCallback(async (isEscape?: boolean) => {
    if (isEscape === true) {
      battleStore.setHeroAction('run-away');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (isQuestMode && store.questSession) {
      const nextSession = store.questSession.nextDrill();
      store.setQuestSession(nextSession);
      if (nextSession.status === 'playing') {
        store.setCurrentDrillIndex(nextSession.currentIndex);
        resetTimer(nextSession.getTimeLimit());
      }
    } else {
      store.setCurrentDrillIndex((prev) => (prev + 1) % store.drills.length);
    }
    battleStore.setHeroAction('idle');
  }, [isQuestMode, store, battleStore, resetTimer]);

  const handleRetryLevel = useCallback(() => {
    const filtered = store.currentLevel === 10
      ? allDrills
      : allDrills.filter((d) => {
          let p = '';
          if ([1, 4, 7].includes(store.currentLevel)) p = 'DO_SV';
          else if ([2, 5, 8].includes(store.currentLevel)) p = 'DO_SVO';
          else if ([3, 6, 9].includes(store.currentLevel)) p = 'BE_SVC';
          return d.sentencePattern === p;
        });

    const selectedDrills = store.currentLevel <= 3
      ? filtered.slice(0, 10)
      : [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);

    const drillEntities = selectedDrills.map((d) => SentenceDrill.reconstruct(d));
    const session = QuestSession.start(store.currentLevel, drillEntities);
    
    store.setQuestSession(session);
    usePracticeStore.setState({ drills: selectedDrills });
    store.setCurrentDrillIndex(0);
    resetTimer(session.getTimeLimit());
    battleStore.setHeroAction('idle');
  }, [store, allDrills, resetTimer, battleStore]);

  const setCorrectCountInLevel = useCallback(
    (update: number | ((prev: number) => number)) => {
      if (!store.questSession) return;
      const currentCount = store.questSession.correctCount;
      const nextCount = typeof update === 'function' ? update(currentCount) : update;

      const newResults = new Array(store.questSession.drills.length).fill(null);
      for (let i = 0; i < nextCount; i++) {
        newResults[i] = 'correct';
      }
      store.setQuestSession(store.questSession.withResults(newResults));
    },
    [store]
  );

  // Pattern Handlers (Wrapped with Attack Anim)
  const wrapWithAnim = (fn: Function) => (...args: any[]) => {
    playAttackSound();
    battleStore.triggerAttackAnim(store.state.subject);
    fn(...args);
  };

  const battleImages = useMemo(() => {
    let subjectImg = '/assets/heroes/hero.png';
    const { subject, verbType, fiveSentencePattern, verb } = store.state;
    
    if (subject === 'second' || subject === 'second_p') subjectImg = '/assets/heroes/mage.png';
    else if (subject === 'third_s' || subject === 'third_p') subjectImg = '/assets/heroes/warrior.png';

    let monsterImg = '/assets/monsters/slime.png';
    let monsterScale = 1.0;
    
    if (verbType === 'be' && (fiveSentencePattern === 'SV' || fiveSentencePattern === 'SVC')) {
      monsterImg = '/assets/monsters/bit_golem.png';
    } else if (fiveSentencePattern === 'SV' || fiveSentencePattern === 'SVO') {
      monsterImg = '/assets/monsters/void_dragon_v2.png';
      monsterScale = 1.7;
    } else if (['have', 'see', 'get'].includes(verb)) {
      monsterImg = '/assets/monsters/dragon.png';
      monsterScale = 1.7;
    }

    let itemImg = null;
    if (fiveSentencePattern === 'SVO') {
      itemImg = '/assets/monsters/o_slime.png';
    } else if (verbType === 'be' && fiveSentencePattern === 'SVC') {
      itemImg = '/assets/monsters/crescent_beast.png';
    }

    return { subjectImg, monsterImg, itemImg, monsterScale };
  }, [store.state]);

  const { heroOpacity, monsterOpacity } = useMemo(() => {
    if (!store.questSession) return { heroOpacity: 1, monsterOpacity: 1 };
    const correct = store.questSession.results.filter((r) => r === 'correct').length;
    const wrong = store.questSession.results.filter((r) => r === 'wrong').length;
    return {
      heroOpacity: correct < wrong ? 0.5 : 1,
      monsterOpacity: correct > wrong ? 0.5 : 1,
    };
  }, [store.questSession]);

  return {
    ...store,
    ...battleStore,
    timeLeft,
    generatedText,
    isCorrect,
    currentDrill,
    handleNextDrill,
    handleRetryLevel,
    handleLevelUp: () => store.setCurrentLevel(store.currentLevel + 1),
    setCorrectCountInLevel,
    handleVerbTypeChange: (verbType: VerbType) => {
      playAttackSound();
      battleStore.triggerAttackAnim(store.state.subject);
      store.setActiveTab(verbType);
      store.updatePattern(verbType === 'be' ? {
        verbType,
        verb: 'be',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
        numberForm: 'a',
      } : {
        verbType,
        verb: 'do',
        fiveSentencePattern: 'SV',
      });
    },
    handleVerbChange: wrapWithAnim((verb: Verb) => store.updatePattern({ verb })),
    handleSentenceTypeChange: wrapWithAnim((type: SentenceType) => store.toggleSentenceType(type)),
    handleSubjectChange: (subj: Subject) => store.rotateSubject(subj),
    handleTenseChange: wrapWithAnim((tense: Tense) => store.changeTense(tense)),
    handleFiveSentencePatternChange: wrapWithAnim((fiveSentencePattern: FiveSentencePattern) => 
      store.updatePattern({ fiveSentencePattern, verb: 'do' })
    ),
    handleObjectChange: wrapWithAnim((object: ObjectType) => store.updatePattern({ object })),
    handleNumberFormChange: wrapWithAnim((numberForm: NumberForm) => store.updatePattern({ numberForm })),
    handleBeComplementChange: wrapWithAnim((beComplement: BeComplement) => store.updatePattern({ beComplement })),
    handleTabChange: (tab: VerbType | 'admin') => {
      if (tab === 'admin') store.setActiveTab('admin');
      else {
        playAttackSound();
        battleStore.triggerAttackAnim(store.state.subject);
        store.setActiveTab(tab);
        store.updatePattern(tab === 'be' ? {
          verbType: 'be',
          verb: 'be',
          fiveSentencePattern: 'SV',
          beComplement: 'here',
          numberForm: 'a',
        } : {
          verbType: tab,
          verb: 'do',
          fiveSentencePattern: 'SV',
        });
      }
    },
    battleImages,
    heroOpacity,
    monsterOpacity,
  };
}
