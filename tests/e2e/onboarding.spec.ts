import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('complete 7-step onboarding', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'せつめい' }).click();
    await page.getByRole('button', { name: 'オンボーディング' }).click();

    await expect(page).toHaveURL(
      /\/practice\?mode=drill&pattern=DO_SV&onboarding=true/
    );

    const nextBubble = async () => {
      await page.getByText('(クリックしてすすむ)').first().click();
    };

    // Step 1: Verb Type Selection
    await expect(page.getByText(/まずは動詞の種類を選びます/)).toBeVisible();
    await nextBubble();

    // Step 2: Sentence Type
    await expect(page.getByText(/次は「しゅるい」の行です/)).toBeVisible();
    await nextBubble();

    // Step 3: Subject Selection
    await expect(page.getByText(/次は「しゅご」の行です/)).toBeVisible();
    await nextBubble();

    // Step 4: Tense Selection
    await expect(page.getByText(/最後は「じせい」の行です/)).toBeVisible();
    await nextBubble();

    // Step 5: Pattern Selection
    await expect(
      page.getByText(/リストから「ぶんけい」を選びます/)
    ).toBeVisible();
    await nextBubble();

    // Step 6: Verb Selection
    await expect(
      page.getByText(/リストから「どうし」を選びます/)
    ).toBeVisible();
    await nextBubble();

    // Step 7: Result Check
    await expect(page.getByText(/「けっか」の枠を見てください/)).toBeVisible();
    await nextBubble();

    // Should return to home
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
