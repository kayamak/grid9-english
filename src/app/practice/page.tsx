"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { NineKeyPanel } from '@/components/practice/NineKeyPanel';
import { VerbSelector } from '@/components/practice/VerbSelector';
import { PatternGenerator } from '@/domain/models/practice/PatternGenerator';
import {
  PracticeState,
  SentenceType,
  Subject,
  Tense,
  VerbType,
} from '@/domain/models/practice/types';

export default function PracticePage() {
  const [state, setState] = useState<PracticeState>({
    verbType: 'do',
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
  });

  const handleVerbChange = (verbType: VerbType) => {
    setState((prev) => ({ ...prev, verbType }));
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
               {/* VerbSelector renders the tabs with bottom-[-2px] to connect */}
               <VerbSelector
                 selectedVerb={state.verbType}
                 onChange={handleVerbChange}
               />
            </div>

            {/* 2. Notebook Page Container */}
            <section className="relative w-full max-w-3xl bg-[#fdfbf7] p-12 pt-12 rounded-lg rounded-tl-none shadow-[2px_10px_20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col items-center min-h-[600px]">
                
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
           SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>
    </main>
  );
}
