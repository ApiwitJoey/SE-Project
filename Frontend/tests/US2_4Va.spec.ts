import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

test('US2_4 Valid', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD
    
    if (!adminEmail || !adminPassword) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be set.');
    }
    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/');
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');
    await page.locator('text=View Details').first().waitFor();
    await page.locator('a > .w-full').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Edit Shop Services' }).click();
    await page.getByRole('textbox', { name: 'Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name' }).fill('Test');
    await page.waitForTimeout(500);
    await page.getByRole('combobox', { name: 'Target Area' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('option', { name: 'Foot' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('combobox', { name: 'Massage Type' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('option', { name: 'Thai' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: 'Detail' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: 'Detail' }).fill('Test');
    await page.getByRole('spinbutton', { name: 'Price' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('spinbutton', { name: 'Price' }).fill('5');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);
    await page.locator('div.grid.grid-cols-1 > div.flex.flex-col').last().getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('main')).toContainText('Service deleted successfully!');
    const popup = page.locator('div.fixed.inset-0');
    await popup.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(1000);
});