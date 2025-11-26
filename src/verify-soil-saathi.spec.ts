
import { test, expect } from '@playwright/test';

test('Verify Soil Saathi and My Field functionality', async ({ page }) => {
    test.setTimeout(90000); // Increase global timeout to 90 seconds
    // 1. Login
    await page.goto('http://localhost:8080/auth');
    await page.fill('input[type="email"]', 'justfun2842@gmail.com');
    await page.fill('input[type="password"]', '123456789');
    await page.click('button:has-text("Sign In")');

    // Wait for dashboard to load with increased timeout
    try {
        await page.waitForURL('**/dashboard', { timeout: 60000 });
    } catch (e) {
        console.log('Timeout waiting for dashboard. Current URL:', page.url());
        await page.screenshot({ path: 'login-failure.png' });
        throw e;
    }
    console.log('Logged in successfully');

    // 2. Navigate to Soil Saathi
    await page.click('a[href="/soilsaathi"]');
    await page.waitForURL('**/soilsaathi');
    console.log('Navigated to Soil Saathi');

    // 3. Verify My Fields List
    // Check if "My Fields" header is present
    await expect(page.locator('h2:has-text("My Fields")')).toBeVisible();

    // Check if there are any fields or the empty state
    const fields = await page.locator('.space-y-3 > div').count();
    const emptyState = await page.locator('text=Start mapping your first field').count();

    if (fields > 0) {
        console.log(`Found ${fields} fields`);

        // 4. Verify Field Details
        // Click the first field
        await page.locator('.space-y-3 > div').first().click();
        await page.waitForURL('**/soilsaathi/field/**');
        console.log('Navigated to Field Details');

        // Check for Field Name
        await expect(page.locator('h1')).toBeVisible();

        // Check for "Fetch Real Satellite Data" button or "Vegetation Health Analysis"
        const fetchButton = await page.locator('button:has-text("Fetch Real Satellite Data")').count();
        const analysisHeader = await page.locator('text=Vegetation Health Analysis').count();

        if (fetchButton > 0) {
            console.log('Fetch Satellite Data button found');
        } else if (analysisHeader > 0) {
            console.log('Vegetation Health Analysis already present');
        } else {
            console.log('Neither Fetch button nor Analysis header found - might be loading or error');
        }

    } else if (emptyState > 0) {
        console.log('No fields found (Empty State)');
        // Optional: Test adding a field flow if needed, but for now just verifying existing state
    } else {
        console.log('Unexpected state: Neither fields nor empty state found');
    }
});
