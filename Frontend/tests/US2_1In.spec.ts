import { test, expect } from '@playwright/test';

test('US2_1 Invalid', async ({ page }) => {
  await page.goto('https://sabaai.vercel.app/');
  await page.getByRole('link', { name: 'Shops' }).click();
  await page.getByRole('button', { name: 'Sign In' }).waitFor();
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Sign in to your account');
  await page.waitForTimeout(4000);
});