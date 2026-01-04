import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePracticeDerivedState } from './usePracticeDerivedState';
import { usePracticeStore } from './usePracticeStore';
import { SentencePattern } from '@/domain/practice/vo/SentencePattern';

// Mock usePracticeStore
vi.mock('./usePracticeStore', () => ({
  usePracticeStore: vi.fn(),
}));

describe('usePracticeDerivedState', () => {
  const mockStore = {
    state: SentencePattern.create({
      verbType: 'do',
      verb: 'run',
      subject: 'first_s',
      tense: 'present',
      sentenceType: 'positive',
      fiveSentencePattern: 'SV', // Specify SV to avoid default SVO 'something'
      object: '',
    }),
    words: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
    drills: [
      {
        id: '1',
        english: 'I run.',
        japanese: '私は走る',
        sentencePattern: 'SV',
      },
    ],
    currentDrillIndex: 0,
    questSession: null,
  };

  beforeEach(() => {
    vi.mocked(usePracticeStore).mockReturnValue(
      mockStore as unknown as ReturnType<typeof usePracticeStore>
    );
  });

  it('generatedTextが正しく生成されること', () => {
    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.generatedText).toBe('I run.');
  });

  it('currentDrillが正しく取得されること', () => {
    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.currentDrill).toEqual(mockStore.drills[0]);
  });

  it('isCorrectが正しく判定されること', () => {
    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.isCorrect).toBe(true);
  });

  it('不正解の場合isCorrectがfalseになること', () => {
    const customStore = {
      ...mockStore,
      state: SentencePattern.create({
        ...mockStore.state.toObject(),
        subject: 'second',
      }),
    };
    vi.mocked(usePracticeStore).mockReturnValue(
      customStore as unknown as ReturnType<typeof usePracticeStore>
    );

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.isCorrect).toBe(false); // 'You run' vs 'I run'
  });

  it('battleImagesが状態に応じて変化すること', () => {
    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.subjectImg).toBe(
      '/assets/heroes/hero.png'
    );

    // Warrior (third_s)
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        ...mockStore.state.toObject(),
        subject: 'third_s',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result: result2 } = renderHook(() => usePracticeDerivedState());
    expect(result2.current.battleImages.subjectImg).toBe(
      '/assets/heroes/warrior.png'
    );
  });

  it('heroOpacity/monsterOpacityがクエスト結果に応じて変化すること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      questSession: {
        results: ['wrong', 'wrong'],
      },
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.heroOpacity).toBe(0.5);
    expect(result.current.monsterOpacity).toBe(1);

    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      questSession: {
        results: ['correct', 'correct'],
      },
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result: result2 } = renderHook(() => usePracticeDerivedState());
    expect(result2.current.heroOpacity).toBe(1);
    expect(result2.current.monsterOpacity).toBe(0.5);
  });

  it('battleImages: BE動詞のSV/SVCでbit_golemが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        subject: 'first_s',
        tense: 'present',
        sentenceType: 'positive',
        fiveSentencePattern: 'SV',
        object: '',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.monsterImg).toBe(
      '/assets/monsters/bit_golem.png'
    );
  });

  it('battleImages: BE動詞のSVCでbit_golemとcrescent_beastが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        verbType: 'be',
        verb: 'be',
        subject: 'first_s',
        tense: 'present',
        sentenceType: 'positive',
        fiveSentencePattern: 'SVC',
        beComplement: 'happy',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.monsterImg).toBe(
      '/assets/monsters/bit_golem.png'
    );
    expect(result.current.battleImages.itemImg).toBe(
      '/assets/monsters/crescent_beast.png'
    );
  });

  it('battleImages: DO動詞のSV/SVOでvoid_dragonが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        verbType: 'do',
        verb: 'run',
        subject: 'first_s',
        tense: 'present',
        sentenceType: 'positive',
        fiveSentencePattern: 'SV',
        object: '',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.monsterImg).toBe(
      '/assets/monsters/void_dragon_v2.png'
    );
    expect(result.current.battleImages.monsterScale).toBe(1.7);
  });

  it('battleImages: SVOでo_slimeが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        verbType: 'do',
        verb: 'eat',
        subject: 'first_s',
        tense: 'present',
        sentenceType: 'positive',
        fiveSentencePattern: 'SVO',
        object: 'apple',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.itemImg).toBe(
      '/assets/monsters/o_slime.png'
    );
  });

  it('battleImages: have/see/get動詞でdragonが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        verbType: 'do',
        verb: 'have',
        subject: 'first_s',
        tense: 'present',
        sentenceType: 'positive',
        fiveSentencePattern: 'SVOO',
        object: 'book',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.monsterImg).toBe(
      '/assets/monsters/dragon.png'
    );
    expect(result.current.battleImages.monsterScale).toBe(1.7);
  });

  it('battleImages: second/second_pでmageが表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: SentencePattern.create({
        ...mockStore.state.toObject(),
        subject: 'second_p',
      }),
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { result } = renderHook(() => usePracticeDerivedState());
    expect(result.current.battleImages.subjectImg).toBe(
      '/assets/heroes/mage.png'
    );
  });
});
