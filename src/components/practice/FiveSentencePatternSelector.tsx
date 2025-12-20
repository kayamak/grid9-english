import React from 'react';
import { FiveSentencePattern } from '@/domain/models/practice/types';

interface FiveSentencePatternSelectorProps {
  selectedPattern: FiveSentencePattern;
  onChange: (pattern: FiveSentencePattern) => void;
}

const PATTERN_OPTIONS: { value: FiveSentencePattern; label: string }[] = [
  { value: 'SV', label: 'SV' },
  { value: 'SVO', label: 'SVO' },
];

export const FiveSentencePatternSelector: React.FC<FiveSentencePatternSelectorProps> = ({ 
  selectedPattern, 
  onChange 
}) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">文型</label>
      <div className="relative flex-1">
        <select
          value={selectedPattern}
          onChange={(e) => onChange(e.target.value as FiveSentencePattern)}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg"
        >
          {PATTERN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
