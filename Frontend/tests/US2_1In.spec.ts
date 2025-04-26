import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://sabaai.vercel.app/');
  await page.getByRole('link', { name: 'Shops' }).click();
  await page.waitForTimeout(2500);
});