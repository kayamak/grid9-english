import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VerbTypeSelector } from './VerbTypeSelector';
import { usePracticeStore } from '../../../hooks/usePracticeStore';
import { usePracticeActions } from '../../../hooks/usePracticeActions';
import { useBattleStore } from '../../../hooks/useBattleStore';

// Mock dependencies
vi.mock('../../../hooks/usePracticeStore');
vi.mock('../../../hooks/usePracticeActions');
vi.mock('../../../hooks/useBattleStore');

describe('VerbTypeSelector', () => {
  const mockHandleTabChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePracticeActions).mockReturnValue({
      handleTabChange: mockHandleTabChange,
    } as unknown as ReturnType<typeof usePracticeActions>);

    // Default mock for battle store
    vi.mocked(useBattleStore).mockReturnValue({
      monsterState: 'idle',
    } as unknown as ReturnType<typeof useBattleStore>);
  });

  it('renders correctly', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: false,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    expect(screen.getByText('Doどうし')).toBeDefined();
    expect(screen.getByText('Beどうし')).toBeDefined();
    // Admin should not be visible
    expect(screen.queryByText('管理')).toBeNull();
  });

  it('shows admin tab when isAdmin is true', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: true,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    expect(screen.getByText('管理')).toBeDefined();
  });

  it('calls handleTabChange on click', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: false,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    fireEvent.click(screen.getByText('Beどうし'));
    expect(mockHandleTabChange).toHaveBeenCalledWith('be');
  });

  it('applies active styles correctly', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'be',
      isAdmin: false,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    const beButton = screen.getByText('Beどうし');
    const doButton = screen.getByText('Doどうし');

    // Simple class check logic
    expect(beButton.className).toContain('brightness-125');
    expect(doButton.className).not.toContain('brightness-125');
  });

  it('disables buttons when in quest mode and time over', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: false,
      isQuestMode: true,
      timeLeft: 0,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    // Check wrapper opacity class or button disabled attribute
    const wrapper = screen.getByText('Doどうし').closest('div');
    expect(wrapper?.className).toContain('opacity-50');

    expect(screen.getByText('Doどうし')).toHaveProperty('disabled', true);
    expect(screen.getByText('Beどうし')).toHaveProperty('disabled', true);
  });
  it('disables buttons when battle is won (monster is defeated)', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: false,
      isQuestMode: true,
      timeLeft: 30, // Time is remaining
    } as unknown as ReturnType<typeof usePracticeStore>);

    vi.mocked(useBattleStore).mockReturnValue({
      monsterState: 'defeated',
    } as unknown as ReturnType<typeof useBattleStore>);

    render(<VerbTypeSelector />);

    // Check wrapper opacity class or button disabled attribute
    const wrapper = screen.getByText('Doどうし').closest('div');
    expect(wrapper?.className).toContain('opacity-50');

    expect(screen.getByText('Doどうし')).toHaveProperty('disabled', true);
    expect(screen.getByText('Beどうし')).toHaveProperty('disabled', true);
  });

  it('calls handleTabChange with "do" when Do button is clicked', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'be',
      isAdmin: false,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    fireEvent.click(screen.getByText('Doどうし'));
    expect(mockHandleTabChange).toHaveBeenCalledWith('do');
  });

  it('calls handleTabChange with "admin" when Admin button is clicked', () => {
    vi.mocked(usePracticeStore).mockReturnValue({
      activeTab: 'do',
      isAdmin: true,
      isQuestMode: false,
      timeLeft: 10,
    } as unknown as ReturnType<typeof usePracticeStore>);

    render(<VerbTypeSelector />);

    fireEvent.click(screen.getByText('管理'));
    expect(mockHandleTabChange).toHaveBeenCalledWith('admin');
  });
});
