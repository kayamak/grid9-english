"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NineKeyPanel } from '@/features/practice/components/NineKeyPanel';
import { VerbTypeSelector } from '@/features/practice/components/VerbTypeSelector';
import { FiveSentencePatternSelector } from '@/features/practice/components/FiveSentencePatternSelector';
import { VerbSelector } from '@/features/practice/components/VerbSelector';
import { ObjectSelector } from '@/features/practice/components/ObjectSelector';
import { NounDeterminerSelector } from '@/features/practice/components/NounDeterminerSelector';
import { ComplementSelector } from '@/features/practice/components/ComplementSelector';
import { GeneratePatternUseCase } from '@/features/practice/actions/GeneratePatternUseCase';
import { getSentenceDrills, getDrillQuestQuestions } from '@/features/practice/actions/drills';
import { Timer, Trophy, XCircle, PartyPopper, Beer } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  SentencePattern,
  SentenceType,
  Subject,
  Tense,
  VerbType,
  Verb,
  FiveSentencePattern,
  Object,
  NumberForm,
  BeComplement,
  Word,
} from '@/domain/practice/types';
import { ApiWordRepository } from '@/infrastructure/repositories/ApiWordRepository';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PracticeContent() {
  const searchParams = useSearchParams();
  const isQuestMode = searchParams.get('mode') === 'quest';
  const initialMode = searchParams.get('mode') === 'drill' || isQuestMode;
  const selectedPattern = searchParams.get('pattern') || undefined;
  const initialDrillIndex = parseInt(searchParams.get('drill') || '1') - 1;
  const isAdmin = searchParams.get('role') === 'ADMIN';

  const [currentLevel, setCurrentLevel] = useState(() => {
    if (typeof document === 'undefined') return 1;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; playerLevel=`);
    if (parts.length === 2) {
      const val = parts.pop()?.split(';').shift();
      return val ? parseInt(val) : 1;
    }
    return 1;
  });
  const [correctCountInLevel, setCorrectCountInLevel] = useState(0);

  // Cookie helper
  const setCookie = useCallback((name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}${expires}; path=/`;
  }, []);

  // Sync level to cookie whenever it changes
  useEffect(() => {
    setCookie('playerLevel', currentLevel.toString());
  }, [currentLevel, setCookie]);

  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  // const [isGameOver, setIsGameOver] = useState(false);
  // const [isLevelCleared, setIsLevelCleared] = useState(false);
  // const [isAllCleared, setIsAllCleared] = useState(false);
  const [questStatus, setQuestStatus] = useState<'playing' | 'result' | 'failed' | 'all-cleared'>('playing');
  const [questResults, setQuestResults] = useState<('correct' | 'wrong' | null)[]>(new Array(10).fill(null));

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

  const [nounWords, setNounWords] = useState<Word[]>([]);
  const [verbWords, setVerbWords] = useState<Word[]>([]);
  const [adjectiveWords, setAdjectiveWords] = useState<Word[]>([]);
  const [adverbWords, setAdverbWords] = useState<Word[]>([]);
  const [isLoadingNouns, setIsLoadingNouns] = useState(true);
  interface Drill {
    id: string;
    english: string;
    japanese: string;
    sentencePattern: string;
    sortOrder: number;
  }
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isDrillMode] = useState(initialMode);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(Math.max(0, initialDrillIndex));
  const [activeTab, setActiveTab] = useState<VerbType | 'admin'>(state.verbType);

  // Fetch noun words from Repository
  useEffect(() => {
    const fetchWords = async () => {
      const repository = new ApiWordRepository();
      try {
        const nouns = await repository.getNounWords();
        setNounWords(nouns);

        const verbs = await repository.getVerbWords();
        setVerbWords(verbs);

        const adjectives = await repository.getAdjectiveWords();
        setAdjectiveWords(adjectives);

        const adverbs = await repository.getAdverbWords();
        setAdverbWords(adverbs);
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        setIsLoadingNouns(false);
      }
    };

    fetchWords();

    const fetchDrills = async () => {
      if (isQuestMode) {
        const data = await getDrillQuestQuestions(currentLevel);
        setDrills(data);
        setCurrentDrillIndex(0);
        setCorrectCountInLevel(0);
        // Set time limit based on level: 30s base, L4+ has formula, L10 is fixed 10s
        const timeLimit = currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2)));
        setTimeLeft(timeLimit);
        setIsTimerActive(true);
        setQuestStatus('playing');
        setQuestResults(new Array(10).fill(null));
      } else {
        const data = await getSentenceDrills(selectedPattern);
        setDrills(data);
      }
    };
    fetchDrills();
  }, [selectedPattern, isQuestMode, currentLevel]);

  // Timer logic for Quest Mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuestMode && isTimerActive && timeLeft > 0 && questStatus === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && questStatus === 'playing') {
      // Time up! Mark as finished but not necessarily fail yet, just this question is wrong
      // Actually, we should probably just stop the timer and let the user skip
      setIsTimerActive(false);
      setQuestResults(prev => {
        const next = [...prev];
        if (!next[currentDrillIndex]) {
          next[currentDrillIndex] = 'wrong';
        }
        return next;
      });
    }
    return () => clearInterval(timer);
  }, [isQuestMode, isTimerActive, timeLeft, questStatus, currentDrillIndex]);

  const handleVerbTypeChange = useCallback((verbType: VerbType) => {
    // When switching types, reset verb and pattern to defaults
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
  }, []);

  const handleTabChange = useCallback((tab: VerbType | 'admin') => {
    if (tab === 'admin') {
      setActiveTab('admin');
    } else {
      handleVerbTypeChange(tab);
    }
  }, [handleVerbTypeChange]);

  const handleVerbChange = useCallback((verb: Verb) => {
    setState((prev) => SentencePattern.create({ ...prev.toObject(), verb }));
  }, []);

  const handleSentenceTypeChange = useCallback((sentenceType: SentenceType) => {
    setState((prev) => prev.toggleSentenceType(sentenceType));
  }, []);

  const handleSubjectChange = useCallback((subject: Subject) => {
    setState((prev) => {
      // Check if clicking same person to rotate (Invariant 1)
      if (subject === prev.subject) {
        return prev.rotateSubject();
      } else {
        return SentencePattern.create({ ...prev.toObject(), subject });
      }
    });
  }, []);

  const handleTenseChange = useCallback((tense: Tense) => {
    setState((prev) => prev.changeTense(tense));
  }, []);

  const handleFiveSentencePatternChange = useCallback((fiveSentencePattern: FiveSentencePattern) => {
    setState((prev) => SentencePattern.create({
       ...prev.toObject(),
       fiveSentencePattern,
       verb: 'do'
    }));
  }, []);

  const handleObjectChange = useCallback((object: Object) => {
    setState((prev) => SentencePattern.create({ ...prev.toObject(), object }));
  }, []);

  const handleNumberFormChange = useCallback((numberForm: NumberForm) => {
    setState((prev) => SentencePattern.create({ ...prev.toObject(), numberForm }));
  }, []);

  const handleBeComplementChange = useCallback((beComplement: BeComplement) => {
    setState((prev) => SentencePattern.create({ ...prev.toObject(), beComplement }));
  }, []);

  const [sessionId, setSessionId] = useState('');
  const [showVictoryEffect, setShowVictoryEffect] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);
  const [monsterState, setMonsterState] = useState<'idle' | 'hit' | 'defeated'>('idle');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  const generatedText = useMemo(() => new GeneratePatternUseCase().execute(state, nounWords, verbWords), [state, nounWords, verbWords]);

  const currentDrill = drills[currentDrillIndex];
  const isCorrect = useMemo(() => isDrillMode && currentDrill && generatedText.toLowerCase().replace(/[.,?!]/g, '') === currentDrill.english.toLowerCase().replace(/[.,?!]/g, ''), [isDrillMode, currentDrill, generatedText]);

  const [hasMarkedCorrect, setHasMarkedCorrect] = useState(false);

  const triggerVictoryEffect = useCallback(() => {
    // 1. Screen Flash
    setIsScreenFlashing(true);
    setTimeout(() => setIsScreenFlashing(false), 150);

    // 2. Screen Shake
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 500);

    // 3. Monster State
    setMonsterState('hit');
    setTimeout(() => {
      setMonsterState('defeated');
    }, 300);

    setShowVictoryEffect(true);
    // Effects last for a bit then reset for next
  }, []);

  useEffect(() => {
    if (isCorrect && !hasMarkedCorrect && isQuestMode && questStatus === 'playing') {
      setCorrectCountInLevel(prev => prev + 1);
      setQuestResults(prev => {
        const next = [...prev];
        next[currentDrillIndex] = 'correct';
        return next;
      });
      setHasMarkedCorrect(true);
      setIsTimerActive(false);

      // Trigger Flashy RPG Victory Effect
      triggerVictoryEffect();
    }
  }, [isCorrect, hasMarkedCorrect, isQuestMode, questStatus, currentDrillIndex, triggerVictoryEffect]);

  useEffect(() => {
    if (isCorrect && !isQuestMode && !hasMarkedCorrect) {
      setHasMarkedCorrect(true);
      triggerVictoryEffect();
    }
  }, [isCorrect, isDrillMode, isQuestMode, hasMarkedCorrect, triggerVictoryEffect]);

  useEffect(() => {
    setHasMarkedCorrect(false);
    setMonsterState('idle');
    setShowVictoryEffect(false);
  }, [currentDrillIndex, state.subject, state.verb, state.object]);

  // Image mappings for the 3 battle areas
  const battleImages = useMemo(() => {
    // 1. Subject Area
    let subjectImg = '/assets/heroes/hero.png';
    if (state.subject === 'second' || state.subject === 'second_p') subjectImg = '/assets/heroes/mage.png';
    else if (state.subject === 'third_s') subjectImg = '/assets/heroes/warrior.png';

    // 2. Verb Area (Monster)
    let monsterImg = '/assets/monsters/slime.png';
    if (state.fiveSentencePattern === 'SVO' || state.verb === 'have' || state.verb === 'see' || state.verb === 'get') {
      monsterImg = '/assets/monsters/dragon.png';
    }

    // 3. Object Area (Item)
    let itemImg = null;
    if (state.fiveSentencePattern === 'SVO') {
      if (state.object === 'herb') itemImg = '/assets/items/herb.png';
      else if (state.object === 'something' || state.object === 'potion') itemImg = '/assets/items/herb.png'; // Placeholder for potion
      else itemImg = '/assets/monsters/slime.png'; // Default item placeholder
    }

    return { subjectImg, monsterImg, itemImg };
  }, [state.subject, state.verb, state.object, state.fiveSentencePattern]);

  const handleNextDrill = () => {
    if (isQuestMode) {
      if (currentDrillIndex + 1 >= drills.length) {
        // Evaluate level result
        if (correctCountInLevel >= 8) {
          if (currentLevel === 10) {
            setQuestStatus('all-cleared');
          } else {
            setQuestStatus('result');
          }
        } else {
          setQuestStatus('failed');
        }
        setIsTimerActive(false);
      } else {
        setCurrentDrillIndex((prev) => prev + 1);
        const timeLimit = currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2)));
        setTimeLeft(timeLimit);
        setIsTimerActive(true);
      }
    } else {
      setCurrentDrillIndex((prev) => (prev + 1) % drills.length);
    }
  };

  const handleLevelUp = () => {
    setCurrentLevel(prev => prev + 1);
  };

  const handleRetryLevel = () => {
    // Just re-trigger effect by currentLevel or same state
    const fetchAgain = async () => {
      const data = await getDrillQuestQuestions(currentLevel);
      setDrills(data);
      setCurrentDrillIndex(0);
      setCorrectCountInLevel(0);
      const timeLimit = currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2)));
      setTimeLeft(timeLimit);
      setIsTimerActive(true);
      setQuestStatus('playing');
      setQuestResults(new Array(10).fill(null));
    };
    fetchAgain();
  };

  // const toggleDrillMode = () => {
  //   setIsDrillMode(!isDrillMode);
  // };

  return (
    <main className={`min-h-screen bg-[#000840] flex flex-col items-center p-4 md:p-8 font-dot text-white transition-all duration-75 ${isScreenShaking ? 'translate-x-2 -translate-y-1 rotate-1' : ''}`}>
      {/* Screen Flash Overlay */}
      {isScreenFlashing && (
        <div className="fixed inset-0 bg-white z-[1000] opacity-80 pointer-events-none" />
      )}

      {/* Victory Particles / Text Effect */}
      {showVictoryEffect && (
        <div className="fixed inset-0 z-[900] pointer-events-none flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl text-yellow-400 font-bold italic drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
          >
            SMASH!
          </motion.div>
        </div>
      )}

      <div className="w-full max-w-4xl relative">
        <header className="mb-8 md:mb-12 flex justify-between items-center dq-window-fancy">
          <Link href="/" className="dq-button !py-1 !px-4 text-sm">
            &larr; もどる
          </Link>
          <h1 className="text-2xl md:text-3xl font-normal text-white">
            {isQuestMode ? 'ドリルクエスト' : 'ぶんしょうトレーニング'}
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </header>

        {isDrillMode && !isQuestMode && currentDrill && (
          <div className="mb-6 md:mb-8 w-full flex flex-col items-center">
            {/* Monster Battle Area for Drill Mode */}
            <div className="relative w-full max-w-2xl h-48 md:h-64 mb-4 flex justify-around items-end px-4 gap-2">
              {/* Subject Area (Hero) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end">
                <motion.div
                  key={`hero-${state.subject}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="z-10"
                >
                  <Image 
                    src={battleImages.subjectImg} 
                    alt="Hero" 
                    width={150}
                    height={150}
                    className={`w-24 h-24 md:w-36 md:h-36 object-contain pixelated mix-blend-multiply ${
                      state.subject === 'first_s' || state.subject === 'first_p' || state.subject === 'second' || state.subject === 'second_p' ? 'scale-x-[-1]' : ''
                    }`}
                  />
                </motion.div>
                <div className="w-20 h-3 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
                <div className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Subject</div>
              </div>

              {/* Verb Area (Monster) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end">
                <motion.div
                  key={`monster-${currentDrillIndex}`}
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ 
                    y: monsterState === 'hit' ? [0, -20, 0] : 0,
                    opacity: monsterState === 'defeated' ? 0 : 1,
                    scale: monsterState === 'hit' ? 1.1 : 1,
                    filter: monsterState === 'hit' ? 'brightness(2) contrast(2)' : 'brightness(1) contrast(1)',
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 0
                  }}
                  transition={{ duration: monsterState === 'hit' ? 0.2 : 0.5 }}
                  className="relative z-10"
                >
                  <Image 
                    src={battleImages.monsterImg} 
                    alt="Monster" 
                    width={180}
                    height={180}
                    className="w-28 h-28 md:w-44 md:h-44 object-contain pixelated mix-blend-multiply"
                  />
                  {showVictoryEffect && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="bg-white text-black px-4 py-1 rotate-[-5deg] font-bold text-xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        SMASH!
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                <div className="w-24 h-3 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
                <div className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Verb</div>
              </div>

              {/* Object Area (Item) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px]">
                {battleImages.itemImg && (
                  <motion.div
                    key={`item-${state.object}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="z-10"
                  >
                    <Image 
                      src={battleImages.itemImg} 
                      alt="Item" 
                      width={120}
                      height={120}
                      className="w-20 h-20 md:w-28 md:h-28 object-contain pixelated mix-blend-multiply"
                    />
                  </motion.div>
                )}
                <div className="w-16 h-2 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
                <div className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Object</div>
              </div>
            </div>

            <div className="dq-window w-full max-w-2xl flex flex-col items-center gap-4 relative">
              {showVictoryEffect && (
                <div className="absolute inset-x-0 -top-12 flex justify-center z-50">
                   <div className="dq-window bg-black border-yellow-400 py-1 px-6 animate-bounce">
                      <p className="text-yellow-400 text-lg">かいしんの　いちげき！</p>
                   </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="dq-window bg-black px-3 py-1 text-white font-normal text-xl">
                    Lv{currentLevel}
                  </div>
                  <p className="text-sm text-yellow-200">じょうほう: {currentDrillIndex + 1} / {drills.length}</p>
                </div>
                {selectedPattern && (
                  <span className="text-yellow-400 text-sm">
                    [{selectedPattern}]
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center border-t-2 border-white/20 pt-4 w-full">
                <h2 className="text-2xl md:text-3xl text-center px-4 text-white">
                  {currentDrill.english}
                </h2>
                <p className="text-lg text-white/80 text-center mt-2 px-4 italic">
                  {currentDrill.japanese}
                </p>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                   onClick={handleNextDrill}
                   className="dq-button text-sm"
                >
                  にげる (Skip)
                </button>
              </div>
            </div>
          </div>
        )}

        {isQuestMode && currentDrill && questStatus === 'playing' && (
          <div className="mb-8 w-full flex flex-col items-center">
            {/* Monster Battle Area for Quest Mode */}
            <div className="relative w-full max-w-2xl h-48 md:h-64 mb-4 flex justify-around items-end px-4 gap-2">
              {/* Subject Area (Hero) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end">
                <motion.div
                  key={`hero-q-${state.subject}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="z-10"
                >
                  <Image 
                    src={battleImages.subjectImg} 
                    alt="Hero" 
                    width={150}
                    height={150}
                    className={`w-24 h-24 md:w-36 md:h-36 object-contain pixelated mix-blend-multiply ${
                      state.subject === 'first_s' || state.subject === 'first_p' || state.subject === 'second' || state.subject === 'second_p' ? 'scale-x-[-1]' : ''
                    }`}
                  />
                </motion.div>
                <div className="w-20 h-3 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
              </div>

              {/* Verb Area (Monster) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end">
                <motion.div
                  key={`monster-q-${currentDrillIndex}`}
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ 
                    y: monsterState === 'hit' ? [0, -20, 0] : 0,
                    opacity: monsterState === 'defeated' ? 0 : 1,
                    scale: monsterState === 'hit' ? 1.1 : 1,
                    filter: monsterState === 'hit' ? 'brightness(2) contrast(2)' : 'brightness(1) contrast(1)',
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 0
                  }}
                  transition={{ duration: monsterState === 'hit' ? 0.2 : 0.5 }}
                  className="relative z-10"
                >
                  <Image 
                    src={battleImages.monsterImg} 
                    alt="Monster" 
                    width={180}
                    height={180}
                    className="w-28 h-28 md:w-44 md:h-44 object-contain pixelated mix-blend-multiply"
                  />
                  {showVictoryEffect && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="bg-white text-black px-4 py-1 rotate-[-5deg] font-bold text-xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        SMASH!
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                <div className="w-24 h-3 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
              </div>

              {/* Object Area (Item) */}
              <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px]">
                {battleImages.itemImg && (
                  <motion.div
                    key={`item-q-${state.object}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="z-10"
                  >
                    <Image 
                      src={battleImages.itemImg} 
                      alt="Item" 
                      width={120}
                      height={120}
                      className="w-20 h-20 md:w-28 md:h-28 object-contain pixelated mix-blend-multiply"
                    />
                  </motion.div>
                )}
                <div className="w-16 h-2 bg-black/40 blur-md rounded-[100%] absolute bottom-0"></div>
              </div>
            </div>

            <div className="dq-window w-full max-w-2xl flex flex-col items-center gap-6 overflow-hidden relative">
              {/* Timer Bar */}
              <div className="absolute top-0 left-0 h-2 bg-yellow-400 transition-all duration-1000" style={{ width: `${(timeLeft / (currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : 30 - currentLevel * 2))) * 100}%` }}></div>
              
              <div className="w-full flex justify-between items-center px-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="dq-window bg-black px-3 py-1 text-white font-normal text-xl">
                    Lv{currentLevel}
                  </div>
                  <div>
                    <p className="text-xs text-white/60">しんちょく</p>
                    <p className="text-sm">{currentDrillIndex + 1} / {drills.length}</p>
                  </div>
                </div>

                <div className={`flex flex-col items-end ${timeLeft <= 5 ? 'animate-pulse text-red-500' : 'text-white'}`}>
                  <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-400'}`} />
                    <span className="text-2xl font-normal tabular-nums">{timeLeft}びょう</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center py-6 bg-black/40 w-full border-y-2 border-white/20 relative">
                {showVictoryEffect && (
                  <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0"></div>
                )}
                <p className="text-sm text-white/60 mb-2 z-10">えいごに　なおせ！</p>
                <h2 className="text-2xl md:text-3xl font-normal text-center px-4 md:px-8 z-10">
                  {currentDrill.japanese}
                </h2>
                {(isCorrect || timeLeft === 0) && (
                   <div className="mt-4 flex flex-col items-center z-10 gap-2">
                     <p className="text-xl text-yellow-400 animate-in fade-in slide-in-from-top-4 duration-500">
                       {currentDrill.english}
                     </p>
                     {isCorrect && (
                       <p className="text-sm text-green-400 font-bold animate-bounce mt-2 bg-black/60 px-4 py-1 border border-green-400">
                         モンスターを　たおした！
                       </p>
                     )}
                   </div>
                )}
              </div>

              <div className="w-full flex justify-between items-center px-4">
                 <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                       {[...Array(10)].map((_, i) => (
                         <div 
                           key={i} 
                           className={`w-3 h-3 border-2 ${
                             questResults[i] === 'correct' 
                               ? 'bg-green-500 border-white' 
                               : questResults[i] === 'wrong' 
                                 ? 'bg-red-500 border-white' 
                                 : (i === currentDrillIndex ? 'bg-yellow-400 border-white animate-pulse' : 'bg-transparent border-white/30')
                           }`}
                         />
                       ))}
                    </div>
                    <span className="text-xs text-white/60">{correctCountInLevel} / 10 せいかい</span>
                 </div>

                 {(isCorrect || timeLeft === 0) && (
                   <button 
                      onClick={handleNextDrill}
                      className="dq-button"
                   >
                     {currentDrillIndex + 1 === drills.length ? 'けっかへ' : 'つぎへ'}
                   </button>
                 )}
              </div>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'result' && (
          <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
            <div className="dq-window p-10 flex flex-col items-center gap-6 text-center max-w-md w-full">
               <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
               <div>
                 <h2 className="text-4xl font-normal text-white mb-2">レベルアップ！</h2>
                 <p className="text-white/60">みごとだ！　わかき　せんしよ。</p>
               </div>
               
               <div className="flex gap-8 my-4">
                  <div>
                    <p className="text-4xl font-normal">{correctCountInLevel}/10</p>
                    <p className="text-xs text-white/40 uppercase">せいかいすう</p>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div>
                    <p className="text-4xl font-normal text-yellow-400">Lv {currentLevel + 1}</p>
                    <p className="text-xs text-white/40 uppercase">つぎのしれん</p>
                  </div>
               </div>

               <button 
                 onClick={handleLevelUp}
                 className="dq-button w-full py-4 text-xl"
               >
                 Lv {currentLevel + 1} に　すすむ
               </button>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'failed' && (
          <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
            <div className="dq-window p-10 border-red-500 flex flex-col items-center gap-6 text-center max-w-md w-full">
               <XCircle className="w-24 h-24 text-red-500" />
               <div>
                 <h2 className="text-4xl font-normal text-white mb-2">しっぱい！</h2>
                 <p className="text-white/60">８もんいじょう　せいかい　しなければならない。</p>
               </div>
               
               <div className="bg-red-900/20 p-6 border-2 border-red-500/20 w-full">
                  <p className="text-5xl font-normal text-red-500">{correctCountInLevel}/10</p>
                  <p className="text-sm text-red-400 mt-2">きみの　せいせき</p>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full">
                 <button 
                   onClick={handleRetryLevel}
                   className="dq-button py-2"
                 >
                   さいちょうせん
                 </button>
                 <Link href="/" className="w-full">
                    <button className="dq-button w-full py-2 text-white/40 border-white/20">あきらめる</button>
                 </Link>
               </div>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'all-cleared' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 font-dot">
            {/* Celebration Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    top: -20, 
                    left: `${Math.random() * 100}%`,
                    rotate: 0,
                    scale: 0.5 + Math.random()
                   }}
                  animate={{ 
                    top: '120%', 
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 4, 
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5
                  }}
                  className="absolute"
                >
                  {i % 3 === 0 ? (
                    <PartyPopper className="text-yellow-400 w-8 h-8 opacity-40 shadow-xl" />
                  ) : i % 3 === 1 ? (
                    <Beer className="text-yellow-200 w-10 h-10 opacity-30" />
                  ) : (
                    <div className="w-4 h-4 bg-white opacity-40" />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="dq-window p-12 flex flex-col items-center gap-8 text-center max-w-lg w-full text-white"
            >
               <div className="relative flex items-center justify-center">
                 <motion.div
                   animate={{ 
                     rotate: [0, -10, 10, -10, 10, 0],
                     scale: [1, 1.1, 1, 1.1, 1]
                   }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 >
                   <Trophy className="w-32 h-32 text-yellow-400" />
                 </motion.div>
                 <motion.div 
                   className="absolute -top-4 -right-4 dq-window bg-black px-2 py-1 text-white font-normal"
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 0.5 }}
                 >
                   10
                 </motion.div>
               </div>
               
               <div className="z-10">
                 <motion.h2 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="text-5xl font-normal text-yellow-400 animate-pulse"
                 >
                   グランドマスター
                 </motion.h2>
                 <motion.p 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="text-white/60 text-lg leading-relaxed"
                 >
                   すべてを　せいした！<br/>
                   あなたは　しんの　えいごマスターだ。
                 </motion.p>
               </div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="flex flex-col items-center gap-4 py-6 border-y-2 border-white/20 w-full"
               >
                 <div className="flex items-center gap-4">
                    <Beer className="w-12 h-12 text-yellow-400" />
                    <span className="text-3xl font-normal tracking-widest text-yellow-200">かんぱーい！</span>
                    <Beer className="w-12 h-12 text-yellow-400 scale-x-[-1]" />
                 </div>
               </motion.div>

               <Link href="/" className="w-full z-10">
                 <button className="dq-button w-full py-4 text-xl">
                   でんせつとして　きかんする
                 </button>
               </Link>
            </motion.div>
          </div>
        )}

        {/* The Notebook Assembly */}
        <div className="flex flex-col items-center">
            
            {/* 1. Tabs Area */}
            <div className="w-full max-w-2xl px-4 md:px-8 flex justify-start">
               <VerbTypeSelector
                 activeTab={activeTab}
                 onChange={handleTabChange}
                 isAdmin={isAdmin}
               />
            </div>

            {/* 2. DQ Window Container */}
            <section className="dq-window-fancy w-full max-w-3xl p-4 md:p-8 flex flex-col items-center min-h-[500px]">
                
                {activeTab === 'admin' ? (
                  <div className="w-full max-w-xl flex flex-col gap-8 py-8 animate-in fade-in duration-500">
                    <h3 className="text-2xl text-yellow-400 border-b-2 border-yellow-400 pb-2 mb-4">デバッグ管理</h3>
                    
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-white/60 text-sm">現在のレベル</span>
                          <span className="text-4xl font-normal text-white">Lv {currentLevel}</span>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setCurrentLevel(prev => Math.max(1, prev - 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => setCurrentLevel(prev => Math.min(10, prev + 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-white/60 text-sm">現在の正解数</span>
                          <span className="text-4xl font-normal text-white">{correctCountInLevel} / 10</span>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setCorrectCountInLevel(prev => Math.max(0, prev - 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => setCorrectCountInLevel(prev => Math.min(10, prev + 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 text-center text-white/40 text-sm">
                        <p>※レベルは自動的にクッキーに保存されます。</p>
                        <p>※正解数を変更するとクエストモードの判定に影響します。</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                  <div className="w-full max-w-xl">
                      <NineKeyPanel
                          sentenceType={state.sentenceType}
                          subject={state.subject}
                          tense={state.tense}
                          onSentenceTypeChange={handleSentenceTypeChange}
                          onSubjectChange={handleSubjectChange}
                          onTenseChange={handleTenseChange}
                      />
                  </div>

                {/* Verb and Sentence Pattern Selector Dropdowns */}
                {(state.verbType === 'do' || state.verbType === 'be') && (
                  <div className="mt-8 mb-2 w-full max-w-xl flex flex-col gap-4 relative z-20">
                    <div className="flex flex-col md:flex-row gap-4">
                      <FiveSentencePatternSelector
                        selectedPattern={state.fiveSentencePattern || (state.verbType === 'do' ? 'SVO' : 'SV')}
                        onChange={handleFiveSentencePatternChange}
                        verbType={state.verbType}
                      />
                      <div className="flex-1">
                        <VerbSelector
                          verbType={state.verbType}
                          selectedVerb={state.verb}
                          onChange={handleVerbChange}
                          fiveSentencePattern={state.fiveSentencePattern}
                          disabled={state.verbType === 'be'}
                        />
                      </div>
                    </div>
                    {state.verbType === 'do' && state.fiveSentencePattern === 'SVO' && (
                      <ObjectSelector
                        selectedObject={state.object || 'something'}
                        onChange={handleObjectChange}
                        numberForm={state.numberForm || 'a'}
                        nounWords={nounWords}
                        disabled={isLoadingNouns}
                      >
                        <NounDeterminerSelector
                          selectedNumberForm={state.numberForm || 'a'}
                          onChange={handleNumberFormChange}
                        />
                      </ObjectSelector>
                    )}
                    {state.verbType === 'be' && (
                        state.fiveSentencePattern === 'SVC' ? (
                          <ComplementSelector
                            selectedComplement={state.beComplement || 'warrior'}
                            onChange={handleBeComplementChange}
                            pattern={state.fiveSentencePattern || 'SV'}
                            numberForm={state.numberForm || 'a'}
                            nounWords={nounWords}
                            adjectiveWords={adjectiveWords}
                            adverbWords={adverbWords}
                            disabled={isLoadingNouns}
                          >
                            <NounDeterminerSelector
                              selectedNumberForm={state.numberForm || 'a'}
                              onChange={handleNumberFormChange}
                              isAdjective={true}
                            />
                          </ComplementSelector>
                        ) : (
                          <ComplementSelector
                            selectedComplement={state.beComplement || 'here'}
                            onChange={handleBeComplementChange}
                            pattern={state.fiveSentencePattern || 'SV'}
                            nounWords={nounWords}
                            adjectiveWords={adjectiveWords}
                            adverbWords={adverbWords}
                            disabled={isLoadingNouns}
                          />
                        )
                    )}
                  </div>
                )}

                <div className="mt-12 w-full max-w-lg relative">
                    {/* DQ style result box */}
                    <div className={`dq-window transition-colors duration-500 p-4 text-center ${isCorrect ? 'border-yellow-400 bg-black/80' : 'border-white bg-black'}`}>
                        <p className={`text-sm uppercase tracking-widest mb-1 ${isCorrect ? 'text-yellow-400' : (isQuestMode && timeLeft === 0 ? 'text-red-500' : 'text-white/40')}`}>
                          {isCorrect ? '★ せいかい！ ★' : (isQuestMode && timeLeft === 0 ? '⏰ じかんぎれ！ ⏰' : 'けっか')}
                        </p>
                        <p className={`text-3xl md:text-5xl font-normal leading-tight transition-all duration-300 ${isCorrect ? 'text-white scale-105' : (isQuestMode && timeLeft === 0 ? 'text-red-500 opacity-50' : 'text-white')}`}>
                        {generatedText}
                        </p>
                    </div>

                    {isCorrect && !isQuestMode && (
                      <div className="mt-8 flex justify-center animate-bounce">
                        <button 
                          onClick={handleNextDrill}
                          className="dq-button text-xl px-12 py-4 shadow-xl"
                        >
                          つぎの　しれんへ
                        </button>
                      </div>
                    )}

                    {isQuestMode && (isCorrect || timeLeft === 0) && questStatus === 'playing' && (
                       <div className="mt-8 flex justify-center animate-bounce">
                         <button 
                           onClick={handleNextDrill}
                           className={`dq-button text-xl px-12 py-4 shadow-xl ${isCorrect ? 'border-yellow-400' : 'border-white'}`}
                         >
                           {currentDrillIndex + 1 === drills.length ? 'クエストしゅうりょう' : 'つぎへ'}
                         </button>
                       </div>
                    )}
                </div>
                </>
                )}
            </section>
        </div>
        
        <div className="mt-12 text-center opacity-30 text-xs font-mono">
           SESSION_ID: {sessionId}
        </div>
      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div>Loading Practice...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
