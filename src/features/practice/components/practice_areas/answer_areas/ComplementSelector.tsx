import React from 'react';
import { BeComplement, FiveSentencePattern, NumberForm, Word } from '@/domain/practice/types';

interface ComplementSelectorProps {
  selectedComplement: BeComplement;
  onChange: (complement: BeComplement) => void;
  pattern: FiveSentencePattern;
  numberForm?: NumberForm;
  disabled?: boolean;
  children?: React.ReactNode;
  nounWords: Word[];
  adjectiveWords: Word[];
  adverbWords: Word[];
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
  const options = React.useMemo(() => {
    let opts: { value: BeComplement; label: string; numberForm?: NumberForm }[];
    
    if (pattern === 'SV') {
      opts = adverbWords.map(word => ({
        value: word.value as BeComplement,
        label: word.label
      }));
    } else {
      const nounOptions = nounWords.map(noun => ({
        value: noun.value as BeComplement,
        label: noun.label,
        numberForm: noun.numberForm as NumberForm
      }));

      const adjectiveOptions = adjectiveWords.map(adj => ({
        value: adj.value as BeComplement,
        label: adj.label,
        numberForm: 'adjective' as const
      }));
      
      const allSVCOptions = [...nounOptions, ...adjectiveOptions];
      
      if (numberForm) {
        const showAllExceptSomething = ['the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'].includes(numberForm);
        opts = showAllExceptSomething
          ? allSVCOptions.filter(option => option.value !== 'something')
          : allSVCOptions.filter(option => option.numberForm === numberForm);
      } else {
        opts = allSVCOptions;
      }
    }
    
    return [...opts].sort((a, b) => a.value.localeCompare(b.value));
  }, [pattern, numberForm, nounWords, adjectiveWords, adverbWords]);
  
  // Auto-select first option if current selection is not in the list
  React.useEffect(() => {
    const isCurrentSelectionValid = options.some(option => option.value === selectedComplement);
    if (!isCurrentSelectionValid && options.length > 0) {
      onChange(options[0].value);
    }
  }, [selectedComplement, onChange, options]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-white font-normal whitespace-nowrap">
        {pattern === 'SV' ? 'ばしょ・じょうたい' : 'ほご'}
      </label>
      {children}
      <div className="relative flex-1">
        <select
          value={selectedComplement}
          onChange={(e) => onChange(e.target.value as BeComplement)}
          disabled={disabled}
          className="dq-button !py-2 !px-2 appearance-none !pr-8 w-full disabled:opacity-30"
        >
          {options.map((option) => (
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
    </div>
  );
};
