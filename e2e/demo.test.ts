import { expect, test } from '@playwright/test';

test.describe('カウンターに対するテスト', () => {
  test('+ボタンをクリックした場合に、カウントが0->1に変化', async ({ page }) => {
  	await page.goto('/');
  	await expect(page.getByText('0')).toBeVisible();
	await page.getByLabel('Increase the counter by one').click();
	await expect(page.getByText('1')).toBeVisible();
  });
  test('-ボタンをクリックした場合に、カウントが0->-1に変化', async ({ page }) => {
  	await page.goto('/');
  	await expect(page.getByText('0')).toBeVisible();
	await page.getByLabel('Decrease the counter by one').click();
	await expect(page.getByText('-1')).toBeVisible();
  });
});