import { test, expect } from '@playwright/test';

test.describe('Home Page Sanity Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/GRID9 ENGLISH/i);
  });

  test('shows main menu commands', async ({ page }) => {
    await expect(page.getByText('たたかう')).toBeVisible();
    await expect(page.getByText('れんしゅう')).toBeVisible();
    await expect(page.getByText('おためし')).toBeVisible();
    await expect(page.getByText('せつめい')).toBeVisible();
  });

  test('shows current level', async ({ page }) => {
    await expect(page.getByText('現在のレベル')).toBeVisible();
    await expect(page.getByText('Lv.')).toBeVisible();
  });
});
