import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FiveSentencePatternSelector } from './FiveSentencePatternSelector';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

// Mock dependencies
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

describe('FiveSentencePatternSelector', () => {
  const mockHandleFiveSentencePatternChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePracticeActions).mockReturnValue({
      handleFiveSentencePatternChange: mockHandleFiveSentencePatternChange,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders correctly', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { verbType: 'do', fiveSentencePattern: 'SV' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<FiveSentencePatternSelector />);

    expect(screen.getByLabelText('ぶんけい')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('shows correct options for "do" verb type', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { verbType: 'do', fiveSentencePattern: 'SV' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<FiveSentencePatternSelector />);

    const options = screen.getAllByRole('option');
    const values = options.map((o) => (o as HTMLOptionElement).value);

    expect(values).toEqual(['SV', 'SVO']);
    expect(values).not.toContain('SVC');
  });

  it('shows correct options for "be" verb type', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { verbType: 'be', fiveSentencePattern: 'SVC' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<FiveSentencePatternSelector />);

    const options = screen.getAllByRole('option');
    const values = options.map((o) => (o as HTMLOptionElement).value);

    expect(values).toEqual(['SV', 'SVC']);
    expect(values).not.toContain('SVO');
  });

  it('handles default pattern selection if none specified', () => {
    // If state.fiveSentencePattern is undefined, uses logic: (verbType === 'do' ? 'SVO' : 'SV')
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { verbType: 'do' }, // fiveSentencePattern undefined
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<FiveSentencePatternSelector />);

    // This is controlled component, so value prop on select should be 'SVO'
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('SVO');
  });

  it('calls handler on change', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { verbType: 'do', fiveSentencePattern: 'SV' },
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<FiveSentencePatternSelector />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'SVO' },
    });
    expect(mockHandleFiveSentencePatternChange).toHaveBeenCalledWith('SVO');
  });
});
