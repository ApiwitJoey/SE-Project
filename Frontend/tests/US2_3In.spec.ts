import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// * Admin attmepts to edit a service without all the required details
test('US2_3 Invalid', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD
    
    if (!adminEmail || !adminPassword) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be set.');
    }

    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.waitForTimeout(4000);

    // Sign in to the application
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for the page to load
    await page.waitForURL('https://sabaai.vercel.app/');
    await page.waitForTimeout(2000);

    // Navigate to the Shops page
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');

    // Click on the first shop's details
    await page.locator('text=View Details').first().waitFor();
    await page.locator('a > .w-full').first().click();
    await page.waitForTimeout(1000);

    // Click on the "Edit Shop Services" button
    await page.getByRole('button', { name: 'Edit Shop Services' }).click();
    await page.waitForTimeout(2000);

    // Edit the last service
    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.waitForTimeout(2000);
    
    // Fill in the service details (Invalid case)
    await page.getByRole('textbox', { name: 'Service Name Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name Service Name' }).fill('');
    await page.getByRole('textbox', { name: 'Detail Detail' }).click();
    await page.getByRole('textbox', { name: 'Detail Detail' }).fill('');
    await page.getByRole('spinbutton', { name: 'Price Price' }).click();
    await page.getByRole('spinbutton', { name: 'Price Price' }).fill('');
    await page.waitForTimeout(2000);

    // Confirm the changes
    await page.getByRole('button', { name: 'Confirm' }).first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('main')).toContainText('Please enter some information.');
    await expect(page.getByText('Please enter some information.')).toBeVisible();
});