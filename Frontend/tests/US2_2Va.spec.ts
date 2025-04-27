import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    test.setTimeout(60000);
  await page.goto('https://sabaai.vercel.app/');
  await page.waitForTimeout(4000);
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Email Address' }).dblclick();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Shops' }).click();
  await page.waitForTimeout(2000);
  await page.locator('a > .w-full').first().click();
  await page.getByRole('button', { name: 'Edit Shop Services' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Service Name' }).click();
  await page.getByRole('textbox', { name: 'Service Name' }).fill('Test2_2');
  await page.getByRole('combobox', { name: 'Target Area' }).click();
  await page.getByRole('option', { name: 'Chair' }).click();
  await page.getByRole('combobox', { name: 'Massage Type' }).click();
  await page.getByRole('option', { name: 'Thai' }).click();

  await page.getByRole('textbox', { name: 'Detail' }).fill('test');
  await page.getByRole('spinbutton', { name: 'Price' }).fill('10');
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.waitForTimeout(4000);
  await expect(page.getByRole('main')).toContainText('Service added successfully.');
  await page.waitForTimeout(6000);
  
  
  await expect(page.getByRole('heading', { name: 'Test2_2' })).toBeVisible();
});