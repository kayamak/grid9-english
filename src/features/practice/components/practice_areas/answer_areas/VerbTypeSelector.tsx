import React from 'react';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';
import { useBattleStore } from '../../../hooks/useBattleStore';

export const VerbTypeSelector: React.FC = () => {
  const { activeTab, isAdmin, isQuestMode, timeLeft } = usePracticeStore();
  const { handleTabChange } = usePracticeActions();
  const { monsterState } = useBattleStore();

  const disabled = (isQuestMode && timeLeft === 0) || monsterState === 'defeated';

  return (
    <div
      className={`flex space-x-2 relative z-10 -mb-1 ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}
    >
      <button
        onClick={() => handleTabChange('do')}
        disabled={disabled}
        className={`px-6 py-2 border-t-4 border-l-4 border-r-4 rounded-t-lg font-normal text-lg transition-all shadow-lg ${
          activeTab === 'do'
            ? 'bg-[#001da0] border-[#ffd700] text-white brightness-125'
            : 'bg-[#000840] border-white/20 text-white/40 hover:text-white hover:border-white/40'
        }`}
      >
        Doどうし
      </button>
      <button
        onClick={() => handleTabChange('be')}
        disabled={disabled}
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
          onClick={() => handleTabChange('admin')}
          disabled={disabled}
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
