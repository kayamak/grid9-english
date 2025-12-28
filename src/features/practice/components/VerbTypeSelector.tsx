import React from 'react';
import { VerbType } from '@/domain/practice/types';

interface VerbTypeSelectorProps {
  selectedVerb: VerbType;
  onChange: (verb: VerbType) => void;
}

export const VerbTypeSelector: React.FC<VerbTypeSelectorProps> = ({ selectedVerb, onChange }) => {
  return (
    <div className="flex space-x-2 relative z-10 -mb-1"> 
      <button
        onClick={() => onChange('do')}
        className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
          selectedVerb === 'do'
            ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125' 
            : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
        }`}
      >
        Do動詞
      </button>
      <button
        onClick={() => onChange('be')}
        className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
          selectedVerb === 'be'
            ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125' 
            : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
        }`}
      >
        Be動詞
      </button>
    </div>
  );
};
