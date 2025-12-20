import React from 'react';
import { NumberForm } from '@/domain/models/practice/types';

interface NumberFormSelectorProps {
  selectedNumberForm: NumberForm;
  onChange: (numberForm: NumberForm) => void;
  disabled?: boolean;
}

const NUMBER_FORM_OPTIONS: { value: NumberForm; label: string }[] = [
  { value: 'none', label: '不可算' },
  { value: 'a', label: 'a' },
  { value: 'an', label: 'an' },
  { value: 'plural', label: '複数' },
  { value: 'the', label: 'the' },
];

export const NumberFormSelector: React.FC<NumberFormSelectorProps> = ({ 
  selectedNumberForm, 
  onChange, 
  disabled 
}) => {
  return (
    <div className="relative inline-block">
      <select
        value={selectedNumberForm}
        onChange={(e) => onChange(e.target.value as NumberForm)}
        disabled={disabled}
        className="block appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 font-handwriting text-lg disabled:opacity-50 disabled:bg-gray-100 min-w-0"
      >
        {NUMBER_FORM_OPTIONS.map((option) => (
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
