import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ObjectSelector } from './ObjectSelector';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

// Mock dependencies
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

describe('ObjectSelector', () => {
  const mockHandleObjectChange = vi.fn();

  const mockNounWords = [
    { id: '1', value: 'something', label: 'something', numberForm: 'a' },
    { id: '2', value: 'apple', label: 'apple', numberForm: 'a' },
    { id: '3', value: 'books', label: 'books', numberForm: 'plural' },
    { id: '4', value: 'dog', label: 'dog', numberForm: 'a' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePracticeActions).mockReturnValue({
      handleObjectChange: mockHandleObjectChange,
    } as unknown as ReturnType<typeof usePracticeActions>);
  });

  it('renders correctly with labels', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    expect(screen.getByLabelText('もくてきご')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('filters options based on numberForm (singular)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    const options = screen.getAllByRole('option');
    const values = options.map((o) => (o as HTMLOptionElement).value);

    // Should filtering 'something' out?
    // Logic: showAllExceptSomething is true for 'a' ?
    // 'a' is in ['the', 'my', ..., 'no_article'] ? NO. 'a' is NOT in that list.
    // Wait, let's check code:
    // includes(numberForm || 'a') -> 'a' IS NOT in the list.
    // Array: 'the', 'my', 'our', 'your', 'his', 'her', 'their', 'no_article'.
    // So 'a' -> false.
    // showAllExceptSomething = false.
    // filter: option.numberForm === numberForm ('a')

    // mockNounWords logic: apple (a), dog (a), something (a).
    // So expected: something, apple, dog. (Sorted by value? apple, dog, something?)
    // Actually code has: .sort((a, b) => a.value.localeCompare(b.value));

    expect(values).toEqual(
      expect.arrayContaining(['apple', 'dog', 'something'])
    );
    expect(values).not.toContain('books');
  });

  it('filters options based on numberForm (possessive/the)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'the' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    // 'the' IS in the list -> showAllExceptSomething = true.
    // filter: value !== 'something'.
    // mockNounWords: apple, books, dog.

    const options = screen.getAllByRole('option');
    const values = options.map((o) => (o as HTMLOptionElement).value);

    expect(values).toEqual(expect.arrayContaining(['apple', 'books', 'dog']));
    expect(values).not.toContain('something');
  });

  it('calls handleObjectChange when selection changes', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'dog' },
    });
    expect(mockHandleObjectChange).toHaveBeenCalledWith('dog');
  });

  it('auto-selects first valid option if current selection is invalid', () => {
    // Current selection 'books' (plural) but numberForm is 'a'.
    // Valid options are [apple, dog, something] (filtered by 'a').
    // 'books' is not valid.

    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'books', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    // useEffect should trigger
    // sort order: apple, dog, something. First is apple.
    expect(mockHandleObjectChange).toHaveBeenCalledWith('apple');
  });

  it('does not auto-select if current selection is valid', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);

    // Should not be called again (initial render call aside? No, mock calls)
    // Actually we check calls.
    expect(mockHandleObjectChange).not.toHaveBeenCalled();
  });

  it('renders children passed to it', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(
      <ObjectSelector>
        <div data-testid="child">Child</div>
      </ObjectSelector>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('is disabled when loading words', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { object: 'apple', numberForm: 'a' },
      words: { nouns: mockNounWords },
      isLoadingWords: true, // disabled
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<ObjectSelector />);
    expect(screen.getByRole('combobox')).toHaveProperty('disabled', true);
  });
});
