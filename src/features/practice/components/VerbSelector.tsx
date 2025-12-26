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
        // Build query parameters
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
        
        // Transform to options format and sort alphabetically
        const transformedOptions = verbWords
          .map(vw => ({
            value: vw.value as Verb,
            label: vw.label,
          }))
          .sort((a, b) => a.value.localeCompare(b.value));
        
        setOptions(transformedOptions);
        
        // If current selected verb is not in the new options, select the first one
        if (transformedOptions.length > 0 && 
            !transformedOptions.some(opt => opt.value === selectedVerb)) {
          onChange(transformedOptions[0].value);
        }
      } catch (err) {
        console.error('Error fetching verb words:', err);
        setError('動詞データの読み込みに失敗しました');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerbWords();
  }, [verbType, fiveSentencePattern, onChange, selectedVerb]); // Re-fetch when verbType, sentence pattern, or dependencies change

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">動詞</label>
      <div className="relative flex-1">
        <select
          value={selectedVerb}
          onChange={(e) => onChange(e.target.value as Verb)}
          disabled={disabled || loading}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg disabled:opacity-50 disabled:bg-gray-100"
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
