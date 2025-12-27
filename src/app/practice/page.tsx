"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NineKeyPanel } from '@/features/practice/components/NineKeyPanel';
import { VerbTypeSelector } from '@/features/practice/components/VerbTypeSelector';
import { FiveSentencePatternSelector } from '@/features/practice/components/FiveSentencePatternSelector';
import { VerbSelector } from '@/features/practice/components/VerbSelector';
import { ObjectSelector } from '@/features/practice/components/ObjectSelector';
import { NounDeterminerSelector } from '@/features/practice/components/NounDeterminerSelector';
import { ComplementSelector } from '@/features/practice/components/ComplementSelector';
import { GeneratePatternUseCase } from '@/features/practice/actions/GeneratePatternUseCase';
import { getSentenceDrills, getDrillQuestQuestions } from '@/features/practice/actions/drills';
import { CheckCircle2, ArrowRightLeft, StepForward, Timer, Trophy, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const [currentLevel, setCurrentLevel] = useState(1);
  const [correctCountInLevel, setCorrectCountInLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [isAllCleared, setIsAllCleared] = useState(false);
  const [questStatus, setQuestStatus] = useState<'playing' | 'result' | 'failed' | 'all-cleared'>('playing');

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
  const [drills, setDrills] = useState<any[]>([]);
  const [isDrillMode, setIsDrillMode] = useState(initialMode);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(Math.max(0, initialDrillIndex));

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
        // Set time limit based on level: 30s base, L4+ has formula
        const timeLimit = currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2));
        setTimeLeft(timeLimit);
        setIsTimerActive(true);
        setQuestStatus('playing');
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
    }
    return () => clearInterval(timer);
  }, [isQuestMode, isTimerActive, timeLeft, questStatus]);

  const handleVerbTypeChange = (verbType: VerbType) => {
    // When switching types, reset verb and pattern to defaults
    if (verbType === 'be') {
      setState(() => SentencePattern.create({
        ...state.toObject(),
        verbType,
        verb: 'be',
        fiveSentencePattern: 'SV',
        beComplement: 'here',
        numberForm: 'a'
      }));
    } else {
      setState(() => SentencePattern.create({
        ...state.toObject(),
        verbType,
        verb: 'do',
        fiveSentencePattern: 'SV'
      }));
    }
  };

  const handleVerbChange = (verb: Verb) => {
    setState(() => SentencePattern.create({ ...state.toObject(), verb }));
  };

  const handleSentenceTypeChange = (sentenceType: SentenceType) => {
    setState((prev) => prev.toggleSentenceType(sentenceType));
  };

  const handleSubjectChange = (subject: Subject) => {
    // Check if clicking same person to rotate (Invariant 1)
    if (subject === state.subject) {
      setState((prev) => prev.rotateSubject());
    } else {
      setState(() => SentencePattern.create({ ...state.toObject(), subject }));
    }
  };

  const handleTenseChange = (tense: Tense) => {
    setState((prev) => prev.changeTense(tense));
  };

  const handleFiveSentencePatternChange = (fiveSentencePattern: FiveSentencePattern) => {
    setState(() => SentencePattern.create({
       ...state.toObject(),
       fiveSentencePattern,
       verb: 'do'
    }));
  };

  const handleObjectChange = (object: Object) => {
    setState(() => SentencePattern.create({ ...state.toObject(), object }));
  };

  const handleNumberFormChange = (numberForm: NumberForm) => {
    setState(() => SentencePattern.create({ ...state.toObject(), numberForm }));
  };

  const handleBeComplementChange = (beComplement: BeComplement) => {
    setState(() => SentencePattern.create({ ...state.toObject(), beComplement }));
  };

  const [sessionId, setSessionId] = useState('');

  React.useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  const generatedText = new GeneratePatternUseCase().execute(state, nounWords, verbWords);

  const currentDrill = drills[currentDrillIndex];
  const isCorrect = isDrillMode && currentDrill && generatedText.toLowerCase().replace(/[.,?!]/g, '') === currentDrill.english.toLowerCase().replace(/[.,?!]/g, '');

  const [hasMarkedCorrect, setHasMarkedCorrect] = useState(false);

  useEffect(() => {
    if (isCorrect && !hasMarkedCorrect && isQuestMode && questStatus === 'playing') {
      setCorrectCountInLevel(prev => prev + 1);
      setHasMarkedCorrect(true);
      setIsTimerActive(false);
    }
  }, [isCorrect, hasMarkedCorrect, isQuestMode, questStatus]);

  useEffect(() => {
    setHasMarkedCorrect(false);
  }, [currentDrillIndex]);

  const handleNextDrill = () => {
    if (isQuestMode) {
      if (currentDrillIndex + 1 >= drills.length) {
        // Evaluate level result
        const finalCorrect = isCorrect ? correctCountInLevel : correctCountInLevel; // already incremented by effect
        if (correctCountInLevel >= 8) {
          if (currentLevel === 9) {
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
        const timeLimit = currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2));
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
      const timeLimit = currentLevel < 4 ? 30 : Math.max(5, 30 - (currentLevel * 2));
      setTimeLeft(timeLimit);
      setIsTimerActive(true);
      setQuestStatus('playing');
    };
    fetchAgain();
  };

  const toggleDrillMode = () => {
    setIsDrillMode(!isDrillMode);
  };

  return (
    <main className="min-h-screen bg-[#e3ded1] flex flex-col items-center p-8 font-sans">
      {/* Background: realistic desk color/texture */}
      
      <div className="w-full max-w-4xl">
        <header className="mb-12 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 mb-4 inline-block font-medium">
                &larr; Return to Dashboard
            </Link>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Pattern Practice</h1>
          
        </header>

        {isDrillMode && !isQuestMode && currentDrill && (
          <div className="mb-8 w-full flex flex-col items-center">
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 p-6 rounded-2xl shadow-sm w-full max-w-2xl flex flex-col items-center relative gap-4">
              <div className="flex flex-col items-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">Current Challenge ({currentDrillIndex + 1}/{drills.length})</p>
                {selectedPattern && (
                  <span className="mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase tracking-wider border border-indigo-100">
                    {selectedPattern}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-serif font-bold text-slate-800 text-center px-8">
                  {currentDrill.english}
                </h2>
                <p className="text-lg text-slate-500 font-medium text-center mt-2 px-8 border-t border-slate-100 pt-2 w-full max-w-sm">
                  {currentDrill.japanese}
                </p>
              </div>

              <div className="flex gap-4 mt-2">
                <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleNextDrill}
                   className="rounded-full border-indigo-100 hover:bg-indigo-50 text-indigo-400"
                >
                  Skip <StepForward className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {isQuestMode && currentDrill && questStatus === 'playing' && (
          <div className="mb-8 w-full flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-md border-b-4 border-amber-500 p-6 rounded-3xl shadow-xl w-full max-w-2xl flex flex-col items-center relative gap-6 overflow-hidden">
              {/* Timer Bar */}
              <div className="absolute top-0 left-0 h-1.5 bg-amber-500 transition-all duration-1000" style={{ width: `${(timeLeft / (currentLevel < 4 ? 30 : 30 - currentLevel * 2)) * 100}%` }}></div>
              
              <div className="w-full flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform rotate-3">
                    Lv{currentLevel}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Quest Progress</p>
                    <p className="text-sm font-bold text-slate-700">{currentDrillIndex + 1} / {drills.length}</p>
                  </div>
                </div>

                <div className={`flex flex-col items-end ${timeLeft <= 5 ? 'animate-pulse text-red-600' : 'text-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-amber-500'}`} />
                    <span className="text-2xl font-black tabular-nums">{timeLeft}s</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Remaining</p>
                </div>
              </div>

              <div className="flex flex-col items-center py-4 bg-slate-50/50 w-full rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Translate to English</p>
                <h2 className="text-3xl font-serif font-bold text-slate-800 text-center px-8">
                  {currentDrill.japanese}
                </h2>
                {/* English is hidden in quest mode until correct or timeup? 
                    Actually, usually in drills we show Japanese and ask to build English. 
                    In the current drill mode, it shows BOTH. 
                    Spec says "English sentences as problems", but usually it's Japanese -> build English.
                    Wait, current drill mode shows English AND Japanese.
                    Let's hide English for Quest Mode to make it a challenge.
                */}
                {(isCorrect || timeLeft === 0) && (
                   <p className="mt-4 text-xl font-serif font-bold text-amber-600 animate-in fade-in slide-in-from-top-4 duration-500">
                     {currentDrill.english}
                   </p>
                )}
              </div>

              <div className="w-full flex justify-between items-center px-4">
                 <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                       {[...Array(10)].map((_, i) => (
                         <div 
                           key={i} 
                           className={`w-3 h-3 rounded-full border-2 ${
                             i < currentDrillIndex 
                               ? (i < correctCountInLevel ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600')
                               : (i === currentDrillIndex ? 'bg-amber-400 border-amber-500 animate-pulse' : 'bg-slate-200 border-slate-300')
                           }`}
                         />
                       ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 ml-2">{correctCountInLevel} / 10 Correct</span>
                 </div>

                 {(isCorrect || timeLeft === 0) && (
                   <Button 
                      onClick={handleNextDrill}
                      className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 font-bold shadow-lg flex items-center gap-2 animate-in zoom-in duration-300"
                   >
                     {currentDrillIndex + 1 === drills.length ? 'Results' : 'Next'} <ChevronRight className="w-4 h-4" />
                   </Button>
                 )}
              </div>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'result' && (
          <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-green-500 flex flex-col items-center gap-6 text-center max-w-md w-full relative overflow-hidden">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-50 rounded-full -z-10"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-50 rounded-full -z-10"></div>
               
               <Trophy className="w-24 h-24 text-green-500 animate-bounce" />
               <div>
                 <h2 className="text-4xl font-black text-slate-900 mb-2">LEVEL UP!</h2>
                 <p className="text-slate-500 font-medium">Amazing performance, Warrior.</p>
               </div>
               
               <div className="flex gap-8 my-4">
                  <div>
                    <p className="text-4xl font-black text-slate-800">{correctCountInLevel}/10</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100"></div>
                  <div>
                    <p className="text-4xl font-black text-green-600">Lv {currentLevel + 1}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Rank</p>
                  </div>
               </div>

               <Button 
                 onClick={handleLevelUp}
                 className="w-full bg-green-500 hover:bg-green-600 text-white py-8 rounded-2xl text-xl font-black shadow-xl hover:scale-105 transition-all"
               >
                 Advance to Level {currentLevel + 1}
               </Button>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'failed' && (
          <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-red-500 flex flex-col items-center gap-6 text-center max-w-md w-full">
               <XCircle className="w-24 h-24 text-red-500" />
               <div>
                 <h2 className="text-4xl font-black text-slate-900 mb-2">QUEST FAILED</h2>
                 <p className="text-slate-500 font-medium">You need at least 8 correct to advance.</p>
               </div>
               
               <div className="bg-red-50 p-6 rounded-2xl w-full">
                  <p className="text-5xl font-black text-red-600">{correctCountInLevel}/10</p>
                  <p className="text-sm font-bold text-red-400 mt-2">Your Final Score</p>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full">
                 <Button 
                   onClick={handleRetryLevel}
                   variant="outline"
                   className="border-2 border-slate-200 py-6 rounded-xl font-bold flex items-center gap-2"
                 >
                   <RotateCcw className="w-4 h-4" /> Retry
                 </Button>
                 <Link href="/" className="w-full">
                    <Button variant="ghost" className="w-full py-6 rounded-xl font-bold text-slate-500">Exit Quest</Button>
                 </Link>
               </div>
            </div>
          </div>
        )}

        {isQuestMode && questStatus === 'all-cleared' && (
          <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
            <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border-8 border-amber-400 flex flex-col items-center gap-8 text-center max-w-lg w-full text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
               
               <div className="relative">
                 <Trophy className="w-32 h-32 text-amber-400 animate-pulse" />
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 font-black shadow-lg">9</div>
               </div>
               
               <div>
                 <h2 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">GRAND MASTER</h2>
                 <p className="text-slate-400 font-medium text-lg leading-relaxed">
                   You have conquered all levels of the Drill Quest.<br/>Your pattern recognition is elite.
                 </p>
               </div>

               <div className="w-full h-px bg-slate-800"></div>

               <Link href="/" className="w-full">
                 <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-8 rounded-2xl text-xl font-black shadow-xl hover:scale-105 transition-all">
                   Return as a Legend
                 </Button>
               </Link>
            </div>
          </div>
        )}

        {/* The Notebook Assembly */}
        <div className="flex flex-col items-center">
            
            {/* 1. Tabs Area - Sits naturally on top of the notebook page */}
            <div className="w-full max-w-2xl px-8 flex justify-start">
               {/* VerbTypeSelector renders the tabs with bottom-[-2px] to connect */}
               <VerbTypeSelector
                 selectedVerb={state.verbType}
                 onChange={handleVerbTypeChange}
               />
            </div>

            {/* 2. Notebook Page Container */}
            <section className="relative w-full max-w-3xl bg-[#fdfbf7] p-8 rounded-lg rounded-tl-none shadow-[2px_10px_20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col items-center min-h-[600px]">
                
                {/* Paper Texture Overlay (optional css trick or just stick to color) */}
                
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

                {/* Verb and Sentence Pattern Selector Dropdowns - Only shown for Do verbs */}
                {state.verbType === 'do' && (
                  <div className="mt-8 mb-2 w-full max-w-xl flex flex-col gap-4 relative z-20">
                    <div className="flex gap-4">
                      <FiveSentencePatternSelector
                        selectedPattern={state.fiveSentencePattern || 'SVO'}
                        onChange={handleFiveSentencePatternChange}
                        verbType={state.verbType}
                      />
                      <div className="flex-1">
                        <VerbSelector
                          verbType={state.verbType}
                          selectedVerb={state.verb}
                          onChange={handleVerbChange}
                          fiveSentencePattern={state.fiveSentencePattern}
                        />
                      </div>
                    </div>
                    {state.fiveSentencePattern === 'SVO' && (
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
                  </div>
                )}
                {/* Verb and Sentence Pattern Selector Dropdowns - Only shown for Be verbs */}
                {state.verbType === 'be' && (
                  <div className="mt-8 mb-2 w-full max-w-xl flex flex-col gap-4 relative z-20">
                    <div className="flex gap-4">
                      <FiveSentencePatternSelector
                        selectedPattern={state.fiveSentencePattern || 'SV'}
                        onChange={handleFiveSentencePatternChange}
                        verbType={state.verbType}
                      />
                      <div className="flex-1">
                        <VerbSelector
                          verbType={state.verbType}
                          selectedVerb={state.verb}
                          onChange={handleVerbChange}
                          fiveSentencePattern={state.fiveSentencePattern}
                          disabled={true}
                        />
                      </div>
                    </div>
                    {state.fiveSentencePattern === 'SVC' ? (
                      <ComplementSelector
                        selectedComplement={state.beComplement || 'carpenter'}
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
                    )}
                  </div>
                )}

                <div className="mt-12 w-full max-w-lg relative">
                    {/* Handwritten style result box */}
                    <div className={`bg-transparent border-b-2 transition-colors duration-500 p-4 text-center ${isCorrect ? 'border-green-400' : 'border-gray-300'}`}>
                        <p className={`text-sm uppercase tracking-widest mb-1 font-serif ${isCorrect ? 'text-green-500 font-bold' : (isQuestMode && timeLeft === 0 ? 'text-red-500' : 'text-gray-400')}`}>
                          {isCorrect ? '✨ Correct! Perfect Build ✨' : (isQuestMode && timeLeft === 0 ? '⏰ TIME UP! ⏰' : 'Result')}
                        </p>
                        <p className={`text-5xl font-bold font-serif leading-tight transition-all duration-300 ${isCorrect ? 'text-green-600 scale-105' : (isQuestMode && timeLeft === 0 ? 'text-red-500 opacity-50' : 'text-slate-800')}`}>
                        {generatedText}
                        </p>
                    </div>

                    {isCorrect && !isQuestMode && (
                      <div className="mt-8 flex justify-center animate-bounce">
                        <Button 
                          onClick={handleNextDrill}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-xl font-bold shadow-lg"
                        >
                          Next Challenge <StepForward className="ml-2" />
                        </Button>
                      </div>
                    )}

                    {isQuestMode && (isCorrect || timeLeft === 0) && questStatus === 'playing' && (
                       <div className="mt-8 flex justify-center animate-bounce">
                         <Button 
                           onClick={handleNextDrill}
                           className={`${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-full px-10 py-6 text-xl font-black shadow-lg flex items-center gap-3`}
                         >
                           {currentDrillIndex + 1 === drills.length ? 'FINISH QUEST' : 'CONTINUE'} <StepForward className="w-6 h-6" />
                         </Button>
                       </div>
                    )}
                </div>

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
