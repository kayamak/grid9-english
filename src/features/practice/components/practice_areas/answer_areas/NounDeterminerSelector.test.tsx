import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  NounDeterminerSelector,
  NOUN_DETERMINER_OPTIONS,
  SVC_COMPLEMENT_OPTIONS,
} from './NounDeterminerSelector';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

// Mock dependencies
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

describe('NounDeterminerSelector', () => {
  const mockHandleNumberFormChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePracticeActions).mockReturnValue({
      handleNumberFormChange: mockHandleNumberFormChange,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders correctly with default options (isAdjective=false)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { numberForm: 'a' },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<NounDeterminerSelector />);

    expect(screen.getByRole('combobox')).toBeDefined();
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(NOUN_DETERMINER_OPTIONS.length);
    expect(options[0].textContent).toBe('無形'); // 'none'
  });

  it('renders correct options when isAdjective=true', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { numberForm: 'a' },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<NounDeterminerSelector isAdjective={true} />);

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(SVC_COMPLEMENT_OPTIONS.length); // Includes adjective option
    expect(options[options.length - 1].textContent).toBe('属性'); // 'adjective'
  });

  it('calls handleNumberFormChange on change', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { numberForm: 'a' },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<NounDeterminerSelector />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'the' },
    });
    expect(mockHandleNumberFormChange).toHaveBeenCalledWith('the');
  });

  it('is disabled when loading', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { numberForm: 'a' },
      isLoadingWords: true,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<NounDeterminerSelector />);
    expect(screen.getByRole('combobox')).toHaveProperty('disabled', true);
  });
});
