import React, { useEffect, useMemo } from 'react';
import {
  Verb,
  VerbType,
  FiveSentencePattern,
  Word,
} from '@/domain/practice/types';

interface VerbSelectorProps {
  verbType: VerbType;
  selectedVerb: Verb;
  onChange: (verb: Verb) => void;
  verbWords: Word[];
  fiveSentencePattern?: FiveSentencePattern;
  disabled?: boolean;
}

export const VerbSelector: React.FC<VerbSelectorProps> = ({
  verbType,
  selectedVerb,
  onChange,
  verbWords,
  fiveSentencePattern,
  disabled,
}) => {
  const options = useMemo(() => {
    const filtered = verbWords.filter((vw) => {
      // If be, technically we don't show selector but let's be safe
      if (verbType === 'be') return vw.value === 'be';

      // For 'do' verbs, ignore 'be'
      if (vw.value === 'be') return false;

      if (fiveSentencePattern) {
        return vw.sentencePattern === fiveSentencePattern;
      }
      return true;
    });

    return filtered
      .map((vw) => ({
        value: vw.value as Verb,
        label: vw.label,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [verbWords, verbType, fiveSentencePattern]);

  // Auto-select first option if current selection is not in filtered list
  useEffect(() => {
    if (
      options.length > 0 &&
      !options.some((opt) => opt.value === selectedVerb)
    ) {
      onChange(options[0].value);
    }
  }, [options, selectedVerb, onChange]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-white font-normal whitespace-nowrap">どうし</label>
      <div className="relative flex-1">
        <select
          value={selectedVerb}
          onChange={(e) => onChange(e.target.value as Verb)}
          disabled={disabled}
          className="dq-button !p-2 !pr-8 w-full appearance-none disabled:opacity-30"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
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
