import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleOverlayArea } from './BattleOverlayArea';
import React from 'react';

// Mock child components
vi.mock('./overlay_areas/OverlayTimerBar', () => ({
  OverlayTimerBar: () => <div data-testid="timer-bar">TimerBar</div>,
}));
vi.mock('./overlay_areas/OverlayTopUiArea', () => ({
  OverlayTopUiArea: () => <div data-testid="top-ui">TopUi</div>,
}));
vi.mock('./overlay_areas/OverlayBottomButtonArea', () => ({
  OverlayBottomButtonArea: () => <div data-testid="bottom-buttons">BottomButtons</div>,
}));

describe('BattleOverlayArea', () => {
  it('renders all overlay sub-areas', () => {
    render(<BattleOverlayArea />);
    
    expect(screen.getByTestId('timer-bar')).toBeDefined();
    expect(screen.getByTestId('top-ui')).toBeDefined();
    expect(screen.getByTestId('bottom-buttons')).toBeDefined();
  });
});
