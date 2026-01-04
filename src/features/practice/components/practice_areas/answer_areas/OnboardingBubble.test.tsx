import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingBubble } from './OnboardingBubble';
import React from 'react';

describe('OnboardingBubble', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders message correctly', () => {
    render(<OnboardingBubble message="Test Message" onClick={mockOnClick} />);
    expect(screen.getByText('Test Message')).toBeDefined();
    expect(screen.getByText('(クリックしてすすむ)')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    render(<OnboardingBubble message="Test Message" onClick={mockOnClick} />);

    // Bubble is clickable
    const bubble = screen.getByText('Test Message');
    fireEvent.click(bubble);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('applies styling for varying positions (top)', () => {
    const { container } = render(
      <OnboardingBubble message="Top" onClick={mockOnClick} position="top" />
    );
    // Check if style prop is applied correctly
    // Since style is inline, we can check computed style or inline calls for bubble
    // But testing implementation details of 'style' prop might be brittle.
    // However, the component sets `style={{...}}`.
    // We can check the wrapper element (motion.div).
    const bubbleWrapper = container.firstChild as HTMLElement;
    expect(bubbleWrapper.style.bottom).toBe('100%');
    expect(bubbleWrapper.style.marginTop).toBe(''); // Should be marginBottom
    expect(bubbleWrapper.style.marginBottom).toBe('12px');
  });

  it('applies styling for varying positions (bottom)', () => {
    const { container } = render(
      <OnboardingBubble
        message="Bottom"
        onClick={mockOnClick}
        position="bottom"
      />
    );
    const bubbleWrapper = container.firstChild as HTMLElement;
    expect(bubbleWrapper.style.top).toBe('100%');
    expect(bubbleWrapper.style.marginTop).toBe('12px');
  });

  it('applies styling for varying positions (left)', () => {
    const { container } = render(
      <OnboardingBubble message="Left" onClick={mockOnClick} position="left" />
    );
    const bubbleWrapper = container.firstChild as HTMLElement;
    expect(bubbleWrapper.style.right).toBe('100%');
    expect(bubbleWrapper.style.marginRight).toBe('12px');
  });

  it('applies styling for varying positions (right)', () => {
    const { container } = render(
      <OnboardingBubble
        message="Right"
        onClick={mockOnClick}
        position="right"
      />
    );
    const bubbleWrapper = container.firstChild as HTMLElement;
    expect(bubbleWrapper.style.left).toBe('100%');
    expect(bubbleWrapper.style.marginLeft).toBe('12px');
  });
});
