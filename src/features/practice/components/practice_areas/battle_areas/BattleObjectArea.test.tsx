import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleObjectArea } from './BattleObjectArea';
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

describe('BattleObjectArea', () => {
  const mockDerivedState = {
    battleImages: {
      itemImg: '/item.png',
    },
  };

  const mockBattleStore = {
    monsterState: 'idle',
  };

  const mockStore = {
    state: { object: 'something' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePracticeStore as any).mockReturnValue(mockStore);
    (useBattleStore as any).mockReturnValue(mockBattleStore);
    (usePracticeDerivedState as any).mockReturnValue(mockDerivedState);
  });

  it('アイテムの画像が正しく表示されること', () => {
    render(<BattleObjectArea attackDistance={100} />);
    const itemImg = screen.getByAltText('Item');
    expect(itemImg.getAttribute('src')).toBe('mocked-asset/item.png');
  });

  it('itemImgがない場合は何も表示されないこと', () => {
    (usePracticeDerivedState as any).mockReturnValue({
      battleImages: { itemImg: null },
    });
    render(<BattleObjectArea attackDistance={100} />);
    expect(screen.queryByAltText('Item')).toBeNull();
  });

  it('モンスターがダメージ状態の時にアニメーションが設定されること', () => {
    (useBattleStore as any).mockReturnValue({
      monsterState: 'damaged',
    });
    render(<BattleObjectArea attackDistance={100} />);
    
    const itemContainer = screen.getByAltText('Item').closest('div[data-animate]');
    const animate = JSON.parse(itemContainer?.getAttribute('data-animate') || '{}');
    
    expect(animate.x).toEqual([0, 5, -5, 5, 0]);
  });
});
