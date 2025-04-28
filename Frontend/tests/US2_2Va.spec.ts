import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// * Admin adds a service with valid details
test('US2_2 Valid', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD
    
    if (!adminEmail || !adminPassword) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be set.');
    }

    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.waitForTimeout(2000);
    
    // Sign in to the application 
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('https://sabaai.vercel.app/auth/signin2');
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Email Address' }).dblclick();
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
    await page.locator('text=View Details').first().waitFor();

    // Click on the first shop's details
    await page.locator('a > .w-full').first().click();

    // Click on the "Edit Shop Services" button
    await page.getByRole('button', { name: 'Edit Shop Services' }).click();
    await page.waitForTimeout(2000);

    // Fill in the service details (Valid case)
    // Name
    await page.getByRole('textbox', { name: 'Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name' }).fill('Test2_2');
    // Target Area
    await page.getByRole('combobox', { name: 'Target Area' }).click();
    await page.getByRole('option', { name: 'Chair' }).click();
    // Massage Type
    await page.getByRole('combobox', { name: 'Massage Type' }).click();
    await page.getByRole('option', { name: 'Thai' }).click();
    // Detail
    await page.getByRole('textbox', { name: 'Detail' }).fill('test');
    await page.getByRole('spinbutton', { name: 'Price' }).fill('10');
    await page.waitForTimeout(1000);
    // Confirm
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('main')).toContainText('Service added successfully.');
    await page.waitForTimeout(2000);
    await page.waitForSelector('.grid');
    
    // Check if the new service is visible on the page
    const lastServiceHeading = page.locator('div.grid.grid-cols-1 > div.flex.flex-col').last().getByRole('heading');
    await expect(lastServiceHeading).toBeVisible();
    await expect(lastServiceHeading).toHaveText('Test2_2');
});