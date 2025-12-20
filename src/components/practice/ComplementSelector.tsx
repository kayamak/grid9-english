import React from 'react';
import { BeComplement, FiveSentencePattern } from '@/domain/models/practice/types';

interface ComplementSelectorProps {
  selectedComplement: BeComplement;
  onChange: (complement: BeComplement) => void;
  pattern: FiveSentencePattern;
  disabled?: boolean;
}

// Adverbial phrases for SV pattern (location/state)
const SV_ADVERBIAL_OPTIONS: { value: BeComplement; label: string }[] = [
  { value: 'here', label: 'here (ここに)' },
  { value: 'there', label: 'there (そこに)' },
  { value: 'at home', label: 'at home (家に)' },
  { value: 'at school', label: 'at school (学校に)' },
  { value: 'in the park', label: 'in the park (公園に)' },
  { value: 'in Tokyo', label: 'in Tokyo (東京に)' },
  { value: 'upstairs', label: 'upstairs (上の階に)' },
  { value: 'downstairs', label: 'downstairs (下の階に)' },
];

// Complements for SVC pattern (nouns and adjectives)
const SVC_COMPLEMENT_OPTIONS: { value: BeComplement; label: string }[] = [
  { value: 'something', label: 'something (何か)' },
  // Nouns
  { value: 'carpenter', label: 'carpenter (大工)' },
  { value: 'hairdresser', label: 'hairdresser (美容師)' },
  { value: 'nurse', label: 'nurse (看護師)' },
  { value: 'teacher', label: 'teacher (先生)' },
  { value: 'chef', label: 'chef (シェフ)' },
  { value: 'farmer', label: 'farmer (農家)' },
  { value: 'photographer', label: 'photographer (写真家)' },
  // Adjectives
  { value: 'happy', label: 'happy (幸せ)' },
  { value: 'sleepy', label: 'sleepy (眠い)' },
  { value: 'angry', label: 'angry (怒った)' },
  { value: 'tired', label: 'tired (疲れた)' },
  { value: 'fine', label: 'fine (元気)' },
];

export const ComplementSelector: React.FC<ComplementSelectorProps> = ({ 
  selectedComplement, 
  onChange, 
  pattern,
  disabled 
}) => {
  // Choose options based on pattern
  const options = pattern === 'SV' ? SV_ADVERBIAL_OPTIONS : SVC_COMPLEMENT_OPTIONS;
  
  // Auto-select first option if current selection is not in the list
  React.useEffect(() => {
    const isCurrentSelectionValid = options.some(option => option.value === selectedComplement);
    if (!isCurrentSelectionValid && options.length > 0) {
      onChange(options[0].value);
    }
  }, [pattern, selectedComplement, onChange, options]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">
        {pattern === 'SV' ? '場所・状態' : '補語'}
      </label>
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
