import React from 'react';
import { BeComplement, FiveSentencePattern, NumberForm } from '@/domain/models/practice/types';

interface ComplementSelectorProps {
  selectedComplement: BeComplement;
  onChange: (complement: BeComplement) => void;
  pattern: FiveSentencePattern;
  numberForm?: NumberForm;
  disabled?: boolean;
  children?: React.ReactNode; // For NumberFormSelector
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

// Complements for SVC pattern (nouns and adjectives) with numberForm metadata
const SVC_COMPLEMENT_OPTIONS: { value: BeComplement; label: string; numberForm: NumberForm }[] = [
  { value: 'something', label: 'something (何か)', numberForm: 'none' },
  // Nouns - All objects from ObjectSelector
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
  // Occupations
  { value: 'carpenter', label: 'carpenter (大工)', numberForm: 'a' },
  { value: 'hairdresser', label: 'hairdresser (美容師)', numberForm: 'a' },
  { value: 'nurse', label: 'nurse (看護師)', numberForm: 'a' },
  { value: 'teacher', label: 'teacher (先生)', numberForm: 'a' },
  { value: 'chef', label: 'chef (シェフ)', numberForm: 'a' },
  { value: 'farmer', label: 'farmer (農家)', numberForm: 'a' },
  { value: 'photographer', label: 'photographer (写真家)', numberForm: 'a' },
  // Adjectives
  { value: 'happy', label: 'happy (幸せ)', numberForm: 'adjective' },
  { value: 'sleepy', label: 'sleepy (眠い)', numberForm: 'adjective' },
  { value: 'angry', label: 'angry (怒った)', numberForm: 'adjective' },
  { value: 'tired', label: 'tired (疲れた)', numberForm: 'adjective' },
  { value: 'fine', label: 'fine (元気)', numberForm: 'adjective' },
];

export const ComplementSelector: React.FC<ComplementSelectorProps> = ({ 
  selectedComplement, 
  onChange, 
  pattern,
  numberForm,
  disabled,
  children
}) => {
  // Choose options based on pattern
  let options: { value: BeComplement; label: string }[];
  
  if (pattern === 'SV') {
    options = SV_ADVERBIAL_OPTIONS;
  } else {
    // For SVC pattern, filter by numberForm if provided
    if (numberForm) {
      // When 'the', possessive determiners, or 'no_article' are selected, show all complements except 'something'
      const showAllExceptSomething = ['the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'].includes(numberForm);
      options = showAllExceptSomething
        ? SVC_COMPLEMENT_OPTIONS.filter(option => option.value !== 'something')
        : SVC_COMPLEMENT_OPTIONS.filter(option => option.numberForm === numberForm);
    } else {
      options = SVC_COMPLEMENT_OPTIONS;
    }
  }
  
  // Auto-select first option if current selection is not in the list
  React.useEffect(() => {
    const isCurrentSelectionValid = options.some(option => option.value === selectedComplement);
    if (!isCurrentSelectionValid && options.length > 0) {
      onChange(options[0].value);
    }
  }, [pattern, numberForm, selectedComplement, onChange, options]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 font-medium whitespace-nowrap">
        {pattern === 'SV' ? '場所・状態' : '補語'}
      </label>
      {children}
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
