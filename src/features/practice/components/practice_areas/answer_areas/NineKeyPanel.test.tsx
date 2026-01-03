import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NineKeyPanel } from './NineKeyPanel';
import React from 'react';

describe('NineKeyPanel', () => {
  const defaultProps = {
    sentenceType: 'positive' as const,
    subject: 'first_s' as const,
    tense: 'present' as const,
    onSentenceTypeChange: vi.fn(),
    onSubjectChange: vi.fn(),
    onTenseChange: vi.fn(),
  };

  it('renders correctly with default props', () => {
    render(<NineKeyPanel {...defaultProps} />);
    
    // Check if rows are rendered
    expect(screen.getByText('しゅるい')).toBeDefined();
    expect(screen.getByText('しゅご')).toBeDefined();
    expect(screen.getByText('じせい')).toBeDefined();

    // Check if expected buttons are present
    expect(screen.getAllByText('O')).toHaveLength(2); // One for positive, one for present
    expect(screen.getByText('X')).toBeDefined();
    expect(screen.getByText('?')).toBeDefined();
  });

  it('calls onSentenceTypeChange when a sentence type cell is clicked', () => {
    render(<NineKeyPanel {...defaultProps} />);
    const negativeBtn = screen.getByText('X');
    fireEvent.click(negativeBtn);
    expect(defaultProps.onSentenceTypeChange).toHaveBeenCalledWith('negative');
  });

  it('calls onSubjectChange with rotation logic when a subject cell is clicked', () => {
    render(<NineKeyPanel {...defaultProps} />);
    // Current subject is first_s, clicking middle cell in row 2 should trigger first_p
    const firstPersonBtn = screen.getByText('1');
    fireEvent.click(firstPersonBtn);
    expect(defaultProps.onSubjectChange).toHaveBeenCalledWith('first_p');
  });

  it('calls onTenseChange when a tense cell is clicked', () => {
    render(<NineKeyPanel {...defaultProps} />);
    const pastBtn = screen.getByText('↩');
    fireEvent.click(pastBtn);
    expect(defaultProps.onTenseChange).toHaveBeenCalledWith('past');
  });
});
