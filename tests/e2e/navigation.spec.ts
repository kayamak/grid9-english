import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigate to Drill Quest (Quest Mode)', async ({ page }) => {
    await page.getByRole('button', { name: 'たたかう' }).click();
    await page.getByRole('button', { name: 'ドリルクエスト' }).click();
    await expect(page).toHaveURL(/\/practice\?mode=quest/);
    await expect(page.getByText('SESSION_ID:')).toBeVisible();
  });

  test('navigate to Do-SV Drill (Drill Mode)', async ({ page }) => {
    await page.getByRole('button', { name: 'れんしゅう' }).click();
    await page.getByRole('button', { name: 'しゅご ＋ Doどうし', exact: true }).click();
    await expect(page).toHaveURL(/\/practice\?mode=drill&pattern=DO_SV/);
  });

  test('navigate to Free Training (Free Mode)', async ({ page }) => {
    await page.getByRole('button', { name: 'おためし' }).click();
    await page.getByRole('button', { name: 'じゆうトレーニング' }).click();
    await expect(page).toHaveURL(/\/practice\?mode=free/);
  });

  test('menu back button works', async ({ page }) => {
    await page.getByRole('button', { name: 'たたかう' }).click();
    await expect(page.getByRole('button', { name: 'ドリルクエスト' })).toBeVisible();
    
    await page.getByRole('button', { name: '[もどる]' }).click();
    await expect(page.getByRole('button', { name: 'たたかう' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ドリルクエスト' })).not.toBeVisible();
  });
});
