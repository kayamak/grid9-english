"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface PracticeLevelUpAreaProps {
  correctCountInLevel: number;
  currentLevel: number;
  onLevelUp: () => void;
}

export function PracticeLevelUpArea({
  correctCountInLevel,
  currentLevel,
  onLevelUp
}: PracticeLevelUpAreaProps) {
  return (
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
           onClick={onLevelUp}
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
  );
}
