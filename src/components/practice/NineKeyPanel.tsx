import React from 'react';
import { SentenceType, Subject, Tense } from '@/domain/models/practice/types';

interface NineKeyPanelProps {
  sentenceType: SentenceType;
  subject: Subject;
  tense: Tense;
  onSentenceTypeChange: (type: SentenceType) => void;
  onSubjectChange: (subj: Subject) => void;
  onTenseChange: (tense: Tense) => void;
}

export const NineKeyPanel: React.FC<NineKeyPanelProps> = ({
  sentenceType,
  subject,
  tense,
  onSentenceTypeChange,
  onSubjectChange,
  onTenseChange,
}) => {
  const getCellClass = (isActive: boolean) =>
    `relative group flex items-center justify-center aspect-square text-3xl font-bold cursor-pointer transition-all border-4 rounded-xl select-none w-24 h-24 shadow-sm ${
      isActive
        ? 'bg-yellow-400 border-orange-500 text-gray-900 scale-105 shadow-md z-10'
        : 'bg-yellow-200 border-yellow-300 text-gray-700 hover:bg-yellow-300'
    }`;

  const renderTooltip = (text: string) => (
    <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-20">
      {text}
    </span>
  );

  const renderSubjectContent = (targetSubject: Subject, label: string) => {
      if (targetSubject === 'first_s') return '1';
      if (targetSubject === 'first_p') return '11';
      if (targetSubject === 'second') return '2';
      if (targetSubject === 'third_s') return '3';
      if (targetSubject === 'third_p') return '33';
      return label; 
  };

  const RowContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex items-center bg-teal-100 p-4 rounded-2xl w-full max-w-xl shadow-inner border border-teal-200">
        <div className="w-24 font-bold text-teal-800 text-sm mr-4 shrink-0 text-right pr-4 border-r-2 border-teal-300">
            {title}
        </div>
        <div className="flex space-x-4 grow justify-center">
            {children}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {/* Row 1: Sentence Type */}
      <RowContainer title="文の種類">
          <div
            className={getCellClass(sentenceType === 'negative')}
            onClick={() => onSentenceTypeChange('negative')}
          >
            X
            {renderTooltip('否定文')}
          </div>
          <div
            className={getCellClass(sentenceType === 'positive')}
            onClick={() => onSentenceTypeChange('positive')}
          >
            O
            {renderTooltip('肯定文')}
          </div>
          <div
            className={getCellClass(sentenceType === 'question')}
            onClick={() => onSentenceTypeChange('question')}
          >
            ?
            {renderTooltip('疑問文')}
          </div>
      </RowContainer>

      {/* Row 2: Subject */}
      <RowContainer title="主語">
          <div
            className={getCellClass(subject === 'second')}
            onClick={() => onSubjectChange('second')}
          >
            2
            {renderTooltip('二人称')}
          </div>
          <div
            className={getCellClass(subject === 'first_s' || subject === 'first_p')}
            onClick={() => onSubjectChange(subject === 'first_s' ? 'first_p' : 'first_s')}
          >
            {renderSubjectContent(subject === 'first_s' ? 'first_s' : 'first_p', '1 / 11')}
            {renderTooltip('一人称')}
          </div>
          <div
            className={getCellClass(subject === 'third_s' || subject === 'third_p')}
             onClick={() => onSubjectChange(subject === 'third_s' ? 'third_p' : 'third_s')}
          >
            {renderSubjectContent(subject === 'third_s' ? 'third_s' : 'third_p', '3 / 33')}
            {renderTooltip('三人称')}
          </div>
      </RowContainer>
      
      {/* Row 3: Tense */}
      <RowContainer title="時制">
          <div
            className={getCellClass(tense === 'past')}
            onClick={() => onTenseChange('past')}
          >
            &#8617;
            {renderTooltip('過去形')}
          </div>
          <div
            className={getCellClass(tense === 'present')}
            onClick={() => onTenseChange('present')}
          >
            O
            {renderTooltip('現在形')}
          </div>
          <div
            className={getCellClass(tense === 'future')}
            onClick={() => onTenseChange('future')}
          >
            &#8618;
            {renderTooltip('未来形')}
          </div>
      </RowContainer>
    </div>
  );
};
