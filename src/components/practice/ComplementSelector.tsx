import React from 'react';
import { BeComplement, FiveSentencePattern, NumberForm } from '@/domain/models/practice/types';

interface NounWord {
  id: string;
  value: string;
  label: string;
  numberForm: string;
  sortOrder: number;
}

interface AdjectiveWord {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
}

interface AdverbWord {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
}

interface ComplementSelectorProps {
  selectedComplement: BeComplement;
  onChange: (complement: BeComplement) => void;
  pattern: FiveSentencePattern;
  numberForm?: NumberForm;
  disabled?: boolean;
  children?: React.ReactNode;
  nounWords: NounWord[];
  adjectiveWords: AdjectiveWord[];
  adverbWords: AdverbWord[];
}



export const ComplementSelector: React.FC<ComplementSelectorProps> = ({ 
  selectedComplement, 
  onChange, 
  pattern,
  numberForm,
  disabled,
  children,
  nounWords,
  adjectiveWords,
  adverbWords
}) => {
  // Choose options based on pattern
  let options: { value: BeComplement; label: string }[];
  
  if (pattern === 'SV') {
    options = adverbWords.map(word => ({
      value: word.value as BeComplement,
      label: word.label
    }));
  } else {
    // For SVC pattern, combine nouns and adjectives
    // Convert nounWords to the format we need
    const nounOptions = nounWords.map(noun => ({
      value: noun.value as BeComplement,
      label: noun.label,
      numberForm: noun.numberForm as NumberForm
    }));

    // Convert adjectiveWords to the format we need
    const adjectiveOptions = adjectiveWords.map(adj => ({
      value: adj.value as BeComplement,
      label: adj.label,
      numberForm: 'adjective' as const
    }));
    
    // Combine all SVC options (nouns from database + adjectives)
    const allSVCOptions = [...nounOptions, ...adjectiveOptions];
    
    // Filter by numberForm if provided
    if (numberForm) {
      // When 'the', possessive determiners, or 'no_article' are selected, show all complements except 'something'
      const showAllExceptSomething = ['the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'].includes(numberForm);
      options = showAllExceptSomething
        ? allSVCOptions.filter(option => option.value !== 'something')
        : allSVCOptions.filter(option => option.numberForm === numberForm);
    } else {
      options = allSVCOptions;
    }
  }
  
  // Auto-select first option if current selection is not in the list
  React.useEffect(() => {
    const isCurrentSelectionValid = options.some(option => option.value === selectedComplement);
    if (!isCurrentSelectionValid && options.length > 0) {
      onChange(options[0].value);
    }
  }, [pattern, numberForm, selectedComplement, onChange, options]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">
        {pattern === 'SV' ? '場所・状態' : '補語'}
      </label>
      {children}
      <div className="relative flex-1">
        <select
          value={selectedComplement}
          onChange={(e) => onChange(e.target.value as BeComplement)}
          disabled={disabled}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg disabled:opacity-50 disabled:bg-gray-100"
        >
          {options.map((option) => (
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
