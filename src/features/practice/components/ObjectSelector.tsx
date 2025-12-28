import React from 'react';
import { Object, NumberForm, Word } from '@/domain/practice/types';

interface ObjectSelectorProps {
  selectedObject: Object;
  onChange: (object: Object) => void;
  numberForm: NumberForm;
  disabled?: boolean;
  children?: React.ReactNode;
  nounWords: Word[];
}

export const ObjectSelector: React.FC<ObjectSelectorProps> = ({ 
  selectedObject, 
  onChange, 
  numberForm,
  disabled,
  children,
  nounWords
}) => {
  const filteredOptions = React.useMemo(() => {
    const showAllExceptSomething = ['the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'].includes(numberForm);
    return (showAllExceptSomething
      ? nounWords.filter(option => option.value !== 'something')
      : nounWords.filter(option => option.numberForm === numberForm))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [numberForm, nounWords]);
  
  // Auto-select first option if current selection is not in filtered list
  React.useEffect(() => {
    const isCurrentSelectionValid = filteredOptions.some(option => option.value === selectedObject);
    if (!isCurrentSelectionValid && filteredOptions.length > 0) {
      onChange(filteredOptions[0].value as Object);
    }
  }, [selectedObject, onChange, filteredOptions]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-white font-normal whitespace-nowrap">たいしょう</label>
      {children}
      <div className="relative flex-1">
        <select
          value={selectedObject}
          onChange={(e) => onChange(e.target.value as Object)}
          disabled={disabled}
          className="dq-button !p-2 !pr-8 w-full appearance-none disabled:opacity-30"
        >
          {filteredOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
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
