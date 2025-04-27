import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

test('US2_2 Invalid', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be set.');
    }
    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.waitForTimeout(3000);
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/auth/signin2');
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/');
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');
    await page.locator('text=View Details').first().waitFor();
    await page.waitForTimeout(1000);
    await page.locator('a > .w-full').first().click();
    await page.waitForURL('**/shops/**');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Edit Shop Services' }).click();
    await page.waitForURL('**/edit');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name' }).fill('test');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('spinbutton', { name: 'Price' }).click();
    await page.getByRole('spinbutton', { name: 'Price' }).fill('123');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('textbox', { name: 'Detail' }).click();
    await page.getByRole('textbox', { name: 'Detail' }).fill('55');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('combobox', { name: 'Target Area' }).click();
    await page.getByRole('option', { name: 'Foot' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByRole('main')).toContainText('Please select a massage type.');
    await expect(page.getByText('Please select a massage type.')).toBeVisible();
});