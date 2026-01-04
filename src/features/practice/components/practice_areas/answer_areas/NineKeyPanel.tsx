import React from 'react';
import { Subject } from '@/domain/practice/types';
import { OnboardingBubble } from './OnboardingBubble';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

interface NineKeyPanelProps {
  onboardingStep?: number;
  onOnboardingNext?: () => void;
}

const RowContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center dq-window w-full max-w-xl py-2 px-4 shadow-lg relative">
    <div className="w-16 md:w-24 font-normal text-yellow-100 text-[10px] md:text-sm mr-2 md:mr-4 shrink-0 text-right pr-2 md:pr-4 border-r-2 border-white/10">
      {title}
    </div>
    <div className="flex space-x-2 md:space-x-4 grow justify-center">
      {children}
    </div>
  </div>
);

export const NineKeyPanel: React.FC<NineKeyPanelProps> = ({
  onboardingStep,
  onOnboardingNext,
}) => {
  const { state, isOnboardingMode } = usePracticeStore();
  const { handleSentenceTypeChange, handleSubjectChange, handleTenseChange } = usePracticeActions();
  
  const { sentenceType, subject, tense } = state;

  const showBubble = (step: number) =>
    isOnboardingMode && onboardingStep === step;

  const getCellClass = (isActive: boolean) =>
    `relative group flex items-center justify-center aspect-square text-xl md:text-3xl font-normal cursor-pointer transition-all border-2 md:border-4 select-none w-14 h-14 md:w-20 md:h-20 shadow-md ${
      isActive
        ? 'bg-yellow-400 text-[#000d60] border-white scale-110 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
        : 'bg-[#001da0] text-white border-white/30 hover:border-white/60 hover:bg-[#0025c0]'
    }`;

  const renderTooltip = (text: string) => (
    <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap dq-window !bg-black !p-1 text-white text-xs shadow-xl pointer-events-none z-20">
      {text}
    </span>
  );

  const renderSubjectContent = (targetSubject: Subject, label: string) => {
    if (targetSubject === 'first_s') return '1';
    if (targetSubject === 'first_p') return '11';
    if (targetSubject === 'second') return '2';
    if (targetSubject === 'second_p') return '22';
    if (targetSubject === 'third_s') return '3';
    if (targetSubject === 'third_p') return '33';
    return label;
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {/* Row 1: Sentence Type */}
      <RowContainer title="しゅるい">
        <div
          className={getCellClass(sentenceType === 'negative')}
          onClick={() => handleSentenceTypeChange('negative')}
        >
          X{renderTooltip('否定文')}
        </div>
        <div
          className={getCellClass(sentenceType === 'positive')}
          onClick={() => handleSentenceTypeChange('positive')}
        >
          O{renderTooltip('肯定文')}
        </div>
        <div
          className={getCellClass(sentenceType === 'question')}
          onClick={() => handleSentenceTypeChange('question')}
        >
          ?{renderTooltip('疑問文')}
        </div>
        {showBubble(2) && onOnboardingNext && (
          <OnboardingBubble
            message="次は「しゅるい」の行です。&#10;X(否定)、O(肯定)、？(疑問)から&#10;正しいものを選んでください。"
            onClick={onOnboardingNext}
            position="top"
          />
        )}
      </RowContainer>

      {/* Row 2: Subject */}
      <RowContainer title="しゅご">
        <div
          className={getCellClass(
            subject === 'second' || subject === 'second_p'
          )}
          onClick={() =>
            handleSubjectChange(subject === 'second' ? 'second_p' : 'second')
          }
        >
          {renderSubjectContent(
            subject === 'second_p' ? 'second_p' : 'second',
            '2 / 22'
          )}
          {renderTooltip('二人称')}
        </div>
        <div
          className={getCellClass(
            subject === 'first_s' || subject === 'first_p'
          )}
          onClick={() =>
            handleSubjectChange(subject === 'first_s' ? 'first_p' : 'first_s')
          }
        >
          {renderSubjectContent(
            subject === 'first_p' ? 'first_p' : 'first_s',
            '1 / 11'
          )}
          {renderTooltip('一人称')}
        </div>
        <div
          className={getCellClass(
            subject === 'third_s' || subject === 'third_p'
          )}
          onClick={() =>
            handleSubjectChange(subject === 'third_s' ? 'third_p' : 'third_s')
          }
        >
          {renderSubjectContent(
            subject === 'third_p' ? 'third_p' : 'third_s',
            '3 / 33'
          )}
          {renderTooltip('三人称')}
        </div>
        {showBubble(3) && onOnboardingNext && (
          <OnboardingBubble
            message="次は「しゅご」の行です。1(私)、2(あなた)、3(他)。&#10;同じ場所を押すと、単数と複数が切り替わります。"
            onClick={onOnboardingNext}
            position="top"
          />
        )}
      </RowContainer>

      {/* Row 3: Tense */}
      <RowContainer title="じせい">
        <div
          className={getCellClass(tense === 'past')}
          onClick={() => handleTenseChange('past')}
        >
          &#8617;
          {renderTooltip('過去形')}
        </div>
        <div
          className={getCellClass(tense === 'present')}
          onClick={() => handleTenseChange('present')}
        >
          O{renderTooltip('現在形')}
        </div>
        <div
          className={getCellClass(tense === 'future')}
          onClick={() => handleTenseChange('future')}
        >
          &#8618;
          {renderTooltip('未来形')}
        </div>
        {showBubble(4) && onOnboardingNext && (
          <OnboardingBubble
            message="最後は「じせい」の行です。&#10;左(過去)、O(現在)、右(未来)から&#10;いつの話かを選んでください。"
            onClick={onOnboardingNext}
            position="top"
          />
        )}
      </RowContainer>
    </div>
  );
};
