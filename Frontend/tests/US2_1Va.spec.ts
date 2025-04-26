import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('melina@gmail.com');
    await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(4000);
    await page.getByRole('link', { name: 'Shops' }).click();
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