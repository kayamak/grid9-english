import React from 'react';
import {
  BeComplement,
  FiveSentencePattern,
  NumberForm,
} from '@/domain/practice/types';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

interface ComplementSelectorProps {
  children?: React.ReactNode;
}

export const ComplementSelector: React.FC<ComplementSelectorProps> = ({
  children,
}) => {
  const { state, words, isLoadingWords } = usePracticeStore();
  const { handleBeComplementChange } = usePracticeActions();
  
  const {
    beComplement: selectedComplement,
    fiveSentencePattern: pattern,
    numberForm,
  } = state;
  const {
    nouns: nounWords,
    adjectives: adjectiveWords,
    adverbs: adverbWords,
  } = words;
  const disabled = isLoadingWords;

  const options = React.useMemo(() => {
    let opts: { value: BeComplement; label: string; numberForm?: NumberForm }[];

    if (pattern === 'SV') {
      opts = adverbWords.map((word) => ({
        value: word.value as BeComplement,
        label: word.label,
      }));
    } else {
      const nounOptions = nounWords.map((noun) => ({
        value: noun.value as BeComplement,
        label: noun.label,
        numberForm: noun.numberForm as NumberForm,
      }));

      const adjectiveOptions = adjectiveWords.map((adj) => ({
        value: adj.value as BeComplement,
        label: adj.label,
        numberForm: 'adjective' as const,
      }));

      const allSVCOptions = [...nounOptions, ...adjectiveOptions];

      if (numberForm) {
        const showAllExceptSomething = [
          'the',
          'my',
          'our',
          'your',
          'his',
          'her',
          'their',
          'no_article',
        ].includes(numberForm);
        opts = showAllExceptSomething
          ? allSVCOptions.filter((option) => option.value !== 'something')
          : allSVCOptions.filter((option) => option.numberForm === numberForm);
      } else {
        opts = allSVCOptions;
      }
    }

    return [...opts].sort((a, b) => a.value.localeCompare(b.value));
  }, [pattern, numberForm, nounWords, adjectiveWords, adverbWords]);

  // Auto-select first option if current selection is not in the list
  React.useEffect(() => {
    const isCurrentSelectionValid = options.some(
      (option) => option.value === selectedComplement
    );
    if (!isCurrentSelectionValid && options.length > 0) {
      handleBeComplementChange(options[0].value);
    }
  }, [selectedComplement, handleBeComplementChange, options]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-white font-normal whitespace-nowrap">
        {pattern === 'SV' ? 'ば場所・じょう状態' : 'ほご'}
      </label>
      {children}
      <div className="relative flex-1">
        <select
          value={selectedComplement || ''}
          onChange={(e) => handleBeComplementChange(e.target.value as BeComplement)}
          disabled={disabled}
          className="dq-button !py-2 !px-2 appearance-none !pr-8 w-full disabled:opacity-30"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-blue-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
