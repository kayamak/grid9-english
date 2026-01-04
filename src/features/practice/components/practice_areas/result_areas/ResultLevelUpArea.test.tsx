import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultLevelUpArea } from './ResultLevelUpArea';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

// Mock Link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('ResultLevelUpArea', () => {
  const mockHandleLevelUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeActions).mockReturnValue({
      handleLevelUp: mockHandleLevelUp,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders level up message and next level info', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      currentLevel: 1,
      questSession: { correctCount: 9 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultLevelUpArea />);

    expect(screen.getByText('レベルアップ！')).toBeDefined();
    // Use regex for loose matching of stats
    expect(screen.getByText(/9\/10/)).toBeDefined();
    // "Lv 2" appears multiple times (info and button), so getAll is appropriate
    expect(screen.getAllByText(/Lv\s*2/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Lv\s*2\s*に\s*すすむ/)).toBeDefined();
  });

  it('renders default score 0 if questSession is missing', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      currentLevel: 1,
      questSession: undefined,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultLevelUpArea />);
    expect(screen.getByText(/0\/10/)).toBeDefined();
  });

  it('calls handleLevelUp when button is clicked', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      currentLevel: 1,
      questSession: { correctCount: 9 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultLevelUpArea />);

    fireEvent.click(screen.getByText(/Lv\s*2\s*に\s*すすむ/));
    expect(mockHandleLevelUp).toHaveBeenCalled();
  });

  it('renders link to return home', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      currentLevel: 1,
      questSession: { correctCount: 9 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultLevelUpArea />);

    const homeButton = screen.getByText('ホームへもどる');
    const link = homeButton.closest('a');
    expect(link?.getAttribute('href')).toBe('/');
  });
});
