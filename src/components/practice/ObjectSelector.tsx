import React from 'react';
import { Object, NumberForm } from '@/domain/models/practice/types';

interface ObjectSelectorProps {
  selectedObject: Object;
  onChange: (object: Object) => void;
  numberForm: NumberForm;
  disabled?: boolean;
  children?: React.ReactNode; // For NumberFormSelector
}

const OBJECT_OPTIONS: { value: Object; label: string; numberForm: NumberForm }[] = [
  { value: 'something', label: 'something (何か)', numberForm: 'none' },
  { value: 'dog', label: 'dog (犬)', numberForm: 'a' },
  { value: 'dogs', label: 'dogs (犬)', numberForm: 'plural' },
  { value: 'story', label: 'story (物語)', numberForm: 'a' },
  { value: 'stories', label: 'stories (物語)', numberForm: 'plural' },
  { value: 'soccer player', label: 'soccer player (サッカー選手)', numberForm: 'a' },
  { value: 'soccer players', label: 'soccer players (サッカー選手)', numberForm: 'plural' },
  { value: 'gold medal', label: 'gold medal (金メダル)', numberForm: 'a' },
  { value: 'gold medals', label: 'gold medals (金メダル)', numberForm: 'plural' },
  { value: 'passport', label: 'passport (パスポート)', numberForm: 'a' },
  { value: 'passports', label: 'passports (パスポート)', numberForm: 'plural' },
  { value: 'chair', label: 'chair (椅子)', numberForm: 'a' },
  { value: 'chairs', label: 'chairs (椅子)', numberForm: 'plural' },
  { value: 'butterfly', label: 'butterfly (蝶)', numberForm: 'a' },
  { value: 'butterflies', label: 'butterflies (蝶)', numberForm: 'plural' },
  { value: 'parents', label: 'parents (両親)', numberForm: 'plural' },
  { value: 'fruit', label: 'fruit (果物)', numberForm: 'a' },
  { value: 'fruits', label: 'fruits (果物)', numberForm: 'plural' },
  { value: 'key', label: 'key (鍵)', numberForm: 'a' },
  { value: 'keys', label: 'keys (鍵)', numberForm: 'plural' },
  { value: 'taxi', label: 'taxi (タクシー)', numberForm: 'a' },
  { value: 'taxis', label: 'taxis (タクシー)', numberForm: 'plural' },
  { value: 'airplane', label: 'airplane (飛行機)', numberForm: 'an' },
  { value: 'airplanes', label: 'airplanes (飛行機)', numberForm: 'plural' },
  { value: 'sound', label: 'sound (音)', numberForm: 'a' },
  { value: 'sounds', label: 'sounds (音)', numberForm: 'plural' },
  { value: 'soccer', label: 'soccer (サッカー)', numberForm: 'none' },
  { value: 'violin', label: 'violin (バイオリン)', numberForm: 'a' },
  { value: 'violins', label: 'violins (バイオリン)', numberForm: 'plural' },
  { value: 'song', label: 'song (歌)', numberForm: 'a' },
  { value: 'songs', label: 'songs (歌)', numberForm: 'plural' },
  { value: 'English', label: 'English (英語)', numberForm: 'none' },
  { value: 'newspaper', label: 'newspaper (新聞)', numberForm: 'a' },
  { value: 'newspapers', label: 'newspapers (新聞)', numberForm: 'plural' },
  { value: 'letter', label: 'letter (手紙)', numberForm: 'a' },
  { value: 'letters', label: 'letters (手紙)', numberForm: 'plural' },
  { value: 'coffee', label: 'coffee (コーヒー)', numberForm: 'none' },
  { value: 'pizza', label: 'pizza (ピザ)', numberForm: 'none' },
  { value: 'pizza', label: 'pizza (ピザ)', numberForm: 'a' },
  { value: 'pizzas', label: 'pizzas (ピザ)', numberForm: 'plural' },
  { value: 'dinner', label: 'dinner (夕食)', numberForm: 'none' },
  { value: 'car', label: 'car (車)', numberForm: 'a' },
  { value: 'cars', label: 'cars (車)', numberForm: 'plural' },
  { value: 'water', label: 'water (水)', numberForm: 'none' },
  { value: 'music', label: 'music (音楽)', numberForm: 'none' },
  { value: 'information', label: 'information (情報)', numberForm: 'none' },
  { value: 'advice', label: 'advice (助言)', numberForm: 'none' },
  { value: 'homework', label: 'homework (宿題)', numberForm: 'none' },
];

export const ObjectSelector: React.FC<ObjectSelectorProps> = ({ 
  selectedObject, 
  onChange, 
  numberForm,
  disabled,
  children 
}) => {
  // Filter options based on numberForm
  // When 'the', possessive determiners, or 'no_article' are selected, show all objects except 'something'
  // since these can be used with any noun (singular, plural, countable, uncountable)
  const showAllExceptSomething = ['the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'].includes(numberForm);
  const filteredOptions = showAllExceptSomething
    ? OBJECT_OPTIONS.filter(option => option.value !== 'something')
    : OBJECT_OPTIONS.filter(option => option.numberForm === numberForm);
  
  // Auto-select first option if current selection is not in filtered list
  React.useEffect(() => {
    const isCurrentSelectionValid = filteredOptions.some(option => option.value === selectedObject);
    if (!isCurrentSelectionValid && filteredOptions.length > 0) {
      onChange(filteredOptions[0].value);
    }
  }, [numberForm, selectedObject, onChange, filteredOptions]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">目的語</label>
      {children}
      <div className="relative flex-1">
        <select
          value={selectedObject}
          onChange={(e) => onChange(e.target.value as Object)}
          disabled={disabled}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg disabled:opacity-50 disabled:bg-gray-100"
        >
          {filteredOptions.map((option) => (
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
