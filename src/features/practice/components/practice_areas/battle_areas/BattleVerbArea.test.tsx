import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerbArea } from './BattleVerbArea';
import React from 'react';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { useBattleStore } from '../../../hooks/useBattleStore';
import { usePracticeDerivedState } from '../../../hooks/usePracticeDerivedState';

// Mock the hooks
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/useBattleStore');
vi.mock('../../../hooks/usePracticeDerivedState');

// Mock getAssetPath
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => `mocked-asset${path}`,
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, transition, ...props }: any) => (
      <div 
        {...props} 
        data-animate={JSON.stringify(animate)} 
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
    ),
  },
}));

describe('VerbArea', () => {
  const mockDerivedState = {
    battleImages: {
      monsterImg: '/monster.png',
      monsterScale: 1,
    },
    monsterOpacity: 1,
  };

  const mockBattleStore = {
    monsterState: 'idle',
  };

  const mockStore = {
    currentDrillIndex: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePracticeStore as any).mockReturnValue(mockStore);
    (useBattleStore as any).mockReturnValue(mockBattleStore);
    (usePracticeDerivedState as any).mockReturnValue(mockDerivedState);
  });

  it('モンスターの画像が正しく表示されること', () => {
    render(<VerbArea attackDistance={100} />);
    const monsterImg = screen.getByAltText('Monster');
    expect(monsterImg.getAttribute('src')).toBe('mocked-asset/monster.png');
  });

  it('モンスターがダメージ状態の時にアニメーションが設定されること', () => {
    (useBattleStore as any).mockReturnValue({
      monsterState: 'damaged',
    });
    render(<VerbArea attackDistance={100} />);
    
    const monsterContainer = screen.getByAltText('Monster').closest('div[data-animate]');
    const animate = JSON.parse(monsterContainer?.getAttribute('data-animate') || '{}');
    
    expect(animate.x).toEqual([0, 5, -5, 5, 0]);
    expect(animate.filter.some((f: string) => f.includes('brightness(1.5)'))).toBe(true);
  });

  it('モンスターが攻撃状態の時にアニメーションが設定されること', () => {
    (useBattleStore as any).mockReturnValue({
      monsterState: 'attack',
    });
    render(<VerbArea attackDistance={100} />);
    
    const monsterContainer = screen.getByAltText('Monster').closest('div[data-animate]');
    const animate = JSON.parse(monsterContainer?.getAttribute('data-animate') || '{}');
    
    expect(animate.x).toEqual([0, -100, 0]);
  });
});
