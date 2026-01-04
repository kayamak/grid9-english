import { usePracticeStore } from './usePracticeStore';

/**
 * Hook to access timer actions and state.
 * Safe to call in any component as it uses the shared store.
 */
export function useTimer() {
  const timeLeft = usePracticeStore((s) => s.timeLeft);
  const isTimerActive = usePracticeStore((s) => s.isTimerActive);
  const resetTimer = usePracticeStore((s) => s.resetTimer);
  const stopTimer = usePracticeStore((s) => s.stopTimer);
  const setIsTimerActive = usePracticeStore((s) => s.setIsTimerActive);
  const setTimeLeft = usePracticeStore((s) => s.setTimeLeft);

  return {
    timeLeft,
    isTimerActive,
    resetTimer,
    stopTimer,
    setIsTimerActive,
    setTimeLeft,
  };
}
