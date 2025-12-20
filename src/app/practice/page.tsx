"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { NineKeyPanel } from '@/components/practice/NineKeyPanel';
import { VerbTypeSelector } from '@/components/practice/VerbTypeSelector';
import { FiveSentencePatternSelector } from '@/components/practice/FiveSentencePatternSelector';
import { VerbSelector } from '@/components/practice/VerbSelector';
import { ObjectSelector } from '@/components/practice/ObjectSelector';
import { NumberFormSelector } from '@/components/practice/NumberFormSelector';
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
} from '@/domain/models/practice/types';

export default function PracticePage() {
  const [state, setState] = useState<PracticeState>({
    verbType: 'do',
    verb: 'do',
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
    fiveSentencePattern: 'SV',
    object: 'something',
    numberForm: 'singular',
  });

  const handleVerbTypeChange = (verbType: VerbType) => {
    // When switching types, reset verb to default
    const defaultVerb: Verb = verbType === 'be' ? 'something' : 'do';
    setState((prev) => ({ ...prev, verbType, verb: defaultVerb }));
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
                      <div className="flex-1">
                        <VerbSelector
                          verbType={state.verbType}
                          selectedVerb={state.verb}
                          onChange={handleVerbChange}
                          fiveSentencePattern={state.fiveSentencePattern}
                        />
                      </div>
                      <div className="flex-1">
                        <FiveSentencePatternSelector
                          selectedPattern={state.fiveSentencePattern || 'SVO'}
                          onChange={handleFiveSentencePatternChange}
                        />
                      </div>
                    </div>
                    {state.fiveSentencePattern === 'SVO' && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <NumberFormSelector
                            selectedNumberForm={state.numberForm || 'singular'}
                            onChange={handleNumberFormChange}
                          />
                        </div>
                        <div className="flex-1">
                          <ObjectSelector
                            selectedObject={state.object || 'something'}
                            onChange={handleObjectChange}
                            numberForm={state.numberForm || 'singular'}
                          />
                        </div>
                      </div>
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
