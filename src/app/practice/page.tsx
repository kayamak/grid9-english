import React, { Suspense } from 'react';
import {
  getNounWords,
  getVerbWords,
  getAdjectiveWords,
  getAdverbWords,
} from '@/features/practice/actions/words';
import { getSentenceDrills } from '@/features/practice/actions/drills';
import { PracticeContainer } from '@/features/practice/components/PracticeContainer';

export default async function PracticePage() {
  const initialWords = {
    nouns: await getNounWords(),
    verbs: await getVerbWords(),
    adjectives: await getAdjectiveWords(),
    adverbs: await getAdverbWords(),
  };

  const allDrills = await getSentenceDrills();

  return (
    <Suspense fallback={<div>Loading Practice...</div>}>
      <PracticeContainer initialWords={initialWords} allDrills={allDrills} />
    </Suspense>
  );
}
