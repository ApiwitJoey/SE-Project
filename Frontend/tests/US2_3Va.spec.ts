import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const findIdx = (arr: string[], target: string) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}

const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

test('US2_3 Valid', async ({ page }) => {
    const targetAreas = [
        'Head & Shoulder', 
        'Foot', 
        'Neck-Shoulder-Back', 
        'Chair', 
        'Abdominal', 
        'Hand & Arm', 
        'Leg', 
        'Full Body'
    ];

    const massageTypes = [
        'Thai', 
        'Swedish', 
        'Oil/Aromatherapy', 
        'Herbal Compress',
        'Deep Tissue', 
        'Sports', 
        'Office Syndrome',
        'Shiatsu', 
        'Lomi-Lomi', 
        'Trigger Point',
        'Others'
    ];

    const adminEmail = process.env.TEST_ADMIN_EMAIL
    const adminPassword = process.env.TEST_ADMIN_PASSWORD
    
    if (!adminEmail || !adminPassword) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be set.');
    }
    test.setTimeout(60000);
    await page.goto('https://sabaai.vercel.app/');
    await page.waitForTimeout(2000);

    // Signing in as admin
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill(adminEmail);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(adminPassword);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for the page to load
    await page.waitForURL('https://sabaai.vercel.app/');
    await page.waitForTimeout(2000);

    // Navigating to Shops
    await page.getByRole('link', { name: 'Shops' }).click();
    await page.waitForURL('https://sabaai.vercel.app/shops');
    await page.locator('text=View Details').first().waitFor();

    // Clicking on the first shop's details
    await page.locator('a > .w-full').first().click();
    await page.waitForTimeout(1000);

    // Clicking on Edit Shop Services
    await page.getByRole('button', { name: 'Edit Shop Services' }).click();
    await page.waitForTimeout(2000);

    // Editing the last service in the list
    await page.getByRole('button', { name: 'Edit' }).last().click();
    await page.waitForTimeout(2000);

    const currentTargetArea = await page.getByRole('combobox').nth(0).innerText();
    const idx1 = findIdx(targetAreas, currentTargetArea!);
    const nextTargetArea = targetAreas[(idx1 + 1) % targetAreas.length];
    await page.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: nextTargetArea }).click();

    const currentMassageType = await page.getByRole('combobox').nth(1).innerText();
    const idx2 = findIdx(massageTypes, currentMassageType!);
    const nextMassageType = massageTypes[(idx2 + 1) % massageTypes.length];
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: nextMassageType }).click();

    const randomPrice = getRandomNumber(1, 100);
    await page.getByRole('spinbutton', { name: 'Price Price' }).click();
    await page.getByRole('spinbutton', { name: 'Price Price' }).fill(`${randomPrice}`);
    await page.getByRole('textbox', { name: 'Service Name Service Name' }).click();
    await page.getByRole('textbox', { name: 'Service Name Service Name' }).fill(`${nextTargetArea}_${nextMassageType}`);
    await page.waitForTimeout(2000);

    await page.getByRole('textbox', { name: 'Detail Detail' }).click();
    await page.getByRole('textbox', { name: 'Detail Detail' }).fill(nextTargetArea);

    await page.getByRole('button', { name: 'Confirm' }).first().click();
    await page.waitForTimeout(500);

    await expect(page.locator('.flex.flex-col.bg-emerald-50.rounded-lg.p-5.border.border-emerald-100.hover\\:shadow-md.transition-shadow').last().getByRole('heading')).toContainText(`${nextTargetArea}_${nextMassageType}`);
    await expect(page.locator('.flex.flex-col.bg-emerald-50.rounded-lg.p-5.border.border-emerald-100.hover\\:shadow-md.transition-shadow').last().locator('.text-emerald-600.font-medium').nth(0)).toContainText(`${randomPrice}`);
    await expect(page.locator('.flex.flex-col.bg-emerald-50.rounded-lg.p-5.border.border-emerald-100.hover\\:shadow-md.transition-shadow').last().locator('.text-emerald-600.font-medium').nth(1)).toContainText(nextTargetArea);
    await expect(page.locator('.flex.flex-col.bg-emerald-50.rounded-lg.p-5.border.border-emerald-100.hover\\:shadow-md.transition-shadow').last().locator('.text-emerald-600.font-medium').nth(2)).toContainText(nextMassageType);
});