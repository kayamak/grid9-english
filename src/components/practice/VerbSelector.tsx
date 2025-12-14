import React from 'react';
import { Verb, VerbType } from '@/domain/models/practice/types';

interface VerbSelectorProps {
  verbType: VerbType;
  selectedVerb: Verb;
  onChange: (verb: Verb) => void;
  disabled?: boolean;
}

const DO_VERB_OPTIONS: { value: Verb; label: string }[] = [
  { value: 'do', label: 'do (する)' },
  { value: 'live', label: 'live (住む)' },
  { value: 'go', label: 'go (行く)' },
  { value: 'arrive', label: 'arrive (着く)' },
  { value: 'talk', label: 'talk (話す)' },
  { value: 'run', label: 'run (走る)' },
  { value: 'walk', label: 'walk (歩く)' },
  { value: 'smile', label: 'smile (笑う)' },
  { value: 'laugh', label: 'laugh (笑う)' },
];

const BE_VERB_OPTIONS: { value: Verb; label: string }[] = [
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

export const VerbSelector: React.FC<VerbSelectorProps> = ({ verbType, selectedVerb, onChange, disabled }) => {
  const options = verbType === 'do' ? DO_VERB_OPTIONS : BE_VERB_OPTIONS;

  return (
    <div className="relative">
      <select
        value={selectedVerb}
        onChange={(e) => onChange(e.target.value as Verb)}
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
  );
};
