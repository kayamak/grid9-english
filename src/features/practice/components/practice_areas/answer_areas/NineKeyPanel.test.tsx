import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NineKeyPanel } from './NineKeyPanel';
import React from 'react';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';

// Mock the hooks
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');

describe('NineKeyPanel', () => {
  const mockState = {
    sentenceType: 'positive',
    subject: 'first_s',
    tense: 'present',
  };

  const mockActions = {
    handleSentenceTypeChange: vi.fn(),
    handleSubjectChange: vi.fn(),
    handleTenseChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePracticeStore).mockReturnValue({
      state: mockState,
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);
    vi.mocked(usePracticeActions).mockReturnValue(
      mockActions as unknown as ReturnType<typeof usePracticeActions>
    );
  });

  it('renders correctly with default state', () => {
    render(<NineKeyPanel />);

    // Check if rows are rendered
    expect(screen.getByText('しゅるい')).toBeDefined();
    expect(screen.getByText('しゅご')).toBeDefined();
    expect(screen.getByText('じせい')).toBeDefined();

    // Check if expected buttons are present
    expect(screen.getAllByText('O')).toHaveLength(2); // One for positive, one for present
    expect(screen.getByText('X')).toBeDefined();
    expect(screen.getByText('?')).toBeDefined();
  });

  it('calls handleSentenceTypeChange when a sentence type cell is clicked', () => {
    render(<NineKeyPanel />);
    const negativeBtn = screen.getByText('X');
    fireEvent.click(negativeBtn);
    expect(mockActions.handleSentenceTypeChange).toHaveBeenCalledWith(
      'negative'
    );
  });

  it('calls handleSubjectChange when a subject cell is clicked', () => {
    render(<NineKeyPanel />);
    // Current subject is first_s, clicking middle cell in row 2 should trigger first_p logic
    // (The component calls handleSubjectChange(subject === 'first_s' ? 'first_p' : 'first_s'))
    const firstPersonBtn = screen.getByText('1');
    fireEvent.click(firstPersonBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('first_p');
  });

  it('calls handleTenseChange when a tense cell is clicked', () => {
    render(<NineKeyPanel />);
    const pastBtn = screen.getByText('↩');
    fireEvent.click(pastBtn);
    expect(mockActions.handleTenseChange).toHaveBeenCalledWith('past');
  });

  it('calls handleTenseChange for future tense', () => {
    render(<NineKeyPanel />);
    const futureBtn = screen.getByText('↪');
    fireEvent.click(futureBtn);
    expect(mockActions.handleTenseChange).toHaveBeenCalledWith('future');
  });

  it('toggles second person subject correctly', () => {
    // Current state is second Person
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { ...mockState, subject: 'second' },
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { rerender } = render(<NineKeyPanel />);
    const secondPersonBtn = screen.getByText('2');
    fireEvent.click(secondPersonBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('second_p');

    // Test reverse: second_p -> second
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { ...mockState, subject: 'second_p' },
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    rerender(<NineKeyPanel />);
    const secondPersonPluralBtn = screen.getByText('22');
    fireEvent.click(secondPersonPluralBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('second');
  });

  it('toggles third person subject correctly', () => {
    // Current state is third Person
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { ...mockState, subject: 'third_s' },
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    const { rerender } = render(<NineKeyPanel />);
    const thirdPersonBtn = screen.getByText('3');
    fireEvent.click(thirdPersonBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('third_p');

    // Test reverse: third_p -> third_s
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { ...mockState, subject: 'third_p' },
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    rerender(<NineKeyPanel />);
    const thirdPersonPluralBtn = screen.getByText('33');
    fireEvent.click(thirdPersonPluralBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('third_s');
  });

  it('toggles first person subject correctly (plural back to singular)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      state: { ...mockState, subject: 'first_p' },
      isOnboardingMode: false,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<NineKeyPanel />);
    const firstPersonPluralBtn = screen.getByText('11');
    fireEvent.click(firstPersonPluralBtn);
    expect(mockActions.handleSubjectChange).toHaveBeenCalledWith('first_s');
  });
});
