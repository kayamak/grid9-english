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
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, transition, ...props }: { children?: React.ReactNode, animate?: Record<string, unknown>, transition?: Record<string, unknown> }) => (
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
    vi.mocked(usePracticeStore).mockReturnValue(mockStore as unknown as ReturnType<typeof usePracticeStore>);
    vi.mocked(useBattleStore).mockReturnValue(mockBattleStore as unknown as ReturnType<typeof useBattleStore>);
    vi.mocked(usePracticeDerivedState).mockReturnValue(mockDerivedState as unknown as ReturnType<typeof usePracticeDerivedState>);
  });

  it('モンスターの画像が正しく表示されること', () => {
    render(<VerbArea attackDistance={100} />);
    const monsterImg = screen.getByAltText('Monster');
    expect(monsterImg.getAttribute('src')).toBe('mocked-asset/monster.png');
  });

  it('モンスターがダメージ状態の時にアニメーションが設定されること', () => {
    vi.mocked(useBattleStore).mockReturnValue({
      monsterState: 'damaged',
    } as unknown as ReturnType<typeof useBattleStore>);
    render(<VerbArea attackDistance={100} />);
    
    const monsterContainer = screen.getByAltText('Monster').closest('div[data-animate]');
    const animate = JSON.parse(monsterContainer?.getAttribute('data-animate') || '{}');
    
    expect(animate.x).toEqual([0, 5, -5, 5, 0]);
    expect(animate.filter.some((f: string) => f.includes('brightness(1.5)'))).toBe(true);
  });

  it('モンスターが攻撃状態の時にアニメーションが設定されること', () => {
    vi.mocked(useBattleStore).mockReturnValue({
      monsterState: 'attack',
    } as unknown as ReturnType<typeof useBattleStore>);
    render(<VerbArea attackDistance={100} />);
    
    const monsterContainer = screen.getByAltText('Monster').closest('div[data-animate]');
    const animate = JSON.parse(monsterContainer?.getAttribute('data-animate') || '{}');
    
    expect(animate.x).toEqual([0, -100, 0]);
  });
});
