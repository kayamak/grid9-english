import React from 'react';
import { FiveSentencePattern } from '@/domain/practice/types';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

const ALL_PATTERN_OPTIONS: { value: FiveSentencePattern; label: string }[] = [
  { value: 'SV', label: 'SV' },
  { value: 'SVC', label: 'SVC' },
  { value: 'SVO', label: 'SVO' },
];

export const FiveSentencePatternSelector: React.FC = () => {
  const { state } = usePracticeStore();
  const { handleFiveSentencePatternChange } = usePracticeActions();

  const { verbType } = state;
  const selectedPattern =
    state.fiveSentencePattern || (verbType === 'do' ? 'SVO' : 'SV');

  // Filter pattern options based on verb type
  const patternOptions =
    verbType === 'be'
      ? ALL_PATTERN_OPTIONS.filter(
          (opt) => opt.value === 'SV' || opt.value === 'SVC'
        )
      : verbType === 'do'
        ? ALL_PATTERN_OPTIONS.filter(
            (opt) => opt.value === 'SV' || opt.value === 'SVO'
          )
        : ALL_PATTERN_OPTIONS;

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="five-sentence-pattern"
        className="text-white font-normal whitespace-nowrap"
      >
        ぶんけい
      </label>
      <div className="relative w-auto">
        <select
          id="five-sentence-pattern"
          value={selectedPattern}
          onChange={(e) =>
            handleFiveSentencePatternChange(
              e.target.value as FiveSentencePattern
            )
          }
          className="dq-button !p-2 !pr-8 appearance-none"
        >
          {patternOptions.map((option) => (
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
