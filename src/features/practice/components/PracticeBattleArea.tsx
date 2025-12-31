import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { SentencePattern } from '@/domain/practice/types';
import { getAssetPath } from '@/lib/assets';


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
    monsterState: 'idle' | 'hit' | 'defeated' | 'damaged';
    battleImages: { subjectImg: string; monsterImg: string; itemImg: string | null; monsterScale: number };
    heroOpacity: number;
    monsterOpacity: number;
    // Props moved from PracticeQuestionArea
    currentLevel: number;
    currentDrill: { english: string; japanese: string };
    timeLeft: number;
    questResults: ('correct' | 'wrong' | null)[];
    totalDrills: number;
    correctCountInLevel: number;
    isCorrect: boolean;
    onNext: (isEscape?: boolean) => void;
    showVictoryEffect: boolean;
    displayEnglish?: boolean;
}

export function PracticeBattleArea({
    isQuestMode,
    state,
    currentDrillIndex,
    heroAction,
    monsterState,
    battleImages,
    heroOpacity,
    monsterOpacity,
    currentLevel,
    currentDrill,
    timeLeft,
    questResults,
    totalDrills,
    isCorrect,
    onNext,
    displayEnglish = false
}: PracticeBattleAreaProps) {
    const [attackDistance, setAttackDistance] = useState(150);
    const timeLimit = currentLevel === 10 ? 10 : (currentLevel < 4 ? 30 : 30 - currentLevel * 2);

    useEffect(() => {
        const updateDistance = () => {
            const width = window.innerWidth;
            if (width >= 768) {
                setAttackDistance(300);
            } else {
                setAttackDistance(120);
            }
        };
        
        updateDistance();
        window.addEventListener('resize', updateDistance);
        return () => window.removeEventListener('resize', updateDistance);
    }, []);

    return (
        <div 
            className="dq-battle-bg relative w-full h-[333px] md:h-[474px] mb-4 flex justify-around items-end px-4 gap-2 rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl group"
            style={{ backgroundImage: `url(${getAssetPath('/assets/backgrounds/battle_bg.jpeg')})` }}
        >
            {/* Timer Bar */}
            {isQuestMode && (
                <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-gray-800 z-30">
                     <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${Math.max(0, (timeLeft / timeLimit) * 100)}%` }}></div>
                </div>
            )}

            {/* Top UI Overlay */}
            <div className="absolute top-0 left-0 right-0 p-2 md:p-4 z-30 flex flex-col gap-2 pointer-events-none">
                <div className="flex justify-between items-start">
                     {/* Top Left: Back & Level */}
                     <div className="flex flex-col gap-2 pointer-events-auto">
                        <Link href="/" className="dq-button !py-1 !px-2 md:!px-3 text-[10px] md:text-xs bg-black/40 hover:bg-black/60 border-white/40 self-start">
                           &larr; もどる
                        </Link>
                        <div className="flex items-center gap-2 text-white bg-black/40 px-2 py-1 rounded border border-white/20">
                             <span className="font-bold text-sm md:text-base">Lv{currentLevel}</span>
                             <span className="text-[10px] md:text-xs opacity-70">{currentDrillIndex + 1}/{totalDrills}</span>
                        </div>
                     </div>

                     {/* Top Right: Mode Label & Timer & Progress Dots */}
                     <div className="flex flex-col items-end gap-1">
                        <div className="text-white text-[10px] md:text-xs font-bold drop-shadow-md bg-black/30 px-2 py-1 rounded">
                             {isQuestMode ? 'ドリルクエスト' : 'ぶんしょうトレーニング'}
                        </div>
                        {isQuestMode && (
                           <div className={`flex items-center gap-1 ${timeLeft <= 5 ? 'animate-pulse text-red-500' : 'text-white'}`}>
                               <Timer className="w-3 h-3 md:w-4 md:h-4" />
                               <span className="text-sm md:text-lg font-bold tabular-nums">{timeLeft}</span>
                           </div>
                        )}
                        {/* Progress Dots */}
                        {isQuestMode && (
                            <div className="flex gap-1 mt-1">
                                {questResults.map((result, i) => (
                                    <div 
                                    key={i} 
                                    className={`w-2 h-2 md:w-3 md:h-3 border border-white/50 ${
                                        result === 'correct' 
                                        ? 'bg-green-500' 
                                        : result === 'wrong' 
                                            ? 'bg-red-500' 
                                            : (i === currentDrillIndex ? 'bg-yellow-400 animate-pulse' : 'bg-transparent')
                                    }`}
                                    />
                                ))}
                            </div>
                        )}
                     </div>
                </div>
                
                {/* Center Question Text */}
                <div className="absolute top-12 left-0 right-0 flex flex-col items-center justify-center p-2 pointer-events-none">
                     <div className="bg-black/60 border border-white/20 p-3 md:p-4 rounded-lg text-center backdrop-blur-sm shadow-lg max-w-[90%] md:max-w-xl">
                        <h2 className={`text-xl md:text-3xl font-normal leading-tight ${displayEnglish ? 'text-white/90' : 'text-white'}`}>
                            {currentDrill.japanese}
                        </h2>
                        {displayEnglish && (
                            <h2 className="text-lg md:text-2xl font-normal text-yellow-200 mt-2 leading-tight">
                                {currentDrill.english}
                            </h2>
                        )}
                        {displayEnglish && !isCorrect && (
                            <p className="text-[10px] text-white/50 mt-1">えいご</p>
                        )}
                        {!displayEnglish && !isCorrect && (
                            <p className="text-[10px] text-white/50 mt-1">えいごに　なおせ！</p>
                        )}
                     </div>

                     {/* Victory Message */}
                     {(isCorrect || (isQuestMode && timeLeft === 0)) && (
                        <div className="mt-2 text-center">
                            {isCorrect && (
                             <p className="text-xs md:text-sm text-green-400 font-bold animate-bounce bg-black/80 px-4 py-1 border border-green-400 inline-block rounded">
                                 モンスターを　たおした！
                             </p>
                            )}
                        </div>
                     )}
                </div>
            </div>

            {/* Next / Escape Buttons (Bottom Center or Right) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                 {(isCorrect || (isQuestMode && timeLeft === 0)) ? (
                    <button 
                        onClick={() => onNext()}
                        className="dq-button animate-bounce text-lg px-8 py-3 shadow-[0_0_15px_rgba(255,255,0,0.5)] border-yellow-400"
                    >
                        {isQuestMode && currentDrillIndex + 1 === totalDrills ? 'けっかへ' : 'つぎへすすむ'}
                    </button>
                 ) : (
                    <button 
                        onClick={() => onNext(true)}
                        className="dq-button text-xs py-1 px-4 bg-gray-800 border-gray-500 opacity-80 hover:opacity-100"
                    >
                        にげる
                    </button>
                 )}
            </div>

            {/* Subject Area (Hero) */}
            <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-12 md:pb-16">
                <div className="z-10 flex flex-col items-center">
                {(state.subject === 'first_p' || state.subject === 'second_p' || state.subject === 'third_p') && (
                    <motion.div
                    key={`hero-sub-${state.subject}-${currentDrillIndex}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={
                        heroAction === 'run-away' ? { x: -100, opacity: heroOpacity } : 
                        heroAction === 'defeated' ? { rotate: -90, y: 20, opacity: 0.6, filter: 'grayscale(100%)' } :
                        heroAction === 'attack' ? { x: [0, attackDistance, 0] } :
                        { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
                    }
                    transition={{ duration: heroAction === 'attack' ? 0.3 : 0.5 }}
                    >
                    <Image 
                        src={getAssetPath(battleImages.subjectImg)} 
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
                    heroAction === 'attack' ? { x: [0, attackDistance, 0] } :
                    { x: 0, opacity: heroOpacity, rotate: 0, y: 0, filter: 'none' }
                    }
                    transition={{ duration: heroAction === 'attack' ? 0.3 : 0.5 }}
                >
                    <Image 
                    src={getAssetPath(battleImages.subjectImg)} 
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
            <div className="flex-1 flex flex-col items-center relative h-full justify-end pb-12 md:pb-16">
                <div className="relative" style={{ transformOrigin: 'bottom' }}>
                {/* Monster Image Layer - Multiplied */}
                <motion.div
                    key={`monster-img-${currentDrillIndex}-${battleImages.monsterImg}`}
                    initial={{ y: 20, opacity: 0, scale: 0.8 * battleImages.monsterScale }}
                    animate={{ 
                    y: monsterState === 'hit' ? [0, -20, 0] : (monsterState === 'defeated' ? 20 : 0),
                    rotate: monsterState === 'defeated' ? 90 : 0,
                    opacity: monsterState === 'defeated' ? 0.6 : monsterOpacity,
                    scale: monsterState === 'hit' ? 1.1 * battleImages.monsterScale : 
                           monsterState === 'damaged' ? [1 * battleImages.monsterScale, 0.95 * battleImages.monsterScale, 1 * battleImages.monsterScale] : 
                           1 * battleImages.monsterScale,
                    filter: monsterState === 'hit' ? 'brightness(2) contrast(2)' : 
                            monsterState === 'damaged' ? ['brightness(1)', 'brightness(1.5) sepia(0.5) hue-rotate(-50deg)', 'brightness(1)'] :
                            (monsterState === 'defeated' ? 'grayscale(100%)' : 'none'),
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 
                       monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 0
                    }}
                    transition={{ duration: monsterState === 'hit' ? 0.2 : (monsterState === 'damaged' ? 0.3 : 0.5) }}
                    className="z-10" 
                    style={{ transformOrigin: 'bottom' }}
                >
                    <Image 
                    src={getAssetPath(battleImages.monsterImg)} 
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
                    scale: monsterState === 'hit' ? 1.1 * battleImages.monsterScale : 
                           monsterState === 'damaged' ? [1 * battleImages.monsterScale, 0.95 * battleImages.monsterScale, 1 * battleImages.monsterScale] :
                           1 * battleImages.monsterScale,
                    x: monsterState === 'hit' ? [0, 10, -10, 10, 0] : 
                       monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 0
                    }}
                    transition={{ duration: monsterState === 'hit' ? 0.2 : (monsterState === 'damaged' ? 0.3 : 0.5) }}
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
            <div className="flex-1 flex flex-col items-center relative h-full justify-end min-w-[80px] pb-12 md:pb-16">
                {battleImages.itemImg && (
                <motion.div
                    key={`item-${state.object}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ 
                        x: monsterState === 'damaged' ? [0, 5, -5, 5, 0] : 0,
                        opacity: monsterState === 'defeated' ? 0.6 : 1,
                        y: monsterState === 'defeated' ? 20 : 0,
                        rotate: monsterState === 'defeated' ? 90 : 0,
                        scale: monsterState === 'damaged' ? [1, 0.95, 1] : 1,
                        filter: monsterState === 'damaged' ? ['brightness(1)', 'brightness(1.5) sepia(0.5) hue-rotate(-50deg)', 'brightness(1)'] : 
                                (monsterState === 'defeated' ? 'grayscale(100%)' : 'none')
                    }}
                    transition={{ duration: monsterState === 'damaged' ? 0.3 : 0.5 }}
                    className="z-10 flex flex-col items-center"
                >
                    <Image 
                    src={getAssetPath(battleImages.itemImg)} 
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
