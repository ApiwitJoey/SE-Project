import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('melina@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.getByRole('textbox', { name: 'Shop Name' }).click();
    await page.getByRole('textbox', { name: 'Shop Name' }).fill('Goldner');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await expect(page.getByRole('main')).toContainText('Goldner');
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await page.getByLabel('Opens After').selectOption('12:00');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await expect(page.getByText(':00 - 23:00')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('12:00');
});