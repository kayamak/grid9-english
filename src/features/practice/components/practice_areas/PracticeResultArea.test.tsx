import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PracticeResultArea } from './PracticeResultArea';
import { usePracticeStore } from '../../hooks/usePracticeStore';

// Mock dependencies
vi.mock('../../hooks/usePracticeStore');

// Mock child components
vi.mock('./result_areas/ResultLevelUpArea', () => ({
  ResultLevelUpArea: () => <div data-testid="level-up">Level Up Area</div>,
}));
vi.mock('./result_areas/ResultFailedArea', () => ({
  ResultFailedArea: () => <div data-testid="failed">Failed Area</div>,
}));
vi.mock('./result_areas/ResultAllClearedArea', () => ({
  ResultAllClearedArea: () => (
    <div data-testid="all-cleared">All Cleared Area</div>
  ),
}));

describe('PracticeResultArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when status is playing', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { status: 'playing' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { container } = render(<PracticeResultArea />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when status is undefined', () => {
    // Logic: questStatus = questSession?.status || 'playing'
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: undefined,
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { container } = render(<PracticeResultArea />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ResultLevelUpArea when status is result', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { status: 'result' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<PracticeResultArea />);
    expect(screen.getByTestId('level-up')).toBeDefined();
    expect(screen.queryByTestId('failed')).toBeNull();
  });

  it('renders ResultFailedArea when status is failed', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { status: 'failed' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<PracticeResultArea />);
    expect(screen.getByTestId('failed')).toBeDefined();
  });

  it('renders ResultAllClearedArea when status is all-cleared', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      questSession: { status: 'all-cleared' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<PracticeResultArea />);
    expect(screen.getByTestId('all-cleared')).toBeDefined();
  });
});
