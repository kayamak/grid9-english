"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy, XCircle, PartyPopper, Beer } from 'lucide-react';
import { motion } from 'framer-motion';
import { PracticeBattleArea } from './PracticeBattleArea';
import { PracticeAnswerArea } from './PracticeAnswerArea';
import { usePractice } from '../hooks/usePractice';
import { WordProps } from '@/domain/practice/types';

export function PracticeContainer({ initialWords, allDrills }: { 
  initialWords: { nouns: WordProps[]; verbs: WordProps[]; adjectives: WordProps[]; adverbs: WordProps[] },
  allDrills: { id: string; sentencePattern: string; english: string; japanese: string; sortOrder: number }[]
}) {
  const {
    isQuestMode,
    isFreeMode,
    isAdmin,
    currentLevel,
    setCurrentLevel,
    questSession,
    heroAction,
    monsterState,
    showVictoryEffect,
    isScreenShaking,
    isScreenFlashing,
    state,
    words,
    isLoadingWords,
    drills,
    currentDrillIndex,
    timeLeft,
    generatedText,
    isCorrect,
    currentDrill,
    handleNextDrill,
    handleRetryLevel,
    handleLevelUp,
    setCorrectCountInLevel,
    handleSentenceTypeChange,
    handleSubjectChange,
    handleTenseChange,
    handleFiveSentencePatternChange,
    handleVerbChange,
    handleObjectChange,
    handleNumberFormChange,
    handleBeComplementChange,
    handleTabChange,
    battleImages,
    heroOpacity,
    monsterOpacity,
    activeTab,
    sessionId,
  } = usePractice(initialWords, allDrills);

  const questStatus = questSession?.status || 'playing';
  const questResults = questSession?.results || [];
  const correctCountInLevel = questSession?.correctCount || 0;

  return (
    <main className={`min-h-screen bg-[#000840] flex flex-col items-center p-4 md:p-8 font-dot text-white transition-all duration-75 ${isScreenShaking ? 'translate-x-2 -translate-y-1 rotate-1' : ''}`}>
      {isScreenFlashing && (
        <div className="fixed inset-0 bg-white z-[1000] opacity-80 pointer-events-none" />
      )}

      <div className="w-full max-w-4xl relative flex flex-col gap-4">

        {((!isQuestMode) || 
          (isQuestMode && currentDrill && questStatus === 'playing')) && (
            <>
            <PracticeBattleArea 
                isQuestMode={isQuestMode}
                isFreeMode={isFreeMode}
                state={state}
                currentDrillIndex={currentDrillIndex}
                heroAction={heroAction}
                monsterState={monsterState}
                battleImages={battleImages}
                heroOpacity={heroOpacity}
                monsterOpacity={monsterOpacity}
                currentLevel={currentLevel}
                currentDrill={currentDrill}
                timeLeft={timeLeft}
                questResults={questResults}
                totalDrills={drills.length}
                correctCountInLevel={correctCountInLevel}
                isCorrect={isCorrect}
                onNext={handleNextDrill}
                showVictoryEffect={showVictoryEffect}
                displayEnglish={!isQuestMode || (isQuestMode && timeLeft === 0)}
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
              {(() => {
                // Generate decoration items once to satisfy hook purity
                const decorations = Array.from({ length: 20 }).map((_, i) => ({
                  id: i,
                  left: `${(i * 137) % 100}%`, // Pseudo-random stable position
                  scale: 0.5 + ((i * 7) % 10) / 10,
                  rotateDir: i % 2 === 0 ? 1 : -1,
                  duration: 3 + ((i * 11) % 4),
                  delay: (i * 3) % 5
                }));
                
                return decorations.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ 
                      top: -20, 
                      left: item.left,
                      rotate: 0,
                      scale: item.scale
                     }}
                    animate={{ 
                      top: '120%', 
                      rotate: 360 * item.rotateDir,
                    }}
                    transition={{ 
                      duration: item.duration, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: item.delay
                    }}
                    className="absolute"
                  >
                    {item.id % 3 === 0 ? (
                      <PartyPopper className="text-yellow-400 w-8 h-8 opacity-40 shadow-xl" />
                    ) : item.id % 3 === 1 ? (
                      <Beer className="text-yellow-200 w-10 h-10 opacity-30" />
                    ) : (
                      <div className="w-4 h-4 bg-white opacity-40" />
                    )}
                  </motion.div>
                ));
              })()}
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
            nounWords={words.nouns}
            verbWords={words.verbs}
            adjectiveWords={words.adjectives}
            adverbWords={words.adverbs}
            isLoadingNouns={isLoadingWords}
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
