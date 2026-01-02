import React from 'react';
import { NineKeyPanel } from './NineKeyPanel';
import { OnboardingBubble } from './OnboardingBubble';
import { VerbTypeSelector } from './VerbTypeSelector';
import { FiveSentencePatternSelector } from './FiveSentencePatternSelector';
import { VerbSelector } from './VerbSelector';
import { ObjectSelector } from './ObjectSelector';
import { NounDeterminerSelector } from './NounDeterminerSelector';
import { ComplementSelector } from './ComplementSelector';
import {
  SentencePattern,
  SentenceType,
  Subject,
  Tense,
  VerbType,
  Verb,
  FiveSentencePattern,
  Object as ObjectType,
  NumberForm,
  BeComplement,
  Word,
} from '@/domain/practice/types';

interface PracticeAnswerAreaProps {
    activeTab: VerbType | 'admin';
    onChangeTab: (tab: VerbType | 'admin') => void;
    isAdmin: boolean;
    currentLevel: number;
    setCurrentLevel: React.Dispatch<React.SetStateAction<number>>;
    correctCountInLevel: number;
    setCorrectCountInLevel: React.Dispatch<React.SetStateAction<number>>;
    state: SentencePattern;
    handleSentenceTypeChange: (type: SentenceType) => void;
    handleSubjectChange: (sub: Subject) => void;
    handleTenseChange: (tense: Tense) => void;
    handleFiveSentencePatternChange: (p: FiveSentencePattern) => void;
    handleVerbChange: (v: Verb) => void;
    handleObjectChange: (o: ObjectType) => void;
    handleNumberFormChange: (n: NumberForm) => void;
    handleBeComplementChange: (c: BeComplement) => void;
    nounWords: Word[];
    verbWords: Word[]; // Actually internal usage but required for selectors if used
    adjectiveWords: Word[];
    adverbWords: Word[];
    isLoadingNouns: boolean;
    generatedText: string;
    isCorrect: boolean;
    isQuestMode: boolean;
    timeLeft: number;
    isOnboardingMode?: boolean;
    onboardingStep?: number;
    onOnboardingNext?: () => void;
}

export function PracticeAnswerArea({
    activeTab,
    onChangeTab,
    isAdmin,
    currentLevel,
    setCurrentLevel,
    correctCountInLevel,
    setCorrectCountInLevel,
    state,
    handleSentenceTypeChange,
    handleSubjectChange,
    handleTenseChange,
    handleFiveSentencePatternChange,
    handleVerbChange,
    handleObjectChange,
    handleNumberFormChange,
    handleBeComplementChange,
    nounWords,
    verbWords,
    adjectiveWords,
    adverbWords,
    isLoadingNouns,
    generatedText,
    isCorrect,
    isQuestMode,
    timeLeft,
    isOnboardingMode,
    onboardingStep,
    onOnboardingNext
}: PracticeAnswerAreaProps) {
    const showBubble = (step: number) => isOnboardingMode && onboardingStep === step;

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full px-4 md:px-8 flex justify-start">
              <div className="relative">
                <VerbTypeSelector
                 activeTab={activeTab}
                 onChange={onChangeTab}
                 isAdmin={isAdmin}
                 disabled={isQuestMode && timeLeft === 0}
               />
               {showBubble(1) && onOnboardingNext && (
                   <OnboardingBubble
                       message="まずは動詞の種類を選びます。&#10;タブの「Doどうし」か「Beどうし」の&#10;どちらかを選択してください。"
                       onClick={onOnboardingNext}
                       position="top"
                       className="mb-4"
                   />
               )}
              </div>
            </div>

            {/* 2. DQ Window Container */}
            <section className="dq-window-fancy w-full p-4 md:p-8 flex flex-col items-center min-h-[500px]">
                
                {activeTab === 'admin' ? (
                  <div className="w-full max-w-xl flex flex-col gap-8 py-8 animate-in fade-in duration-500">
                    <h3 className="text-2xl text-yellow-400 border-b-2 border-yellow-400 pb-2 mb-4">デバッグ管理</h3>
                    
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-white/60 text-sm">現在のレベル</span>
                          <span className="text-4xl font-normal text-white">Lv {currentLevel}</span>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setCurrentLevel(prev => Math.max(1, prev - 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => setCurrentLevel(prev => Math.min(10, prev + 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-black/40 p-6 border-2 border-white/10 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-white/60 text-sm">現在の正解数</span>
                          <span className="text-4xl font-normal text-white">{correctCountInLevel} / 10</span>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setCorrectCountInLevel(prev => Math.max(0, prev - 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => setCorrectCountInLevel(prev => Math.min(10, prev + 1))}
                            className="dq-button !py-2 !px-6 text-2xl"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 text-center text-white/40 text-sm">
                        <p>※レベルは自動的にクッキーに保存されます。</p>
                        <p>※正解数を変更するとクエストモードの判定に影響します。</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                <div className={isQuestMode && timeLeft === 0 ? 'pointer-events-none grayscale' : ''}>
                  <div className="w-full max-w-xl">
                      <NineKeyPanel
                          sentenceType={state.sentenceType}
                          subject={state.subject}
                          tense={state.tense}
                          onSentenceTypeChange={handleSentenceTypeChange}
                          onSubjectChange={handleSubjectChange}
                          onTenseChange={handleTenseChange}
                          isOnboardingMode={isOnboardingMode}
                          onboardingStep={onboardingStep}
                          onOnboardingNext={onOnboardingNext}
                      />
                  </div>

                {/* Verb and Sentence Pattern Selector Dropdowns */}
                {(state.verbType === 'do' || state.verbType === 'be') && (
                  <div className="mt-6 w-full max-w-xl flex flex-col gap-4 relative z-20">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-fit">
                        <FiveSentencePatternSelector
                            selectedPattern={state.fiveSentencePattern || (state.verbType === 'do' ? 'SVO' : 'SV')}
                            onChange={handleFiveSentencePatternChange}
                            verbType={state.verbType}
                        />
                         {showBubble(5) && onOnboardingNext && (
                            <OnboardingBubble
                                message="リストから「ぶんけい」を選びます。&#10;Sは主語、Vは動詞、&#10;Oは目的語、Cは補語を表します。"
                                onClick={onOnboardingNext}
<<<<<<< Updated upstream
                                position="bottom"
                                align="start"
=======
                                position="top"
>>>>>>> Stashed changes
                            />
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <VerbSelector
                          verbType={state.verbType}
                          selectedVerb={state.verb}
                          onChange={handleVerbChange}
                          verbWords={verbWords}
                          fiveSentencePattern={state.fiveSentencePattern}
                          disabled={state.verbType === 'be'}
                        />
                        {showBubble(6) && onOnboardingNext && (
                            <OnboardingBubble
                                message="リストから「どうし」を選びます。&#10;問題文の動詞と同じものを&#10;探して選択してください。"
                                onClick={onOnboardingNext}
                                position="top"
                            />
                        )}
                      </div>
                    </div>
                    {state.verbType === 'do' && state.fiveSentencePattern === 'SVO' && (
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
                    {state.verbType === 'be' && (
                        state.fiveSentencePattern === 'SVC' ? (
                          <ComplementSelector
                            selectedComplement={state.beComplement || 'warrior'}
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
                        )
                    )}
                  </div>
                )}
                </div>

                <div className="mt-8 w-full max-w-lg relative">
                    {/* DQ style result box */}
                    <div className={`dq-window transition-colors duration-500 p-4 text-center ${isCorrect ? 'border-yellow-400 bg-black/80' : 'border-white bg-black'}`}>
                        <p className={`text-sm uppercase tracking-widest mb-1 ${isCorrect ? 'text-yellow-400' : (isQuestMode && timeLeft === 0 ? 'text-red-500' : 'text-white/40')}`}>
                          {isCorrect ? '★ せいかい！ ★' : (isQuestMode && timeLeft === 0 ? '⏰ じかんぎれ！ ⏰' : 'けっか')}
                        </p>
                        <p className={`text-3xl md:text-5xl font-normal leading-tight transition-all duration-300 ${isCorrect ? 'text-white scale-105' : (isQuestMode && timeLeft === 0 ? 'text-red-500 opacity-50' : 'text-white')}`}>
                        {generatedText}
                        </p>
                    </div>
                    {showBubble(7) && onOnboardingNext && (
                        <OnboardingBubble
                            message="「けっか」の枠を見てください。&#10;作成された英文が問題と同じなら、&#10;モンスターを攻撃します。"
                            onClick={onOnboardingNext}
                            position="top"
                        />
                    )}
                </div>
                </>
                )}
            </section>
        </div>
    )
}
