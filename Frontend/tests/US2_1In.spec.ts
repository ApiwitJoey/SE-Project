import { test, expect } from '@playwright/test';

// * Attempt to serach for a shop without signing in
test('US2_1 Invalid', async ({ page }) => {
  await page.goto('https://sabaai.vercel.app/');
  await page.getByRole('link', { name: 'Shops' }).click();
  // Get redirect back to Sign In page
  await page.getByRole('button', { name: 'Sign In' }).waitFor();
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Sign in to your account');
  await page.waitForTimeout(4000);
});