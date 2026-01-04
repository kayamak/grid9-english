'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

export function ResultFailedArea() {
  const { questSession } = usePracticeStore();
  const { handleRetryLevel } = usePracticeActions();
  
  const correctCountInLevel = questSession?.correctCount || 0;

  return (
    <div className="mb-8 w-full flex flex-col items-center animate-in zoom-in duration-500">
      <div className="dq-window p-10 border-red-500 flex flex-col items-center gap-6 text-center max-w-md w-full">
        <XCircle className="w-24 h-24 text-red-500" />
        <div>
          <h2 className="text-4xl font-normal text-white mb-2">しっぱい！</h2>
          <p className="text-white/60">
            ８もんいじょう　せいかい　しなければならない。
          </p>
        </div>

        <div className="bg-red-900/20 p-6 border-2 border-red-500/20 w-full">
          <p className="text-5xl font-normal text-red-500">
            {correctCountInLevel}/10
          </p>
          <p className="text-sm text-red-400 mt-2">きみの　せいせき</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button onClick={handleRetryLevel} className="dq-button py-2">
            さいちょうせん
          </button>
          <Link href="/" className="w-full">
            <button className="dq-button w-full py-2 text-white/40 border-white/20">
              あきらめる
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
