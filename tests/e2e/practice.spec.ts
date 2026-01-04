import { test, expect } from '@playwright/test';

test.describe('Practice Drill Flow', () => {
  test('basic sentence construction in SV drill', async ({ page }) => {
    await page.goto('/practice?mode=drill&pattern=DO_SV');

    // Select Verb Type: Do
    await page.getByRole('button', { name: 'Doどうし' }).click();

    // Select Pattern: SV
    await page.getByLabel('ぶんけい').selectOption('SV');

    // Select Verb:
    await page.getByLabel('どうし').selectOption({ index: 0 });

    // Check if the result area exists
    await expect(page.getByText('けっか', { exact: true })).toBeVisible();
  });
});
