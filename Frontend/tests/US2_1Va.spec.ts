import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

test('US2_1 Valid', async ({ page }) => {
    const userEmail = process.env.TEST_USER_EMAIL
    const userPassword = process.env.TEST_USER_PASSWORD

    if (!userEmail || !userPassword) {
        throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be set.');
    }

    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/auth/signin2');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(userPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');
    await page.locator('text=View Details').first().waitFor();
    await page.getByRole('textbox', { name: 'Shop Name' }).click();
    await page.getByRole('textbox', { name: 'Shop Name' }).fill('Blissful');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(3500);
    await expect(page.getByRole('main')).toContainText('Blissful');
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await page.getByLabel('Opens After').selectOption('11:00');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await expect(page.getByRole('main')).toContainText('11:00');
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Clear Filters' }).click();
});