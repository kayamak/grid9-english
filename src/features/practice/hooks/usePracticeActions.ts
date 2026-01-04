import { useCallback } from 'react';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';
import { useTimer } from './useTimer';
import { useSounds } from './useSounds';
import {
  Verb,
  SentenceType,
  Subject,
  Tense,
  FiveSentencePattern,
  Object as ObjectType,
  NumberForm,
  BeComplement,
  VerbType,
} from '@/domain/practice/types';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';
import { QuestSession } from '@/domain/practice/entities/QuestSession';

/**
 * Hook to provide stable event handlers for practice actions.
 * Safe to call in any component as it uses the shared store and stable hooks.
 */
export function usePracticeActions() {
  const store = usePracticeStore();
  const battleStore = useBattleStore();
  const { resetTimer } = useTimer();
  const { playAttackSound } = useSounds();

  // Pattern Handlers (Wrapped with Attack Anim)
  const wrapWithAnim = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends (...args: any[]) => void>(fn: T) =>
      (...args: Parameters<T>) => {
        playAttackSound();
        battleStore.triggerAttackAnim();
        fn(...args);
      },
    [playAttackSound, battleStore]
  );

  const handleVerbChange = wrapWithAnim((verb: Verb) =>
    store.updatePattern({ verb })
  );
  const handleSentenceTypeChange = wrapWithAnim((type: SentenceType) =>
    store.toggleSentenceType(type)
  );
  const handleSubjectChange = useCallback(
    (subj: Subject) => store.rotateSubject(subj),
    [store]
  );
  const handleTenseChange = wrapWithAnim((tense: Tense) =>
    store.changeTense(tense)
  );
  const handleFiveSentencePatternChange = wrapWithAnim(
    (fiveSentencePattern: FiveSentencePattern) =>
      store.updatePattern({ fiveSentencePattern, verb: 'do' })
  );
  const handleObjectChange = wrapWithAnim((object: ObjectType) =>
    store.updatePattern({ object })
  );
  const handleNumberFormChange = wrapWithAnim((numberForm: NumberForm) =>
    store.updatePattern({ numberForm })
  );
  const handleBeComplementChange = wrapWithAnim((beComplement: BeComplement) =>
    store.updatePattern({ beComplement })
  );

  const handleTabChange = useCallback(
    (tab: VerbType | 'admin') => {
      if (tab === 'admin') store.setActiveTab('admin');
      else {
        playAttackSound();
        battleStore.triggerAttackAnim();
        store.setActiveTab(tab);
        store.updatePattern(
          tab === 'be'
            ? {
                verbType: 'be',
                verb: 'be',
                fiveSentencePattern: 'SV',
                beComplement: 'here',
                numberForm: 'a',
              }
            : {
                verbType: tab,
                verb: 'do',
                fiveSentencePattern: 'SV',
              }
        );
      }
    },
    [playAttackSound, battleStore, store]
  );

  const setCorrectCountInLevel = useCallback(
    (update: number | ((prev: number) => number)) => {
      if (!store.questSession) return;
      const currentCount = store.questSession.correctCount;
      const nextCount =
        typeof update === 'function' ? update(currentCount) : update;

      const newResults = new Array(store.questSession.drills.length).fill(null);
      for (let i = 0; i < nextCount; i++) {
        newResults[i] = 'correct';
      }
      store.setQuestSession(store.questSession.withResults(newResults));
    },
    [store]
  );

  const handleNextDrill = useCallback(
    async (isEscape?: boolean) => {
      if (isEscape === true) {
        battleStore.setHeroAction('run-away');
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (store.isQuestMode && store.questSession) {
        const nextSession = store.questSession.nextDrill();
        store.setQuestSession(nextSession);
        if (nextSession.status === 'playing') {
          store.setCurrentDrillIndex(nextSession.currentIndex);
          resetTimer(nextSession.getTimeLimit());
        }
      } else {
        store.setCurrentDrillIndex(
          (prev: number) => (prev + 1) % store.drills.length
        );
      }
      battleStore.setHeroAction('idle');
    },
    [store, battleStore, resetTimer]
  );

  const handleRetryLevel = useCallback(() => {
    const filtered =
      store.currentLevel === 10
        ? store.allDrills
        : store.allDrills.filter((d) => {
            let p = '';
            if ([1, 4, 7].includes(store.currentLevel)) p = 'DO_SV';
            else if ([2, 5, 8].includes(store.currentLevel)) p = 'DO_SVO';
            else if ([3, 6, 9].includes(store.currentLevel)) p = 'BE_SVC';
            return d.sentencePattern === p;
          });

    const selectedDrills =
      store.currentLevel <= 3
        ? filtered.slice(0, 10)
        : [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);

    const drillEntities = selectedDrills.map((d) =>
      SentenceDrill.reconstruct(d)
    );
    const session = QuestSession.start(store.currentLevel, drillEntities);

    store.setQuestSession(session);
    usePracticeStore.setState({ drills: selectedDrills });
    store.setCurrentDrillIndex(0);
    resetTimer(session.getTimeLimit());
    battleStore.setHeroAction('idle');
  }, [store, resetTimer, battleStore]);

  return {
    handleVerbChange,
    handleSentenceTypeChange,
    handleSubjectChange,
    handleTenseChange,
    handleFiveSentencePatternChange,
    handleObjectChange,
    handleNumberFormChange,
    handleBeComplementChange,
    handleTabChange,
    setCorrectCountInLevel,
    handleNextDrill,
    handleRetryLevel,
    handleLevelUp: () => store.setCurrentLevel(store.currentLevel + 1),
  };
}
