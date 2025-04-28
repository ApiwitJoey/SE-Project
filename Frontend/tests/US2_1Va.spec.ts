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
    // Sign in to the application
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/auth/signin2');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(userPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/');

    // Navigate to the Shops page
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');

    // Wait for the shops to load
    await page.locator('text=View Details').first().waitFor();

    // Filter by shop name
    await page.getByRole('textbox', { name: 'Shop Name' }).click();
    await page.getByRole('textbox', { name: 'Shop Name' }).fill('Blissful');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2500);
    await expect(page.getByRole('main')).toContainText('Blissful');
    await page.getByRole('button', { name: 'Clear Filters' }).click();

    // Filter by shop opening time
    await page.getByLabel('Opens After').selectOption('11:00');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await expect(page.getByRole('main')).toContainText('11:00');
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Clear Filters' }).click();

    // Filter by shop closing time
    await page.getByLabel('Closes Before').selectOption('20:00');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Clear Filters' }).click();

    // Filter by shop name, opening time, and closing time
    await page.getByRole('textbox', { name: 'Shop Name' }).click();
    await page.getByRole('textbox', { name: 'Shop Name' }).fill('Massage');
    await page.waitForTimeout(500);
    await page.getByLabel('Opens After').selectOption('08:00');
    await page.waitForTimeout(500);
    await page.getByLabel('Closes Before').selectOption('21:00');
    await page.getByRole('button', { name: 'Apply Filters' }).click();

    // Verify that the filtered results are correct
    const massageLocators = page.locator('.text-xl.font-bold.text-emerald-800.mb-2');
    const count = await massageLocators.count();
    for (let i = 0; i < count; i++) {
        await expect(massageLocators.nth(i)).toContainText('Massage');
    }
    await expect(page.locator('.space-y-2.text-emerald-700').locator('div>span').nth(1)).not.toContainText('07:00');
    await expect(page.locator('.space-y-2.text-emerald-700').locator('div>span').nth(1)).not.toContainText('22:00');

    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Clear Filters' }).click();
});