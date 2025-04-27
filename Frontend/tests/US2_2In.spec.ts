import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    test.setTimeout(60000);
  await page.goto('https://sabaai.vercel.app/');
  await page.waitForTimeout(4000);
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.waitForTimeout(4000);
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Shops' }).click();
  await page.waitForTimeout(2000);
  await page.locator('a > .w-full').first().click();
  await page.getByRole('button', { name: 'Edit Shop Services' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForTimeout(6000);
  await expect(page.getByRole('main')).toContainText('Please enter a service name.');
  await page.waitForTimeout(4000);
  await expect(page.getByText('Please enter a service name.')).toBeVisible();
});