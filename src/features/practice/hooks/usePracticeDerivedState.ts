import { useMemo } from 'react';
import { usePracticeStore } from './usePracticeStore';
import { PatternGenerator } from '@/domain/practice/services/PatternGenerator';
import { QuestSession } from '@/domain/practice/entities/QuestSession';

export function usePracticeDerivedState() {
  const store = usePracticeStore();

  const generatedText = useMemo(
    () =>
      PatternGenerator.generate(
        store.state,
        store.words.nouns,
        store.words.verbs
      ),
    [store.state, store.words.nouns, store.words.verbs]
  );

  const currentDrill = store.drills[store.currentDrillIndex];

  const isCorrect = useMemo(() => {
    if (!currentDrill) return false;
    return QuestSession.checkAnswer(generatedText, currentDrill.english);
  }, [generatedText, currentDrill]);

  const battleImages = useMemo(() => {
    let subjectImg = '/assets/heroes/hero.png';
    const { subject, verbType, fiveSentencePattern, verb } =
      store.state.toObject();

    if (subject === 'second' || subject === 'second_p')
      subjectImg = '/assets/heroes/mage.png';
    else if (subject === 'third_s' || subject === 'third_p')
      subjectImg = '/assets/heroes/warrior.png';

    let monsterImg = '/assets/monsters/slime.png';
    let monsterScale = 1.0;

    if (
      verbType === 'be' &&
      (fiveSentencePattern === 'SV' || fiveSentencePattern === 'SVC')
    ) {
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
    const correct = store.questSession.results.filter(
      (r) => r === 'correct'
    ).length;
    const wrong = store.questSession.results.filter(
      (r) => r === 'wrong'
    ).length;
    return {
      heroOpacity: correct < wrong ? 0.5 : 1,
      monsterOpacity: correct > wrong ? 0.5 : 1,
    };
  }, [store.questSession]);

  return {
    generatedText,
    currentDrill,
    isCorrect,
    battleImages,
    heroOpacity,
    monsterOpacity,
  };
}
