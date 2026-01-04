import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultFailedArea } from './ResultFailedArea';
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

describe('ResultFailedArea', () => {
  const mockHandleRetryLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeActions).mockReturnValue({
      handleRetryLevel: mockHandleRetryLevel,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders failure message and score', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { correctCount: 5 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultFailedArea />);

    expect(screen.getByText('しっぱい！')).toBeDefined();
    expect(screen.getByText(/5\/10/)).toBeDefined();
    expect(screen.getByText(/きみの\s*せいせき/)).toBeDefined();
  });

  it('renders default score 0 if questSession is missing', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: undefined,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultFailedArea />);

    expect(screen.getByText(/0\/10/)).toBeDefined();
  });

  it('calls handleRetryLevel when retry button is clicked', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { correctCount: 5 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultFailedArea />);

    fireEvent.click(screen.getByText('さいちょうせん'));
    expect(mockHandleRetryLevel).toHaveBeenCalled();
  });

  it('renders link to give up', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { correctCount: 5 },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ResultFailedArea />);

    const giveUpButton = screen.getByText('あきらめる');
    const link = giveUpButton.closest('a');
    expect(link?.getAttribute('href')).toBe('/');
  });
});
