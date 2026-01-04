import { useEffect, useCallback } from 'react';
import { getAssetPath } from '@/lib/assets';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';

export function useSounds() {
  const isQuestMode = usePracticeStore((s) => s.isQuestMode);
  const isFreeMode = usePracticeStore((s) => s.isFreeMode);
  const heroAction = useBattleStore((s) => s.heroAction);
  const subject = usePracticeStore((s) => s.state.subject);

  const playSound = useCallback((file: string) => {
    const audio = new Audio(getAssetPath(`/assets/sounds/${file}`));
    audio.play().catch(() => {});
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

  // BGM Management
  useEffect(() => {
    let bgmFile = 'free_training_bgm.mp3';

    if (heroAction === 'defeated') {
      bgmFile = 'dead_bgm.mp3';
    } else if (isQuestMode) {
      bgmFile = 'drill_quest_bgm.mp3';
    } else if (isFreeMode) {
      bgmFile = 'writing_training_bgm.mp3';
    }

    const audio = new Audio(getAssetPath(`/assets/sounds/${bgmFile}`));
    audio.loop = true;
    audio.volume = 0.2;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isQuestMode, isFreeMode, heroAction]);

  return { playSound, playAttackSound };
}
