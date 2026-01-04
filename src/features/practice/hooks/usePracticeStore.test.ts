import { describe, it, expect, beforeEach } from 'vitest';
import { usePracticeStore } from './usePracticeStore';
import { SentencePattern } from '@/domain/practice/vo/SentencePattern';
import { QuestSession } from '@/domain/practice/entities/QuestSession';

describe('usePracticeStore', () => {
  beforeEach(() => {
    // We cannot easily reset the store state without a reset action if it's not implemented,
    // but we can use setInitialState to reset it to a known state.
    usePracticeStore.setState({
      isQuestMode: false,
      isFreeMode: false,
      isOnboardingMode: false,
      isAdmin: false,
      currentLevel: 1,
      questSession: null,
      drills: [],
      currentDrillIndex: 0,
      timeLeft: 30,
      isTimerActive: false,
      state: SentencePattern.create({
        verbType: 'do',
        verb: 'do',
        sentenceType: 'positive',
        subject: 'first_s',
        tense: 'present',
        fiveSentencePattern: 'SV',
        object: 'something',
        numberForm: 'none',
        beComplement: 'here',
      }),
    });
  });

  it('setInitialStateが正しく動作すること', () => {
    const allDrills = [
      {
        id: '1',
        sentencePattern: 'SV',
        english: 'I run',
        japanese: '走る',
        sortOrder: 1,
      },
    ];
    usePracticeStore.getState().setInitialState({
      isQuestMode: true,
      isFreeMode: false,
      isOnboardingMode: false,
      isAdmin: false,
      currentLevel: 2,
      allDrills,
    });

    const state = usePracticeStore.getState();
    expect(state.isQuestMode).toBe(true);
    expect(state.currentLevel).toBe(2);
    expect(state.allDrills).toEqual(allDrills);
    expect(state.sessionId).toBeTruthy();
  });

  it('updatePatternが正しく動作すること', () => {
    usePracticeStore.getState().updatePattern({ subject: 'third_s' });
    expect(usePracticeStore.getState().state.subject).toBe('third_s');
  });

  it('toggleSentenceTypeが正しく動作すること', () => {
    usePracticeStore.getState().toggleSentenceType('negative');
    expect(usePracticeStore.getState().state.sentenceType).toBe('negative');
  });

  it('rotateSubjectが正しく動作すること', () => {
    const initialSubject = usePracticeStore.getState().state.subject;
    usePracticeStore.getState().rotateSubject(initialSubject);
    // rotateSubject logic in store: if same as current, calls state.rotateSubject()
    expect(usePracticeStore.getState().state.subject).not.toBe(initialSubject);
  });

  it('setTimeLeftが正しく動作すること', () => {
    usePracticeStore.getState().setTimeLeft(25);
    expect(usePracticeStore.getState().timeLeft).toBe(25);

    usePracticeStore.getState().setTimeLeft((prev) => prev - 5);
    expect(usePracticeStore.getState().timeLeft).toBe(20);
  });

  it('resetTimerが正しく動作すること', () => {
    usePracticeStore.getState().resetTimer(15);
    expect(usePracticeStore.getState().timeLeft).toBe(15);
    expect(usePracticeStore.getState().isTimerActive).toBe(true);
  });

  it('stopTimerが正しく動作すること', () => {
    usePracticeStore.getState().stopTimer();
    expect(usePracticeStore.getState().isTimerActive).toBe(false);
  });

  it('setIsTimerActiveが正しく動作すること', () => {
    usePracticeStore.getState().setIsTimerActive(true);
    expect(usePracticeStore.getState().isTimerActive).toBe(true);

    usePracticeStore.getState().setIsTimerActive((prev) => !prev);
    expect(usePracticeStore.getState().isTimerActive).toBe(false);
  });

  it('setCurrentLevelが正しく動作すること', () => {
    usePracticeStore.getState().setCurrentLevel(5);
    expect(usePracticeStore.getState().currentLevel).toBe(5);
  });

  it('setQuestSessionが正しく動作すること', () => {
    const mockSession = { id: 'test' } as unknown as QuestSession;
    usePracticeStore.getState().setQuestSession(mockSession);
    expect(usePracticeStore.getState().questSession).toBe(mockSession);
  });

  it('setCurrentDrillIndexが正しく動作すること', () => {
    usePracticeStore.getState().setCurrentDrillIndex(2);
    expect(usePracticeStore.getState().currentDrillIndex).toBe(2);

    usePracticeStore.getState().setCurrentDrillIndex((prev) => prev + 1);
    expect(usePracticeStore.getState().currentDrillIndex).toBe(3);
  });

  it('changeTenseが正しく動作すること', () => {
    usePracticeStore.getState().changeTense('past');
    expect(usePracticeStore.getState().state.tense).toBe('past');
  });

  it('setActiveTabが正しく動作すること', () => {
    usePracticeStore.getState().setActiveTab('admin');
    expect(usePracticeStore.getState().activeTab).toBe('admin');
  });

  it('rotateSubjectで現在の主語と異なる場合はその主語に設定されること', () => {
    // 初期状態は first_s
    expect(usePracticeStore.getState().state.subject).toBe('first_s');

    usePracticeStore.getState().rotateSubject('second');
    expect(usePracticeStore.getState().state.subject).toBe('second');
  });

  it('setInitialStateでinitialWordsを渡した場合、Wordが正しく再構築されること', () => {
    const initialWords = {
      nouns: [
        {
          id: '1',
          value: 'cat',
          label: '猫',
          type: 'noun' as const,
        },
      ],
      verbs: [
        {
          id: '2',
          value: 'run',
          label: '走る',
          type: 'verb' as const,
        },
      ],
      adjectives: [
        {
          id: '3',
          value: 'happy',
          label: '幸せな',
          type: 'adjective' as const,
        },
      ],
      adverbs: [
        {
          id: '4',
          value: 'quickly',
          label: '素早く',
          type: 'adverb' as const,
        },
      ],
    };

    usePracticeStore.getState().setInitialState({
      isQuestMode: false,
      isFreeMode: true,
      isOnboardingMode: false,
      isAdmin: false,
      currentLevel: 1,
      allDrills: [],
      initialWords,
    });

    const state = usePracticeStore.getState();
    expect(state.words.nouns).toHaveLength(1);
    expect(state.words.verbs).toHaveLength(1);
    expect(state.words.adjectives).toHaveLength(1);
    expect(state.words.adverbs).toHaveLength(1);
    expect(state.words.nouns[0].value).toBe('cat');
    expect(state.words.verbs[0].value).toBe('run');
    expect(state.isLoadingWords).toBe(false);
  });
});
