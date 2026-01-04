import { useCallback } from 'react';
import { useBattleStore } from './useBattleStore';
import { usePracticeStore } from './usePracticeStore';
import { getAssetPath } from '@/lib/assets';

/**
 * Hook to provide stable audio playback functions.
 * Safe to call in any component as it contains no side effects.
 */
export function useSounds() {
  const heroAction = useBattleStore((s) => s.heroAction);
  const subject = usePracticeStore((s) => s.state.subject);

  const playSound = useCallback((soundFile: string) => {
    const audio = new Audio(getAssetPath(`/assets/sounds/${soundFile}`));
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  const playAttackSound = useCallback(() => {
    let soundFile = 'hero_attack.wav';
    
    if (subject === 'second' || subject === 'second_p') {
      soundFile = 'magic_attack.wav';
    } else if (subject === 'third_s' || subject === 'third_p') {
      soundFile = 'warrior_attack.wav';
    }

    playSound(soundFile);
  }, [subject, playSound]);

  return { playSound, playAttackSound };
}
