import React from 'react';
import { Object } from '@/domain/models/practice/types';

interface ObjectSelectorProps {
  selectedObject: Object;
  onChange: (object: Object) => void;
  disabled?: boolean;
}

const OBJECT_OPTIONS: { value: Object; label: string }[] = [
  { value: 'something', label: 'something (何か)' },
  { value: 'dog', label: 'dog (犬)' },
  { value: 'story', label: 'story (物語)' },
  { value: 'soccer player', label: 'soccer player (サッカー選手)' },
  { value: 'gold medal', label: 'gold medal (金メダル)' },
  { value: 'passport', label: 'passport (パスポート)' },
  { value: 'chair', label: 'chair (椅子)' },
  { value: 'butterfly', label: 'butterfly (蝶)' },
  { value: 'parents', label: 'parents (両親)' },
  { value: 'fruit', label: 'fruit (果物)' },
  { value: 'key', label: 'key (鍵)' },
  { value: 'taxi', label: 'taxi (タクシー)' },
  { value: 'airplay', label: 'airplay (空港)' },
  { value: 'sound', label: 'sound (音)' },
  { value: 'soccker', label: 'soccker (サッカー)' },
  { value: 'violin', label: 'violin (バイオリン)' },
  { value: 'song', label: 'song (歌)' },
  { value: 'English', label: 'English (英語)' },
  { value: 'newspaper', label: 'newspaper (新聞)' },
  { value: 'letter', label: 'letter (手紙)' },
  { value: 'coffee', label: 'coffee (コーヒー)' },
  { value: 'pizza', label: 'pizza (ピザ)' },
  { value: 'dinner', label: 'dinner (夕食)' },
  { value: 'car', label: 'car (車)' },
];

export const ObjectSelector: React.FC<ObjectSelectorProps> = ({ selectedObject, onChange, disabled }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">目的語</label>
      <div className="relative flex-1">
        <select
          value={selectedObject}
          onChange={(e) => onChange(e.target.value as Object)}
          disabled={disabled}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg disabled:opacity-50 disabled:bg-gray-100"
        >
          {OBJECT_OPTIONS.map((option) => (
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
