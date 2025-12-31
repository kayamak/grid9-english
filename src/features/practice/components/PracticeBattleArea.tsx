import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SentencePattern } from '@/domain/practice/types';

function DragonVEffect() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full absolute flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-60">
            <path d="M20 30 L50 90 L80 30" stroke="orange" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 35 L50 85 L75 35" stroke="yellow" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 40 L50 80 L70 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </svg>
      </motion.div>
    </div>
  );
}

interface PracticeBattleAreaProps {
    isQuestMode: boolean;
    state: SentencePattern;
    currentDrillIndex: number;
    heroAction: 'idle' | 'run-away' | 'defeated' | 'attack';
    monsterState: 'idle' | 'hit' | 'defeated';
    battleImages: { subjectImg: string; monsterImg: string; itemImg: string | null; monsterScale: number };
    heroOpacity: number;
    monsterOpacity: number;
}

export function PracticeBattleArea({
    isQuestMode,
    state,
    currentDrillIndex,
    heroAction,
    monsterState,
    battleImages,
    heroOpacity,
    monsterOpacity
}: PracticeBattleAreaProps) {
    return (
        <div className="dq-battle-bg relative w-full h-[222px] md:h-[316px] mb-4 flex justify-around items-end px-4 gap-2 rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl">
            <div className="absolute top-2 left-2 z-20">
                <Link href="/" className="dq-button !py-1 !px-3 text-xs bg-black/40 hover:bg-black/60 border-white/40">
                &larr; もどる
                </Link>
            </div>
            <div className="absolute top-2 right-2 z-20 text-white font-bold drop-shadow-md pointer-events-none bg-black/30 px-2 py-1 rounded">
                {isQuestMode ? 'ドリルクエスト' : 'ぶんしょうトレーニング'}
            </div>
            {/* Subject Area (Hero) */}
            <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-4">
                <div className="z-10 flex flex-col items-center">
                {(state.subject === 'first_p' || state.subject === 'second_p' || state.subject === 'third_p') && (
                    <motion.div
                    key={`hero-sub-${state.subject}-${currentDrillIndex}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={
                        heroAction === 'run-away' ? { x: -100, opacity: heroOpacity } : 
                        heroAction === 'defeated' ? { rotate: -90, y: 20, opacity: 0.6, filter: 'grayscale(100%)' } :
                        heroAction === 'attack' ? { x: [0, 60, 0] } :
                        { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
                    }
                    transition={{ duration: heroAction === 'attack' ? 0.3 : 0.5 }}
                    >
                    <Image 
                        src={battleImages.subjectImg} 
                        alt="Hero Second" 
                        width={150}
                        height={150}
                        className={`w-12 h-12 md:w-20 md:h-20 object-contain pixelated mix-blend-multiply ${
                        state.subject === 'first_p' || state.subject === 'second_p' ? 'scale-x-[-1]' : ''
                        }`}
                    />
                    </motion.div>
                )}
                <motion.div
                    key={`hero-main-${state.subject}-${currentDrillIndex}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={
                    heroAction === 'run-away' ? { x: -100, opacity: heroOpacity } : 
                    heroAction === 'defeated' ? { rotate: -90, y: 20, opacity: 0.6, filter: 'grayscale(100%)' } :
                    heroAction === 'attack' ? { x: [0, 60, 0] } :
                    { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
                    }
                    transition={{ duration: heroAction === 'attack' ? 0.3 : 0.5 }}
                >
                    <Image 
                    src={battleImages.subjectImg} 
                    alt="Hero" 
                    width={150}
                    height={150}
                    className={`w-20 h-20 md:w-32 md:h-32 object-contain pixelated mix-blend-multiply ${
                        state.subject === 'first_s' || state.subject === 'first_p' || state.subject === 'second' || state.subject === 'second_p' ? 'scale-x-[-1]' : ''
                    }`}
                    />
                </motion.div>
                </div>
                <div className="w-20 h-3 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
            </div>

            {/* Verb Area (Monster) */}
            <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-4">
                <div className="relative" style={{ transformOrigin: 'bottom' }}>
                {/* Monster Image Layer - Multiplied */}
                <motion.div
                    key={`monster-img-${currentDrillIndex}-${battleImages.monsterImg}`}
                    initial={{ y: 20, opacity: 0, scale: 0.8 * battleImages.monsterScale }}
                    animate={{ 
                    y: monsterState === 'hit' ? [0, -20, 0] : (monsterState === 'defeated' ? 20 : 0),
                    rotate: monsterState === 'defeated' ? 90 : 0,
                    opacity: monsterState === 'defeated' ? 0.6 : monsterOpacity,
                    scale: monsterState === 'hit' ? 1.1 * battleImages.monsterScale : 1 * battleImages.monsterScale,
                    filter: monsterState === 'hit' ? 'brightness(2) contrast(2)' : (monsterState === 'defeated' ? 'grayscale(100%)' : 'none'),
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 0
                    }}
                    transition={{ duration: monsterState === 'hit' ? 0.2 : 0.5 }}
                    className="z-10" 
                    style={{ transformOrigin: 'bottom' }}
                >
                    <Image 
                    src={battleImages.monsterImg} 
                    alt="Monster" 
                    width={180}
                    height={180}
                    className="w-28 h-28 md:w-44 md:h-44 object-contain pixelated block"
                    style={{ 
                        mixBlendMode: battleImages.monsterImg.includes('bit_golem.png') ? 'normal' : 'multiply' 
                    }}
                    />
                </motion.div>

                {/* Effects Layer - Normal Blend (Overlay on top of multiplied image) */}
                <motion.div
                    key={`monster-fx-${currentDrillIndex}-${battleImages.monsterImg}`}
                    initial={{ y: 20, opacity: 0, scale: 0.8 * battleImages.monsterScale }}
                    animate={{ 
                    y: monsterState === 'hit' ? [0, -20, 0] : (monsterState === 'defeated' ? 20 : 0),
                    rotate: monsterState === 'defeated' ? 90 : 0,
                    opacity: monsterState === 'defeated' ? 0 : monsterOpacity, // Hide FX on defeat
                    scale: monsterState === 'hit' ? 1.1 * battleImages.monsterScale : 1 * battleImages.monsterScale,
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 0
                    }}
                    transition={{ duration: monsterState === 'hit' ? 0.2 : 0.5 }}
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ transformOrigin: 'bottom' }}
                >
                    {battleImages.monsterImg === '/assets/monsters/void_dragon_v2.png' && monsterState !== 'defeated' && (
                    <DragonVEffect />
                    )}
                    {battleImages.monsterImg === '/assets/monsters/bit_golem.png' && monsterState !== 'defeated' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2.0, times: [0, 0.2, 1], ease: "easeOut" }}
                        className="w-full h-full absolute flex items-center justify-center"
                        >
                            <div className="w-3/4 h-3/4 border-2 border-blue-400/30 rounded-lg flex items-center justify-center">
                            <div className="w-full h-full bg-blue-500/10"></div>
                            </div>
                        </motion.div>
                    </div>
                    )}
                </motion.div>


                </div>
                <div className="w-24 h-3 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
            </div>

            {/* Object Area (Item) */}
            <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px] pb-4">
                {battleImages.itemImg && (
                <motion.div
                    key={`item-${state.object}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ 
                        x: 0, 
                        opacity: monsterState === 'defeated' ? 0.6 : 1,
                        y: monsterState === 'defeated' ? 20 : 0,
                        rotate: monsterState === 'defeated' ? 90 : 0,
                        filter: monsterState === 'defeated' ? 'grayscale(100%)' : 'none'
                    }}
                    className="z-10 flex flex-col items-center"
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
                <div className="w-16 h-2 bg-black/30 blur-md rounded-[100%] absolute bottom-4"></div>
            </div>
        </div>
    );
}
