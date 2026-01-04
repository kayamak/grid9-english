import { useEffect } from 'react';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';
import { useSounds } from './useSounds';

/**
 * Manager hook for the practice timer side effects.
 * SHOULD ONLY BE CALLED ONCE in PracticeContainer.
 */
export function useTimerManager() {
  const isQuestMode = usePracticeStore((s) => s.isQuestMode);
  const questSession = usePracticeStore((s) => s.questSession);
  const setQuestSession = usePracticeStore((s) => s.setQuestSession);
  const timeLeft = usePracticeStore((s) => s.timeLeft);
  const setTimeLeft = usePracticeStore((s) => s.setTimeLeft);
  const isTimerActive = usePracticeStore((s) => s.isTimerActive);
  const setIsTimerActive = usePracticeStore((s) => s.setIsTimerActive);

  const setHeroAction = useBattleStore((s) => s.setHeroAction);
  const setMonsterState = useBattleStore((s) => s.setMonsterState);

  const { playSound } = useSounds();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (
      isQuestMode &&
      isTimerActive &&
      timeLeft > 0 &&
      questSession?.status === 'playing'
    ) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (
      timeLeft === 0 &&
      questSession?.status === 'playing' &&
      isTimerActive
    ) {
      // Use setTimeout to avoid direct state update in effect
      setTimeout(() => {
        setIsTimerActive(false);
        playSound('monster_attack.wav');
        setMonsterState('attack');

        setTimeout(() => {
          setMonsterState('idle');
          setHeroAction('damaged');
          setTimeout(() => {
            setQuestSession(questSession.submitAnswer(false));
            setHeroAction('defeated');
          }, 500);
        }, 300);
      }, 0);
    }
    return () => clearInterval(timer);
  }, [
    isQuestMode,
    isTimerActive,
    timeLeft,
    questSession,
    setQuestSession,
    setHeroAction,
    setMonsterState,
    playSound,
    setTimeLeft,
    setIsTimerActive,
  ]);
}
