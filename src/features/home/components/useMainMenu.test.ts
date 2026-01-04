import { renderHook, act } from '@testing-library/react';
import { useMainMenu, MENU_DATA } from './useMainMenu';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useMainMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear cookies
    document.cookie =
      'playerLevel=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => useMainMenu());
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.selectedSubMenu).toBeNull();
    expect(result.current.descMessage).toBe('コマンドを　えらんでください。');
    expect(result.current.bottomMessage).toBe(
      'ぼうけんの　じゅんびは　いいかな？'
    );
    expect(result.current.currentLevel).toBe(1);
    expect(result.current.showClearLevelMenu).toBe(false);
  });

  it('handleCategoryClickでカテゴリが選択され、メッセージが更新されること', () => {
    const { result } = renderHook(() => useMainMenu());
    const categoryKey = 'たたかう';

    act(() => {
      result.current.handleCategoryClick(categoryKey);
    });

    expect(result.current.selectedCategory).toBe(categoryKey);
    expect(result.current.descMessage).toBe(
      MENU_DATA[categoryKey].descriptions[0]
    );
  });

  it('handleItemClickでhrefがある場合、ページ遷移すること', () => {
    const { result } = renderHook(() => useMainMenu());
    const item = {
      label: 'Test Item',
      href: '/test-path',
      descriptions: ['Test Description'],
    };

    act(() => {
      result.current.handleItemClick(item);
    });

    expect(mockPush).toHaveBeenCalledWith('/test-path');
  });

  it('handleItemClickでサブメニューがある場合、サブメニューが選択されること', () => {
    const { result } = renderHook(() => useMainMenu());
    const item = {
      label: 'Parent Item',
      descriptions: ['Parent Description'],
      items: [
        {
          label: 'Child Item',
          descriptions: ['Child Description'],
          href: '/child',
        },
      ],
    };

    act(() => {
      result.current.handleItemClick(item);
    });

    expect(result.current.selectedSubMenu).toBe(item);
    expect(result.current.descMessage).toBe('Parent Description');
  });

  it('handleBackでカテゴリ選択から初期状態に戻ること', () => {
    const { result } = renderHook(() => useMainMenu());

    act(() => {
      result.current.handleCategoryClick('たたかう');
    });

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.descMessage).toBe('コマンドを　えらんでください。');
  });

  it('handleBackでサブメニュー選択からカテゴリ選択に戻ること', () => {
    const { result } = renderHook(() => useMainMenu());
    const categoryKey = 'たたかう';
    const subMenuItem = {
      label: 'Sub Menu',
      descriptions: ['Sub Desc'],
      items: [],
    };

    act(() => {
      result.current.handleCategoryClick(categoryKey);
    });

    // Simulate selecting a submenu (though handling it via handleItemClick is more realistic,
    // manually setting state might not be possible directly without exposing setters,
    // but handleItemClick logic covers it.
    // Note: handleItemClick needs an item with .items to setSelectedSubMenu.
    // Let's create a fake item structure that resembles real usage if needed, or trust handleItemClick logic.
    // But since useMainMenu logic for handleItemClick handles `if (item.items)`, we need such an item.
    // The MENU_DATA structure might handle this. Let's make a mock item.

    act(() => {
      result.current.handleItemClick(subMenuItem);
    });

    expect(result.current.selectedSubMenu).toBe(subMenuItem);

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.selectedSubMenu).toBeNull();
    expect(result.current.selectedCategory).toBe(categoryKey);
    expect(result.current.descMessage).toBe(
      MENU_DATA[categoryKey].descriptions[0]
    );
  });

  it('handleDescClickでメッセージが変わること', () => {
    const { result } = renderHook(() => useMainMenu());

    act(() => {
      result.current.handleDescClick();
    });

    // OPERATION_MESSAGES are cycled.
    // Initial OP index 0 -> message[0] returned, index becomes 1.
    // wait, handleDescClick calls updateOperation.
    // updateOperation returns OPERATION_MESSAGES[opIndex % length] THEN increments opIndex.
    // So first click gets index 0 message.
    expect(result.current.descMessage).toEqual(
      expect.stringContaining('マウスで　コマンドを　えらび')
    );
  });

  it('handleBottomClickでメッセージが変わること', () => {
    const { result } = renderHook(() => useMainMenu());

    act(() => {
      result.current.handleBottomClick();
    });

    expect(result.current.bottomMessage).toEqual(
      expect.stringContaining('マウスで　コマンドを　えらび')
    );
  });

  it('handleActionHoverでホバー時にメッセージが変わること', () => {
    const { result } = renderHook(() => useMainMenu());
    const item = { label: 'Hover Item', descriptions: ['Hover Desc'] };

    act(() => {
      result.current.handleActionHover(true, item);
    });

    expect(result.current.descMessage).toBe('Hover Desc');
  });

  it('handleActionHoverでホバー解除時にカテゴリの説明に戻ること', () => {
    const { result } = renderHook(() => useMainMenu());
    const categoryKey = 'たたかう';

    act(() => {
      result.current.handleCategoryClick(categoryKey);
    });

    act(() => {
      result.current.handleActionHover(true, {
        label: 'Temp',
        descriptions: ['Temp'],
      });
    });

    act(() => {
      result.current.handleActionHover(false);
    });

    expect(result.current.descMessage).toBe(
      MENU_DATA[categoryKey].descriptions[0]
    );
  });

  it('handleClearLevelでレベルがリセットされること', () => {
    const { result } = renderHook(() => useMainMenu());

    act(() => {
      result.current.handleClearLevel();
    });

    expect(result.current.currentLevel).toBe(1);
    expect(result.current.showClearLevelMenu).toBe(false);
    expect(document.cookie).toContain('playerLevel=1');
    expect(result.current.bottomMessage).toBe('レベルを　しょきか　しました。');
  });

  it('クッキーからレベルをロードすること', async () => {
    document.cookie = 'playerLevel=5';
    const { result } = renderHook(() => useMainMenu());

    // Effect logic is void Promise.resolve().then(loadLevel);
    // We need to wait for the effect to run.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.currentLevel).toBe(5);
  });
});
