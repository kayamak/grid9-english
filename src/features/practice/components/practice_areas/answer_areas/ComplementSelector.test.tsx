import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComplementSelector } from './ComplementSelector';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

// Mock the hooks
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

describe('ComplementSelector', () => {
  const mockHandleBeComplementChange = vi.fn();
  const mockWords = {
    nouns: [
      { value: 'cat', label: 'ねこ', numberForm: 'single' },
      { value: 'cats', label: 'ねこたち', numberForm: 'plural' },
      { value: 'something', label: 'なにか', numberForm: 'single' },
    ],
    adjectives: [
      { value: 'happy', label: 'しあわせ', numberForm: 'adjective' },
    ],
    adverbs: [{ value: 'here', label: 'ここ', numberForm: 'adverb' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeActions).mockReturnValue({
      handleBeComplementChange: mockHandleBeComplementChange,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders options correctly for SVC pattern (single noun)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'cat',
        fiveSentencePattern: 'SVC',
        numberForm: 'single',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    // Should show nouns matching numberForm
    expect(screen.getByText('ねこ')).toBeDefined();
    // plural is filtered out
    expect(screen.queryByText('ねこたち')).toBeNull();
    // adjective is filtered out because numberForm is 'single'
    expect(screen.queryByText('しあわせ')).toBeNull();
  });

  it('renders options correctly for SVC pattern (plural noun)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'cats',
        fiveSentencePattern: 'SVC',
        numberForm: 'plural',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    expect(screen.getByText('ねこたち')).toBeDefined();
    expect(screen.queryByText('ねこ')).toBeNull();
    expect(screen.queryByText('しあわせ')).toBeNull();
  });

  it('renders options correctly for SVC pattern (adjective)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'happy',
        fiveSentencePattern: 'SVC',
        numberForm: 'adjective',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    expect(screen.getByText('しあわせ')).toBeDefined();
    expect(screen.queryByText('ねこ')).toBeNull();
    expect(screen.queryByText('ねこたち')).toBeNull();
  });

  it('renders options correctly for SV pattern (adverbs)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'here',
        fiveSentencePattern: 'SV',
        numberForm: 'single',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    expect(screen.getByText('ここ')).toBeDefined();
    expect(screen.queryByText('ねこ')).toBeNull();
    expect(screen.queryByText('しあわせ')).toBeNull();
  });

  it('calls handleBeComplementChange when selection changes', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'cat',
        fiveSentencePattern: 'SVC',
        numberForm: 'single',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    const select = screen.getByRole('combobox');
    // 'something' has numberForm: 'single', so it should be available
    fireEvent.change(select, { target: { value: 'something' } });

    expect(mockHandleBeComplementChange).toHaveBeenCalledWith('something');
  });

  it('disables the select when loading', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'cat',
        fiveSentencePattern: 'SVC',
        numberForm: 'single',
      },
      words: mockWords,
      isLoadingWords: true, // Loading
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ComplementSelector />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('renders children correctly', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: {
        beComplement: 'cat',
        fiveSentencePattern: 'SVC',
        numberForm: 'single',
      },
      words: mockWords,
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(
      <ComplementSelector>
        <div data-testid="child">Child</div>
      </ComplementSelector>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });
});
