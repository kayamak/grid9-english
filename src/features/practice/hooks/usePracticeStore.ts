import { create } from 'zustand';
import {
  QuestSession,
} from '@/domain/practice/entities/QuestSession';
import {
  SentencePattern,
  WordProps,
  VerbType,
  SentenceType,
  Subject,
  Tense,
  Word,
} from '@/domain/practice/types';

interface PracticeState {
  // Mode & Flags
  isQuestMode: boolean;
  isFreeMode: boolean;
  isOnboardingMode: boolean;
  isAdmin: boolean;

  // Level & Session
  currentLevel: number;
  sessionId: string;
  questSession: QuestSession | null;

  // Data
  words: {
    nouns: Word[];
    verbs: Word[];
    adjectives: Word[];
    adverbs: Word[];
  };
  isLoadingWords: boolean;
  allDrills: {
    id: string;
    sentencePattern: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }[];
  drills: {
    id: string;
    sentencePattern: string;
    english: string;
    japanese: string;
    sortOrder: number;
  }[];
  currentDrillIndex: number;

  // Pattern State
  state: SentencePattern;
  activeTab: VerbType | 'admin';

  // Timer State
  timeLeft: number;
  isTimerActive: boolean;

  // Actions
  setInitialState: (params: {
    isQuestMode: boolean;
    isFreeMode: boolean;
    isOnboardingMode: boolean;
    isAdmin: boolean;
    currentLevel: number;
    allDrills: {
      id: string;
      sentencePattern: string;
      english: string;
      japanese: string;
      sortOrder: number;
    }[];
    initialWords?: {
      nouns: WordProps[];
      verbs: WordProps[];
      adjectives: WordProps[];
      adverbs: WordProps[];
    };
  }) => void;
  
  setCurrentLevel: (level: number) => void;
  setQuestSession: (session: QuestSession | null) => void;
  setCurrentDrillIndex: (index: number | ((prev: number) => number)) => void;
  
  // Pattern Actions
  updatePattern: (update: Partial<ReturnType<SentencePattern['toObject']>>) => void;
  toggleSentenceType: (type: SentenceType) => void;
  rotateSubject: (subject: Subject) => void;
  changeTense: (tense: Tense) => void;
  setActiveTab: (tab: VerbType | 'admin') => void;
  
  // Timer Actions
  setTimeLeft: (update: number | ((prev: number) => number)) => void;
  setIsTimerActive: (update: boolean | ((prev: boolean) => boolean)) => void;
  resetTimer: (seconds: number) => void;
  stopTimer: () => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  isQuestMode: false,
  isFreeMode: false,
  isOnboardingMode: false,
  isAdmin: false,
  currentLevel: 1,
  sessionId: '',
  questSession: null,
  words: { nouns: [], verbs: [], adjectives: [], adverbs: [] },
  isLoadingWords: true,
  allDrills: [],
  drills: [],
  currentDrillIndex: 0,
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
  activeTab: 'do',
  timeLeft: 30,
  isTimerActive: false,

  setInitialState: ({ isQuestMode, isFreeMode, isOnboardingMode, isAdmin, currentLevel, allDrills, initialWords }) => {
    const sessionId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const words = initialWords ? {
      nouns: initialWords.nouns.map(w => Word.reconstruct(w)),
      verbs: initialWords.verbs.map(w => Word.reconstruct(w)),
      adjectives: initialWords.adjectives.map(w => Word.reconstruct(w)),
      adverbs: initialWords.adverbs.map(w => Word.reconstruct(w)),
    } : { nouns: [], verbs: [], adjectives: [], adverbs: [] };

    set({
      isQuestMode,
      isFreeMode,
      isOnboardingMode,
      isAdmin,
      currentLevel,
      sessionId,
      allDrills,
      words,
      isLoadingWords: !initialWords,
    });
  },

  setCurrentLevel: (level) => set({ currentLevel: level }),
  setQuestSession: (session) => set({ questSession: session }),
  setCurrentDrillIndex: (update) => set((state) => ({
    currentDrillIndex: typeof update === 'function' ? update(state.currentDrillIndex) : update
  })),

  updatePattern: (update) => set((state) => ({
    state: SentencePattern.create({ ...state.state.toObject(), ...update })
  })),

  toggleSentenceType: (type) => set((state) => ({
    state: state.state.toggleSentenceType(type)
  })),

  rotateSubject: (subject) => set((state) => {
    if (subject === state.state.subject) {
      return { state: state.state.rotateSubject() };
    }
    return { state: SentencePattern.create({ ...state.state.toObject(), subject }) };
  }),

  changeTense: (tense) => set((state) => ({
    state: state.state.changeTense(tense)
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setTimeLeft: (update) => set((state) => ({
    timeLeft: typeof update === 'function' ? update(state.timeLeft) : update
  })),
  setIsTimerActive: (update) => set((state) => ({
    isTimerActive: typeof update === 'function' ? update(state.isTimerActive) : update
  })),
  resetTimer: (seconds) => set({ timeLeft: seconds, isTimerActive: true }),
  stopTimer: () => set({ isTimerActive: false }),
}));
