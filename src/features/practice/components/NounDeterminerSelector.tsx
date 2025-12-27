import React from 'react';
import { NumberForm } from '@/domain/practice/types';

interface NounDeterminerSelectorProps {
  selectedNumberForm: NumberForm;
  onChange: (numberForm: NumberForm) => void;
  disabled?: boolean;
  isAdjective?: boolean;
}

export type NounDeterminer =
  | 'none'        // 不可算
  | 'a'
  | 'an'
  | 'the'
  | 'plural'
  | 'no_article'
  | 'my'
  | 'our'
  | 'your'
  | 'his'
  | 'her'
  | 'their';


// SVOの目的語（名詞）
export const NOUN_DETERMINER_OPTIONS: {
  value: NounDeterminer;
  label: string;
}[] = [
  { value: 'none', label: '不可算' },
  { value: 'a', label: 'a' },
  { value: 'an', label: 'an' },
  { value: 'plural', label: '複数' },
  { value: 'the', label: 'the' },
  { value: 'my', label: 'my' },
  { value: 'our', label: 'our' },
  { value: 'your', label: 'your' },
  { value: 'his', label: 'his' },
  { value: 'her', label: 'her' },
  { value: 'their', label: 'their' },
  { value: 'no_article', label: '無し' },
];

// SVCの補語（名詞+形容詞）
export const SVC_COMPLEMENT_OPTIONS = [
  ...NOUN_DETERMINER_OPTIONS,
  { value: 'adjective', label: '形容詞' },
];

export const NounDeterminerSelector: React.FC<NounDeterminerSelectorProps> = ({ 
  selectedNumberForm, 
  onChange, 
  disabled,
  isAdjective,
}) => {
  return (
    <div className="relative inline-block">
      <select
        value={selectedNumberForm}
        onChange={(e) => onChange(e.target.value as NumberForm)}
        disabled={disabled}
        className="dq-button !py-2 !px-2 appearance-none !pr-8 min-w-0 disabled:opacity-30"
      >
        {(isAdjective ? SVC_COMPLEMENT_OPTIONS : NOUN_DETERMINER_OPTIONS).map((option) => (
          <option key={option.value} value={option.value} className="bg-blue-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
