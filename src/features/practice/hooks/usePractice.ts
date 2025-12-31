import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestSession, QuestStatus, AnswerResult } from '@/domain/practice/entities/QuestSession';
import { SentenceDrill } from '@/domain/practice/entities/SentenceDrill';
import { SentencePattern, Word, VerbType, SentenceType, Subject, Tense, FiveSentencePattern, Verb, Object as ObjectType, NumberForm, BeComplement, WordProps } from '@/domain/practice/types';
import { getNounWords, getVerbWords, getAdjectiveWords, getAdverbWords } from '@/features/practice/actions/words';
import { getSentenceDrills, getDrillQuestQuestions } from '@/features/practice/actions/drills';
import { GeneratePatternUseCase } from '@/features/practice/actions/GeneratePatternUseCase';

export function usePractice() {
  const searchParams = useSearchParams();
  const isQuestMode = searchParams.get('mode') === 'quest';
  const selectedPattern = searchParams.get('pattern') || undefined;
  const initialDrillIndex = parseInt(searchParams.get('drill') || '1') - 1;
  const isAdmin = searchParams.get('role') === 'ADMIN';

  // Level Management
  const [currentLevel, setCurrentLevel] = useState(() => {
    if (typeof document === 'undefined') return 1;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; playerLevel=`);
    if (parts.length === 2) {
      const val = parts.pop()?.split('').shift();
      return val ? parseInt(val) : 1;
    }
    return 1;
  });

  const setCookie = useCallback((name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}${expires}; path=/`;
  }, []);

  useEffect(() => {
    setCookie('playerLevel', currentLevel.toString());
  }, [currentLevel, setCookie]);

  // UI States
  const [heroAction, setHeroAction] = useState<'idle' | 'run-away' | 'defeated' | 'attack'>('idle');
  const [monsterState, setMonsterState] = useState<'idle' | 'hit' | 'defeated' | 'damaged'>('idle');
  const [showVictoryEffect, setShowVictoryEffect] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);

  // Domain State: Sentence Pattern
  const [state, setState] = useState<SentencePattern>(() => SentencePattern.create({
    verbType: 'do',
    verb: 'do',
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
    fiveSentencePattern: 'SV',
    object: 'something',
    numberForm: 'none',
    beComplement: 'here',
  }));

  const [activeTab, setActiveTab] = useState<VerbType | 'admin'>(state.verbType);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  // Domain State: Quest Session
  const [questSession, setQuestSession] = useState<QuestSession | null>(null);
  
  // Data States
  const [words, setWords] = useState<{
    nouns: Word[];
    verbs: Word[];
    adjectives: Word[];
    adverbs: Word[];
  }>({ nouns: [], verbs: [], adjectives: [], adverbs: [] });
  const [isLoadingWords, setIsLoadingWords] = useState(true);
  const [drills, setDrills] = useState<any[]>([]);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(Math.max(0, initialDrillIndex));

  // Timer States
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Initialization
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nounsData, verbsData, adjectivesData, adverbsData] = await Promise.all([
          getNounWords(),
          getVerbWords(),
          getAdjectiveWords(),
          getAdverbWords(),
        ]);

        setWords({
          nouns: nounsData.map((w: WordProps) => Word.reconstruct(w)),
          verbs: verbsData.map((w: WordProps) => Word.reconstruct(w)),
          adjectives: adjectivesData.map((w: WordProps) => Word.reconstruct(w)),
          adverbs: adverbsData.map((w: WordProps) => Word.reconstruct(w)),
        });
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setIsLoadingWords(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDrills = async () => {
        if (isQuestMode) {
          const data = await getDrillQuestQuestions(currentLevel);
          const drillEntities = data.map((d: any) => SentenceDrill.reconstruct(d));
          const session = QuestSession.start(currentLevel, drillEntities);
          setQuestSession(session);
          setDrills(data);
          setCurrentDrillIndex(0);
          setTimeLeft(session.getTimeLimit());
          setIsTimerActive(true);
        } else {
          const data = await getSentenceDrills(selectedPattern);
          setDrills(data);
          setQuestSession(null);
        }
    };
    fetchDrills();
  }, [isQuestMode, currentLevel, selectedPattern]);

  // Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isQuestMode && isTimerActive && timeLeft > 0 && questSession?.status === 'playing') {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && questSession?.status === 'playing') {
      setIsTimerActive(false);
      setQuestSession(prev => prev ? prev.submitAnswer(false) : null);
      setHeroAction('defeated');
    }
    return () => clearInterval(timer);
  }, [isQuestMode, isTimerActive, timeLeft, questSession?.status]);

  // Generated Text and Correctness
  const generatedText = useMemo(() => 
    new GeneratePatternUseCase().execute(state, words.nouns, words.verbs), 
    [state, words.nouns, words.verbs]
  );

  const currentDrill = drills[currentDrillIndex];
  const isCorrect = useMemo(() => {
    if (!currentDrill) return false;
    return QuestSession.checkAnswer(generatedText, currentDrill.english);
  }, [currentDrill, generatedText]);

  const [hasMarkedCorrect, setHasMarkedCorrect] = useState(false);

  const triggerVictoryEffect = useCallback(() => {
    setIsScreenFlashing(true);
    setTimeout(() => setIsScreenFlashing(false), 150);
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 500);
    setMonsterState('hit');
    setTimeout(() => setMonsterState('defeated'), 300);
    setShowVictoryEffect(true);
  }, []);

  useEffect(() => {
    if (isCorrect && !hasMarkedCorrect) {
      if (isQuestMode && questSession?.status === 'playing') {
        const updatedSession = questSession.submitAnswer(true);
        setQuestSession(updatedSession);
        setIsTimerActive(false);
        triggerVictoryEffect();
        setHasMarkedCorrect(true);
      } else if (!isQuestMode) {
        triggerVictoryEffect();
        setHasMarkedCorrect(true);
      }
    }
  }, [isCorrect, hasMarkedCorrect, isQuestMode, questSession?.status, triggerVictoryEffect]);

  useEffect(() => {
    setHasMarkedCorrect(false);
    setMonsterState('idle');
    setShowVictoryEffect(false);
  }, [currentDrillIndex, state.subject, state.verb, state.object]);

  // Sequence Animations
  const triggerAttackAnim = useCallback(() => {
    setHeroAction('attack');
    setTimeout(() => {
      setMonsterState('damaged');
      setTimeout(() => setMonsterState('idle'), 300);
    }, 150);
    setTimeout(() => {
      setHeroAction((prev) => (prev === 'attack' ? 'idle' : prev));
    }, 300);
  }, []);

  // Handlers
  const handleNextDrill = async (isEscape?: boolean) => {
    if (isEscape === true) {
      setHeroAction('run-away');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (isQuestMode && questSession) {
      const nextSession = questSession.nextDrill();
      setQuestSession(nextSession);
      if (nextSession.status === 'playing') {
        setCurrentDrillIndex(nextSession.currentIndex);
        setTimeLeft(nextSession.getTimeLimit());
        setIsTimerActive(true);
      }
    } else {
      setCurrentDrillIndex((prev) => (prev + 1) % drills.length);
    }
    setHeroAction('idle');
  };

  const handleRetryLevel = async () => {
    const data = await getDrillQuestQuestions(currentLevel);
    const drillEntities = data.map((d: any) => SentenceDrill.reconstruct(d));
    const session = QuestSession.start(currentLevel, drillEntities);
    setQuestSession(session);
    setDrills(data);
    setCurrentDrillIndex(0);
    setTimeLeft(session.getTimeLimit());
    setIsTimerActive(true);
  };

  const setCorrectCountInLevel = useCallback((update: number | ((prev: number) => number)) => {
    if (!questSession) return;
    const currentCount = questSession.correctCount;
    const nextCount = typeof update === 'function' ? update(currentCount) : update;
    
    // Create new results array with nextCount 'correct' and the rest 'wrong' or null
    const newResults: AnswerResult[] = new Array(questSession.drills.length).fill(null);
    for (let i = 0; i < nextCount; i++) {
        newResults[i] = 'correct';
    }
    setQuestSession(questSession.withResults(newResults));
  }, [questSession]);

  const handleLevelUp = () => setCurrentLevel(prev => prev + 1);

  // Handlers for Pattern Changes
  const handleVerbTypeChange = useCallback((verbType: VerbType) => {
    triggerAttackAnim();
    setActiveTab(verbType);
    setState((prev) => {
      if (verbType === 'be') {
        return SentencePattern.create({
          ...prev.toObject(),
          verbType,
          verb: 'be',
          fiveSentencePattern: 'SV',
          beComplement: 'here',
          numberForm: 'a'
        });
      } else {
        return SentencePattern.create({
          ...prev.toObject(),
          verbType,
          verb: 'do',
          fiveSentencePattern: 'SV'
        });
      }
    });
  }, [triggerAttackAnim]);

  const handleVerbChange = useCallback((verb: Verb) => {
    triggerAttackAnim();
    setState((prev) => SentencePattern.create({ ...prev.toObject(), verb }));
  }, [triggerAttackAnim]);

  const handleSentenceTypeChange = useCallback((sentenceType: SentenceType) => {
    triggerAttackAnim();
    setState((prev) => prev.toggleSentenceType(sentenceType));
  }, [triggerAttackAnim]);

  const handleSubjectChange = useCallback((subject: Subject) => {
    setState((prev) => {
        if (subject === prev.subject) {
          return prev.rotateSubject();
        } else {
          return SentencePattern.create({ ...prev.toObject(), subject });
        }
    });
  }, []);

  const handleTenseChange = useCallback((tense: Tense) => {
    triggerAttackAnim();
    setState((prev) => prev.changeTense(tense));
  }, [triggerAttackAnim]);

  const handleFiveSentencePatternChange = useCallback((fiveSentencePattern: FiveSentencePattern) => {
    triggerAttackAnim();
    setState((prev) => SentencePattern.create({
       ...prev.toObject(),
       fiveSentencePattern,
       verb: 'do'
    }));
  }, [triggerAttackAnim]);

  const handleObjectChange = useCallback((object: ObjectType) => {
    triggerAttackAnim();
    setState((prev) => SentencePattern.create({ ...prev.toObject(), object }));
  }, [triggerAttackAnim]);

  const handleNumberFormChange = useCallback((numberForm: NumberForm) => {
    triggerAttackAnim();
    setState((prev) => SentencePattern.create({ ...prev.toObject(), numberForm }));
  }, [triggerAttackAnim]);

  const handleBeComplementChange = useCallback((beComplement: BeComplement) => {
    triggerAttackAnim();
    setState((prev) => SentencePattern.create({ ...prev.toObject(), beComplement }));
  }, [triggerAttackAnim]);

  const handleTabChange = useCallback((tab: VerbType | 'admin') => {
    if (tab === 'admin') {
      setActiveTab('admin');
    } else {
      handleVerbTypeChange(tab);
    }
  }, [handleVerbTypeChange]);

  const battleImages = useMemo(() => {
    let subjectImg = '/assets/heroes/hero.png';
    if (state.subject === 'second' || state.subject === 'second_p') subjectImg = '/assets/heroes/mage.png';
    else if (state.subject === 'third_s' || state.subject === 'third_p') subjectImg = '/assets/heroes/warrior.png';

    let monsterImg = '/assets/monsters/slime.png';
    let monsterScale = 1.0; 
    if (state.verbType === 'be' && (state.fiveSentencePattern === 'SV' || state.fiveSentencePattern === 'SVC')) {
      monsterImg = '/assets/monsters/bit_golem.png';
      monsterScale = 1.0;
    } else if (state.fiveSentencePattern === 'SV' || state.fiveSentencePattern === 'SVO') {
      monsterImg = '/assets/monsters/void_dragon_v2.png';
      monsterScale = 1.7;
    } else if (state.verb === 'have' || state.verb === 'see' || state.verb === 'get') {
      monsterImg = '/assets/monsters/dragon.png';
      monsterScale = 1.7;
    }

    let itemImg = null;
    if (state.fiveSentencePattern === 'SVO') {
      itemImg = '/assets/monsters/o_slime.png';
    } else if (state.verbType === 'be' && state.fiveSentencePattern === 'SVC') {
      itemImg = '/assets/monsters/crescent_beast.png';
    }

    return { subjectImg, monsterImg, itemImg, monsterScale };
  }, [state.subject, state.verb, state.verbType, state.fiveSentencePattern]);

  const { heroOpacity, monsterOpacity } = useMemo(() => {
    if (!questSession) return { heroOpacity: 1, monsterOpacity: 1 };
    const correct = questSession.results.filter(r => r === 'correct').length;
    const wrong = questSession.results.filter(r => r === 'wrong').length;
    let h = 1;
    let m = 1;
    if (correct < wrong) h = 0.5;
    else if (correct > wrong) m = 0.5;
    return { heroOpacity: h, monsterOpacity: m };
  }, [questSession?.results]);

  return {
    isQuestMode,
    isAdmin,
    currentLevel,
    setCurrentLevel,
    questSession,
    heroAction,
    monsterState,
    showVictoryEffect,
    isScreenShaking,
    isScreenFlashing,
    state,
    words,
    isLoadingWords,
    drills,
    currentDrillIndex,
    timeLeft,
    generatedText,
    isCorrect,
    currentDrill,
    handleNextDrill,
    handleRetryLevel,
    handleLevelUp,
    setCorrectCountInLevel,
    handleVerbTypeChange,
    handleVerbChange,
    handleSentenceTypeChange,
    handleSubjectChange,
    handleTenseChange,
    handleFiveSentencePatternChange,
    handleObjectChange,
    handleNumberFormChange,
    handleBeComplementChange,
    battleImages,
    heroOpacity,
    monsterOpacity,
    activeTab,
    handleTabChange,
    sessionId,
  };
}
