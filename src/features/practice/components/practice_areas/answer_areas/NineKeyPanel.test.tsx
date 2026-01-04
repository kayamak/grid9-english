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
    (usePracticeStore as any).mockReturnValue({
      state: mockState,
      isOnboardingMode: false,
    });
    (usePracticeActions as any).mockReturnValue(mockActions);
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
    expect(mockActions.handleSentenceTypeChange).toHaveBeenCalledWith('negative');
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
});
