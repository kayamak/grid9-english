import React from 'react';
import { Verb, VerbType, FiveSentencePattern } from '@/domain/models/practice/types';

interface VerbSelectorProps {
  verbType: VerbType;
  selectedVerb: Verb;
  onChange: (verb: Verb) => void;
  fiveSentencePattern?: FiveSentencePattern;
  disabled?: boolean;
}

const DO_VERB_SV_OPTIONS: { value: Verb; label: string }[] = [
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

const DO_VERB_SVO_OPTIONS: { value: Verb; label: string }[] = [
  { value: 'do', label: 'do (する)' },
  { value: 'have', label: 'have (持つ)' },
  { value: 'know', label: 'know (知る)' },
  { value: 'get', label: 'get (獲得する)' },
  { value: 'make', label: 'make (作る)' },
  { value: 'catch', label: 'catch (捕まえる)' },
  { value: 'love', label: 'love (愛する)' },
  { value: 'like', label: 'like (気に入る)' },
  { value: 'take', label: 'take (取る、持っていく)' },
  { value: 'see', label: 'see (見える)' },
  { value: 'play', label: 'play (遊ぶ、演奏する)' },
  { value: 'sing', label: 'sing (歌う)' },
  { value: 'study', label: 'study (勉強する)' },
  { value: 'teach', label: 'teach (教える)' },
  { value: 'read', label: 'read (読む)' },
  { value: 'write', label: 'write (書く)' },
  { value: 'drink', label: 'drink (飲む)' },
  { value: 'eat', label: 'eat (食べる)' },
  { value: 'cook', label: 'cook (料理する)' },
  { value: 'drive', label: 'drive (運転する)' },
];

const BE_VERB_OPTIONS: { value: Verb; label: string }[] = [
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

export const VerbSelector: React.FC<VerbSelectorProps> = ({ verbType, selectedVerb, onChange, fiveSentencePattern, disabled }) => {
  // Determine which options to show based on verb type and sentence pattern
  let options: { value: Verb; label: string }[];
  
  if (verbType === 'be') {
    options = BE_VERB_OPTIONS;
  } else {
    // For Do verbs, filter by sentence pattern
    if (fiveSentencePattern === 'SV') {
      options = DO_VERB_SV_OPTIONS;
    } else {
      // Default to SVO for other patterns (SVO, SVC, SVOO, SVOC)
      options = DO_VERB_SVO_OPTIONS;
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">動詞</label>
      <div className="relative flex-1">
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
    </div>
  );
};
