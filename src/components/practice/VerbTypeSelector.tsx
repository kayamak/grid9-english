import React from 'react';
import { VerbType } from '@/domain/models/practice/types';

interface VerbTypeSelectorProps {
  selectedVerb: VerbType;
  onChange: (verb: VerbType) => void;
}

export const VerbTypeSelector: React.FC<VerbTypeSelectorProps> = ({ selectedVerb, onChange }) => {
  return (
    <div className="flex space-x-1 pl-8 relative z-10 bottom-[-2px]"> 
       {/* bottom-[-2px] ensures tabs overlap the page slightly to look connected */}
      <button
        onClick={() => onChange('do')}
        className={`px-8 py-3 rounded-t-2xl font-handwriting text-xl font-bold transition-all border-t-2 border-l-2 border-r-2 ${
          selectedVerb === 'do'
            ? 'bg-blue-600 border-blue-700 text-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] translate-y-[2px]' 
            : 'bg-gray-200 border-gray-300 text-gray-500 hover:bg-gray-300 mt-2 shadow-inner'
        }`}
      >
        Do Verbs
      </button>
      <button
        onClick={() => onChange('be')}
        className={`px-8 py-3 rounded-t-2xl font-handwriting text-xl font-bold transition-all border-t-2 border-l-2 border-r-2 ${
          selectedVerb === 'be'
            ? 'bg-blue-600 border-blue-700 text-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] translate-y-[2px]' 
            : 'bg-gray-200 border-gray-300 text-gray-500 hover:bg-gray-300 mt-2 shadow-inner'
        }`}
      >
        Be Verbs
      </button>
    </div>
  );
};
