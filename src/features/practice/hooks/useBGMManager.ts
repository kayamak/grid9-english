import { useEffect } from 'react';
import { getAssetPath } from '@/lib/assets';
import { usePracticeStore } from './usePracticeStore';
import { useBattleStore } from './useBattleStore';

/**
 * Manager hook for BGM side effects.
 * SHOULD ONLY BE CALLED ONCE in PracticeContainer.
 */
export function useBGMManager() {
  const isQuestMode = usePracticeStore((s) => s.isQuestMode);
  const isFreeMode = usePracticeStore((s) => s.isFreeMode);
  const heroAction = useBattleStore((s) => s.heroAction);

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
}
