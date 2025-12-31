import React from 'react';
import { VerbType } from '@/domain/practice/types';

interface VerbTypeSelectorProps {
  activeTab: VerbType | 'admin';
  onChange: (tab: VerbType | 'admin') => void;
  isAdmin?: boolean;
}

export const VerbTypeSelector: React.FC<VerbTypeSelectorProps> = ({ activeTab, onChange, isAdmin }) => {
  return (
    <div className="flex space-x-2 relative z-10 -mb-1"> 
      <button
        onClick={() => onChange('do')}
        className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
          activeTab === 'do'
            ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125' 
            : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
        }`}
      >
        Doどうし
      </button>
      <button
        onClick={() => onChange('be')}
        className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
          activeTab === 'be'
            ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125' 
            : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
        }`}
      >
        Beどうし
      </button>
      {isAdmin && (
        <button
          onClick={() => onChange('admin')}
          className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
            activeTab === 'admin'
              ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125' 
              : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
          }`}
        >
          管理
        </button>
      )}
    </div>
  );
};
