"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { GeneratePatternUseCase } from '@/features/practice/actions/GeneratePatternUseCase';
import { getSentenceDrills, getDrillQuestQuestions } from '@/features/practice/actions/drills';
import { Trophy, XCircle, PartyPopper, Beer } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  SentencePattern,
  SentenceType,
  Subject,
  Tense,
  VerbType,
  Verb,
  FiveSentencePattern,
  Object as ObjectType,
  NumberForm,
  BeComplement,
  Word,
  WordProps,
} from '@/domain/practice/types';
import { getNounWords, getVerbWords, getAdjectiveWords, getAdverbWords } from '@/features/practice/actions/words';
import { useSearchParams } from 'next/navigation';

import { PracticeBattleArea } from '@/features/practice/components/PracticeBattleArea';
import { PracticeQuestionArea } from '@/features/practice/components/PracticeQuestionArea';
import { PracticeAnswerArea } from '@/features/practice/components/PracticeAnswerArea';

export function PracticeContent() {
  const searchParams = useSearchParams();
  const isQuestMode = searchParams.get('mode') === 'quest';
  // Default to true so that Drill mode is active by default (if not quest mode)
  const initialMode = true;
  const selectedPattern = searchParams.get('pattern') || undefined;
  const initialDrillIndex = parseInt(searchParams.get('drill') || '1') - 1;
  const isAdmin = searchParams.get('role') === 'ADMIN';

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
  const [questStatus, setQuestStatus] = useState<'playing' | 'result' | 'failed' | 'all-cleared'>('playing');
  const [questResults, setQuestResults] = useState<('correct' | 'wrong' | null)[]>(new Array(10).fill(null));
  const [heroAction, setHeroAction] = useState<'idle' | 'run-away' | 'defeated' | 'attack'>('idle');

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
      try {
        const [nounsData, verbsData, adjectivesData, adverbsData] = await Promise.all([
          getNounWords(),
          getVerbWords(),
          getAdjectiveWords(),
          getAdverbWords(),
        ]);

        setNounWords(nounsData.map((w: WordProps) => Word.reconstruct(w)));
        setVerbWords(verbsData.map((w: WordProps) => Word.reconstruct(w)));
        setAdjectiveWords(adjectivesData.map((w: WordProps) => Word.reconstruct(w)));
        setAdverbWords(adverbsData.map((w: WordProps) => Word.reconstruct(w)));
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
      setIsTimerActive(false);
      setQuestResults(prev => {
        const next = [...prev];
        if (!next[currentDrillIndex]) {
          next[currentDrillIndex] = 'wrong';
        }
        return next;
      });
      setHeroAction('defeated');
    }
    return () => clearInterval(timer);
  }, [isQuestMode, isTimerActive, timeLeft, questStatus, currentDrillIndex]);

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

  const handleTabChange = useCallback((tab: VerbType | 'admin') => {
    if (tab === 'admin') {
      setActiveTab('admin');
    } else {
      handleVerbTypeChange(tab);
    }
  }, [handleVerbTypeChange]);

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

  const [sessionId, setSessionId] = useState('');
  const [showVictoryEffect, setShowVictoryEffect] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);
  const [monsterState, setMonsterState] = useState<'idle' | 'hit' | 'defeated' | 'damaged'>('idle');

  useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  const generatedText = useMemo(() => new GeneratePatternUseCase().execute(state, nounWords, verbWords), [state, nounWords, verbWords]);

  const currentDrill = drills[currentDrillIndex];
  const isCorrect = useMemo(() => isDrillMode && currentDrill && generatedText.toLowerCase().replace(/[.,?!]/g, '') === currentDrill.english.toLowerCase().replace(/[.,?!]/g, ''), [isDrillMode, currentDrill, generatedText]);

  const [hasMarkedCorrect, setHasMarkedCorrect] = useState(false);

  const triggerVictoryEffect = useCallback(() => {
    setIsScreenFlashing(true);
    setTimeout(() => setIsScreenFlashing(false), 150);

    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 500);

    setMonsterState('hit');
    setTimeout(() => {
      setMonsterState('defeated');
    }, 300);

    setShowVictoryEffect(true);
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

  const handleNextDrill = async (isEscape?: boolean) => {
    if (isEscape === true) {
      setHeroAction('run-away');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (isQuestMode) {
      if (currentDrillIndex + 1 >= drills.length) {
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

    setHeroAction('idle');
  };

  const handleLevelUp = () => {
    setCurrentLevel(prev => prev + 1);
  };

  const handleRetryLevel = () => {
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

  const { heroOpacity, monsterOpacity } = useMemo(() => {
    const correct = questResults.filter(r => r === 'correct').length;
    const wrong = questResults.filter(r => r === 'wrong').length;
    let h = 1;
    let m = 1;
    if (correct < wrong) h = 0.5;
    else if (correct > wrong) m = 0.5;
    return { heroOpacity: h, monsterOpacity: m };
  }, [questResults]);
  
  return (
    <main className={`min-h-screen bg-[#000840] flex flex-col items-center p-4 md:p-8 font-dot text-white transition-all duration-75 ${isScreenShaking ? 'translate-x-2 -translate-y-1 rotate-1' : ''}`}>
      {isScreenFlashing && (
        <div className="fixed inset-0 bg-white z-[1000] opacity-80 pointer-events-none" />
      )}

      <div className="w-full max-w-4xl relative flex flex-col gap-4">

        {((isDrillMode && !isQuestMode && currentDrill) || 
          (isQuestMode && currentDrill && questStatus === 'playing')) && (
            <>
            <PracticeBattleArea 
                isQuestMode={isQuestMode}
                state={state}
                currentDrillIndex={currentDrillIndex}
                heroAction={heroAction}
                monsterState={monsterState}
                battleImages={battleImages}
                heroOpacity={heroOpacity}
                monsterOpacity={monsterOpacity}
            />
            <PracticeQuestionArea
                isQuestMode={isQuestMode}
                currentLevel={currentLevel}
                currentDrillIndex={currentDrillIndex}
                totalDrills={drills.length}
                timeLeft={timeLeft}
                questResults={questResults}
                correctCountInLevel={correctCountInLevel}
                currentDrill={currentDrill}
                isCorrect={isCorrect}
                onNext={handleNextDrill}
                showVictoryEffect={showVictoryEffect}
                displayEnglish={!isQuestMode}
            />
            </>
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
               <div className="w-full mt-2">
                 <Link href="/" className="block w-full">
                    <button className="dq-button w-full py-2 text-sm bg-black/50 border-white/30 text-white/60">
                      ホームへもどる
                    </button>
                 </Link>
               </div>
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

        <PracticeAnswerArea
            activeTab={activeTab}
            onChangeTab={handleTabChange}
            isAdmin={isAdmin}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            correctCountInLevel={correctCountInLevel}
            setCorrectCountInLevel={setCorrectCountInLevel}
            state={state}
            handleSentenceTypeChange={handleSentenceTypeChange}
            handleSubjectChange={handleSubjectChange}
            handleTenseChange={handleTenseChange}
            handleFiveSentencePatternChange={handleFiveSentencePatternChange}
            handleVerbChange={handleVerbChange}
            handleObjectChange={handleObjectChange}
            handleNumberFormChange={handleNumberFormChange}
            handleBeComplementChange={handleBeComplementChange}
            nounWords={nounWords}
            verbWords={verbWords}
            adjectiveWords={adjectiveWords}
            adverbWords={adverbWords}
            isLoadingNouns={isLoadingNouns}
            generatedText={generatedText}
            isCorrect={isCorrect}
            isQuestMode={isQuestMode}
            timeLeft={timeLeft}
        />
        
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
