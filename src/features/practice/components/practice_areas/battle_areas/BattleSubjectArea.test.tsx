import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleSubjectArea } from './BattleSubjectArea';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { useBattleStore } from '../../../hooks/useBattleStore';
import { usePracticeDerivedState } from '../../../hooks/usePracticeDerivedState';

// Mocks
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/useBattleStore');
vi.mock('../../../hooks/usePracticeDerivedState');
vi.mock('@/lib/assets', () => ({
  getAssetPath: (path: string) => path,
}));
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe('BattleSubjectArea', () => {
  const mockStore = {
    state: { subject: 'first_s' },
    currentDrillIndex: 0,
  };
  const mockBattleStore = {
    heroAction: 'idle',
  };
  const mockDerivedState = {
    battleImages: { subjectImg: 'hero.png' },
    heroOpacity: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeStore).mockReturnValue(mockStore as unknown as ReturnType<typeof usePracticeStore>);
    vi.mocked(useBattleStore).mockReturnValue(mockBattleStore as unknown as ReturnType<typeof useBattleStore>);
    vi.mocked(usePracticeDerivedState).mockReturnValue(mockDerivedState as unknown as ReturnType<typeof usePracticeDerivedState>);
  });

  it('単数形の主語の場合、画像が1つ表示されること', () => {
    render(<BattleSubjectArea attackDistance={100} />);
    
    const images = screen.getAllByRole('img');
    // メイン画像のみ
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('src')).toBe('hero.png');
    expect(images[0].getAttribute('alt')).toBe('Hero');
  });

  it('複数形の主語の場合、画像が2つ表示されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_p' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<BattleSubjectArea attackDistance={100} />);
    
    const images = screen.getAllByRole('img');
    // サブ画像 + メイン画像
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute('alt')).toBe('Hero Second');
    expect(images[1].getAttribute('alt')).toBe('Hero');
  });

  it('主語に応じて画像が反転されるクラスが付与されること', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      ...mockStore,
      state: { subject: 'first_s' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<BattleSubjectArea attackDistance={100} />);
    const image = screen.getByAltText('Hero');
    expect(image.className).toContain('scale-x-[-1]');
  });
  
  it('heroActionがdamagedの場合でも描画されること', () => {
     vi.mocked(useBattleStore).mockReturnValue({
        heroAction: 'damaged',
     } as unknown as ReturnType<typeof useBattleStore>);
     
     render(<BattleSubjectArea attackDistance={100} />);
     const image = screen.getByAltText('Hero');
     expect(image).toBeDefined();
  });
  
  it('heroActionがdefeatedの場合でも描画されること', () => {
     vi.mocked(useBattleStore).mockReturnValue({
        heroAction: 'defeated',
     } as unknown as ReturnType<typeof useBattleStore>);

     render(<BattleSubjectArea attackDistance={100} />);
     const image = screen.getByAltText('Hero');
     expect(image).toBeDefined();
  });
});
