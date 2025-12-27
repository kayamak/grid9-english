import React, { useEffect, useState } from 'react';
import { Verb, VerbType, FiveSentencePattern } from '@/domain/practice/types';
import { VerbWord } from '@/types/verbWord';

interface VerbSelectorProps {
  verbType: VerbType;
  selectedVerb: Verb;
  onChange: (verb: Verb) => void;
  fiveSentencePattern?: FiveSentencePattern;
  disabled?: boolean;
}

export const VerbSelector: React.FC<VerbSelectorProps> = ({ 
  verbType, 
  selectedVerb, 
  onChange, 
  fiveSentencePattern, 
  disabled 
}) => {
  const [options, setOptions] = useState<{ value: Verb; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerbWords = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.append('verbType', verbType);
        
        if (verbType === 'do' && fiveSentencePattern) {
          params.append('sentencePattern', fiveSentencePattern);
        }

        const response = await fetch(`/api/verb-words?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch verb words');
        }

        const verbWords: VerbWord[] = await response.json();
        
        const transformedOptions = verbWords
          .map(vw => ({
            value: vw.value as Verb,
            label: vw.label,
          }))
          .sort((a, b) => a.value.localeCompare(b.value));
        
        setOptions(transformedOptions);
      } catch (err) {
        console.error('Error fetching verb words:', err);
        setError('動詞データの読み込みに失敗しました');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerbWords();
  }, [verbType, fiveSentencePattern]); // Only re-fetch when criteria change

  // Auto-select first option if current selection is not in filtered list
  useEffect(() => {
    if (!loading && options.length > 0 && !options.some(opt => opt.value === selectedVerb)) {
      onChange(options[0].value);
    }
  }, [loading, options, selectedVerb, onChange]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-white font-normal whitespace-nowrap">どうし</label>
      <div className="relative flex-1">
        <select
          value={selectedVerb}
          onChange={(e) => onChange(e.target.value as Verb)}
          disabled={disabled || loading}
          className="dq-button !p-2 !pr-8 w-full appearance-none disabled:opacity-30"
        >
          {loading ? (
            <option>読み込み中...</option>
          ) : error ? (
            <option>{error}</option>
          ) : (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          )}
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
