"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NineKeyPanel } from '@/components/practice/NineKeyPanel';
import { VerbTypeSelector } from '@/components/practice/VerbTypeSelector';
import { FiveSentencePatternSelector } from '@/components/practice/FiveSentencePatternSelector';
import { VerbSelector } from '@/components/practice/VerbSelector';
import { ObjectSelector } from '@/components/practice/ObjectSelector';
import { NumberFormSelector } from '@/components/practice/NumberFormSelector';
import { ComplementSelector } from '@/components/practice/ComplementSelector';
import { PatternGenerator } from '@/domain/models/practice/PatternGenerator';
import {
  PracticeState,
  SentenceType,
  Subject,
  Tense,
  VerbType,
  Verb,
  FiveSentencePattern,
  Object,
  NumberForm,
  BeComplement,
} from '@/domain/models/practice/types';

interface NounWord {
  id: string;
  value: string;
  label: string;
  numberForm: string;
  sortOrder: number;
}

interface AdjectiveWord {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
}

interface AdverbWord {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
}

export default function PracticePage() {
  const [state, setState] = useState<PracticeState>({
    verbType: 'do',
    verb: 'do',
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
    fiveSentencePattern: 'SV',
    object: 'something',
    numberForm: 'none',
    beComplement: 'here',
  });

  const [nounWords, setNounWords] = useState<NounWord[]>([]);
  const [adjectiveWords, setAdjectiveWords] = useState<AdjectiveWord[]>([]);
  const [adverbWords, setAdverbWords] = useState<AdverbWord[]>([]);
  const [isLoadingNouns, setIsLoadingNouns] = useState(true);

  // Fetch noun words from API
  useEffect(() => {
    const fetchNounWords = async () => {
      try {
        const response = await fetch('/api/noun-words');
          if (response.ok) {
            const data = await response.json();
            setNounWords(data);
          } else {
            console.error('Failed to fetch noun words');
          }

          const responseAdj = await fetch('/api/adjective-words');
          if (responseAdj.ok) {
            const data = await responseAdj.json();
            setAdjectiveWords(data);
          } else {
            console.error('Failed to fetch adjective words');
          }

          const responseAdv = await fetch('/api/adverb-words');
          if (responseAdv.ok) {
            const data = await responseAdv.json();
            setAdverbWords(data);
          } else {
            console.error('Failed to fetch adverb words');
          }
      } catch (error) {
        console.error('Error fetching noun words:', error);
      } finally {
        setIsLoadingNouns(false);
      }
    };

    fetchNounWords();
  }, []);

  const handleVerbTypeChange = (verbType: VerbType) => {
    // When switching types, reset verb and pattern to defaults
    if (verbType === 'be') {
      setState((prev) => ({ ...prev, verbType, verb: 'be', fiveSentencePattern: 'SV', beComplement: 'here', numberForm: 'a' }));
    } else {
      setState((prev) => ({ ...prev, verbType, verb: 'do', fiveSentencePattern: 'SV' }));
    }
  };

  const handleVerbChange = (verb: Verb) => {
    setState((prev) => ({ ...prev, verb }));
  };

  const handleSentenceTypeChange = (sentenceType: SentenceType) => {
    setState((prev) => ({ ...prev, sentenceType }));
  };

  const handleSubjectChange = (subject: Subject) => {
    setState((prev) => ({ ...prev, subject }));
  };

  const handleTenseChange = (tense: Tense) => {
    setState((prev) => ({ ...prev, tense }));
  };

  const handleFiveSentencePatternChange = (fiveSentencePattern: FiveSentencePattern) => {
    setState((prev) => {
      // Reset verb to 'do' when changing pattern to ensure it's valid for the new pattern
      // This prevents having an SV-only verb selected when switching to SVO, and vice versa
      return { ...prev, fiveSentencePattern, verb: 'do' };
    });
  };

  const handleObjectChange = (object: Object) => {
    setState((prev) => ({ ...prev, object }));
  };

  const handleNumberFormChange = (numberForm: NumberForm) => {
    setState((prev) => ({ ...prev, numberForm }));
  };

  const handleBeComplementChange = (beComplement: BeComplement) => {
    setState((prev) => ({ ...prev, beComplement }));
  };

  const [sessionId, setSessionId] = useState('');

  React.useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, []);

  const generatedText = PatternGenerator.generate(state);

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
                        <NumberFormSelector
                          selectedNumberForm={state.numberForm || 'a'}
                          onChange={handleNumberFormChange}
                        />
                      </ObjectSelector>
                    )}
                  </div>
                )}\n\n                {/* Verb and Sentence Pattern Selector Dropdowns - Only shown for Be verbs */}
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
                        <NumberFormSelector
                          selectedNumberForm={state.numberForm || 'a'}
                          onChange={handleNumberFormChange}
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
                    <div className="bg-transparent border-b-2 border-gray-300 p-4 text-center">
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1 font-serif">Result</p>
                        <p className="text-5xl font-bold text-slate-800 font-serif leading-tight">
                        {generatedText}
                        </p>
                    </div>
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
