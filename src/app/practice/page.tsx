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
import { getSentenceDrills } from '@/features/practice/actions/drills';
import { CheckCircle2, ArrowRightLeft, StepForward } from 'lucide-react';
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
  const initialMode = searchParams.get('mode') === 'drill';
  const selectedPattern = searchParams.get('pattern') || undefined;
  const initialDrillIndex = parseInt(searchParams.get('drill') || '1') - 1;

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
      const data = await getSentenceDrills(selectedPattern);
      setDrills(data);
    };
    fetchDrills();
  }, [selectedPattern]);

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

  const handleNextDrill = () => {
    setCurrentDrillIndex((prev) => (prev + 1) % drills.length);
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

        {isDrillMode && currentDrill && (
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
                        <p className={`text-sm uppercase tracking-widest mb-1 font-serif ${isCorrect ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                          {isCorrect ? '✨ Correct! Perfect Build ✨' : 'Result'}
                        </p>
                        <p className={`text-5xl font-bold font-serif leading-tight transition-all duration-300 ${isCorrect ? 'text-green-600 scale-105' : 'text-slate-800'}`}>
                        {generatedText}
                        </p>
                    </div>

                    {isCorrect && (
                      <div className="mt-8 flex justify-center animate-bounce">
                        <Button 
                          onClick={handleNextDrill}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-xl font-bold shadow-lg"
                        >
                          Next Challenge <StepForward className="ml-2" />
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
