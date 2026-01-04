import { useState, useEffect, useCallback } from 'react';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';
import { useSounds } from './useSounds';

export function useTimer() {
  const isQuestMode = usePracticeStore((s) => s.isQuestMode);
  const questSession = usePracticeStore((s) => s.questSession);
  const setQuestSession = usePracticeStore((s) => s.setQuestSession);
  
  const setHeroAction = useBattleStore((s) => s.setHeroAction);
  const setMonsterState = useBattleStore((s) => s.setMonsterState);
  
  const { playSound } = useSounds();

  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const resetTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
  }, []);

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
  }, [isQuestMode, isTimerActive, timeLeft, questSession, setQuestSession, setHeroAction, setMonsterState, playSound]);

  return {
    timeLeft,
    isTimerActive,
    resetTimer,
    stopTimer,
    setIsTimerActive,
    setTimeLeft,
  };
}
