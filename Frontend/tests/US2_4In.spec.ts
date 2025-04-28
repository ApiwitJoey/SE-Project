import { test, expect } from '@playwright/test';

// * Attempt to delete a shop service without signing in
test('US2_4 Invalid', async ({ page }) => {
    await page.goto('https://sabaai.vercel.app/');

    // Navigate the edit page of a shop without signing in
    await page.goto('https://sabaai.vercel.app/shops/680cf822f76c7d46afafd208/edit');
    await page.waitForTimeout(750);

    // Get redirect back to Sign In page
    await expect(page.locator('h2')).toContainText('Welcome Back');
    await expect(page.locator('body')).toContainText('Sign in to your account');
    await expect(page.locator('form')).toContainText('Email Address');
    await expect(page.locator('form')).toContainText('Password');
    await expect(page.locator('div').filter({ hasText: /^Welcome BackSign in to your account$/ }).getByRole('img')).toBeVisible();
});