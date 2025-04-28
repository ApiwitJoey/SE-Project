import { test, expect } from '@playwright/test';

// * Service filter
test('Service filter', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await page.getByRole('link', { name: 'Book Now' }).first().waitFor();
    await expect(page.getByText('Abdominal Healing Massage')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Abdominal');
    await page.getByRole('textbox', { name: 'Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name' }).fill('Abdominal');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('Abdominal Healing Massage')).toBeVisible();
    await page.getByRole('combobox').nth(2).click();
    await page.getByRole('option', { name: 'Price: High to Low' }).click();
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('75')).toBeVisible();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Oil/Aromatherapy' }).click();
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: 'Neck-Shoulder-Back' }).click();
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('combobox').nth(2).click();
    await page.getByRole('option', { name: 'Price: Low to High' }).click();
    await page.getByRole('spinbutton', { name: 'Min Price' }).click();
    await page.getByRole('spinbutton', { name: 'Min Price' }).fill('90');
    await page.getByRole('button', { name: 'Apply Filters' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('main')).toContainText('90');
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await page.waitForTimeout(2000);
});