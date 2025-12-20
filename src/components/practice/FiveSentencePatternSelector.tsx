import React from 'react';
import { FiveSentencePattern } from '@/domain/models/practice/types';

interface FiveSentencePatternSelectorProps {
  selectedPattern: FiveSentencePattern;
  onChange: (pattern: FiveSentencePattern) => void;
}

export const FiveSentencePatternSelector: React.FC<FiveSentencePatternSelectorProps> = ({ 
  selectedPattern, 
  onChange 
}) => {
  return (
    <div className="mb-6">
      <fieldset className="border border-gray-300 rounded-lg p-2 bg-white/50">
        <legend className="text-sm font-semibold text-gray-700 px-2">文型</legend>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors">
            <input
              type="radio"
              name="sentencePattern"
              value="SV"
              checked={selectedPattern === 'SV'}
              onChange={() => onChange('SV')}
              className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
            />
            <span className={`font-handwriting text-lg ${selectedPattern === 'SV' ? 'font-bold text-green-700' : 'text-gray-600'}`}>
              SV
            </span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition-colors">
            <input
              type="radio"
              name="sentencePattern"
              value="SVO"
              checked={selectedPattern === 'SVO'}
              onChange={() => onChange('SVO')}
              className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
            />
            <span className={`font-handwriting text-lg ${selectedPattern === 'SVO' ? 'font-bold text-green-700' : 'text-gray-600'}`}>
              SVO
            </span>
          </label>
        </div>
      </fieldset>
    </div>
  );
};
