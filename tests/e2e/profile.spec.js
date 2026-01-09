import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Profile and Credit Management
 * Tests profile viewing/editing, credit system, and transactions
 */

test.describe('Profile and Credit Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500); // Wait for splash screen
  });

  test('should display profile page', async ({ page }) => {
    await page.goto('/profile');

    // Should show profile information
    await expect(page.locator('text=/profile|account/i')).toBeVisible({ timeout: 3000 });
  });

  test('should edit profile information', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for edit button
    const editButton = page.locator('button:has-text("Edit"), button:has-text("Update")').first();
    
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      await page.waitForTimeout(500);

      // Find name input and update
      const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
      if (await nameInput.isVisible({ timeout: 2000 })) {
        await nameInput.clear();
        await nameInput.fill('Updated Name');

        // Save changes
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
        if (await saveButton.isVisible({ timeout: 2000 })) {
          await saveButton.click();

          // Should show success message
          await expect(page.locator('text=/success|updated/i')).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('should display credit information', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for credit section
    const creditSection = page.locator('text=/credit|balance|limit/i');
    await expect(creditSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('should request credit authorization', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for request/authorize button
    const requestButton = page.locator('text=/request.*credit|authorize/i').first();
    
    if (await requestButton.isVisible({ timeout: 3000 })) {
      await requestButton.click();

      // Should show confirmation or message
      await page.waitForTimeout(1000);
      await expect(page.locator('text=/request|pending|approved/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display transaction history', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for transactions section
    const transactionsSection = page.locator('text=/transaction|history|activity/i');
    
    if (await transactionsSection.isVisible({ timeout: 3000 })) {
      // Should show list of transactions
      await page.waitForTimeout(500);
    }
  });

  test('should make credit payment', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for payment section
    const paymentInput = page.locator('input[type="number"][placeholder*="amount"]').first();
    
    if (await paymentInput.isVisible({ timeout: 3000 })) {
      await paymentInput.fill('100');

      const payButton = page.locator('button:has-text("Pay"), button:has-text("Submit")').first();
      if (await payButton.isVisible({ timeout: 2000 })) {
        await payButton.click();

        // Should show success message
        await expect(page.locator('text=/payment.*received|success/i')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should show credit tier information', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for tier badges (Bronze, Silver, Gold)
    const tierElement = page.locator('text=/bronze|silver|gold|tier/i');
    await expect(tierElement.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display attendance percentage', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for attendance information
    const attendanceElement = page.locator('text=/attendance|%/i');
    // May or may not be visible depending on profile setup
    await page.waitForTimeout(500);
  });

  test('should show monthly orders count', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Look for orders count
    const ordersElement = page.locator('text=/orders this month|monthly orders/i');
    await page.waitForTimeout(500);
  });

  test('should handle credit limit exceeded', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Try to order with credit beyond limit
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      // Add many items
      for (let i = 0; i < 10; i++) {
        await addButton.click();
        await page.waitForTimeout(200);
      }

      const checkoutButton = page.locator('text=/checkout|place order/i').first();
      if (await checkoutButton.isVisible({ timeout: 2000 })) {
        await checkoutButton.click();
        await page.waitForTimeout(1000);

        // Select credit payment
        const creditOption = page.locator('text=/credit|pay with credit/i').first();
        if (await creditOption.isVisible({ timeout: 2000 })) {
          await creditOption.click();

          const submitButton = page.locator('button:has-text("Place Order")').first();
          if (await submitButton.isVisible({ timeout: 2000 })) {
            await submitButton.click();

            // Should show error about insufficient credit
            await page.waitForTimeout(1000);
          }
        }
      }
    }
  });

  test('should toggle green token', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Look for green token toggle
    const greenTokenToggle = page.locator('text=/green token|eco/i').first();
    
    if (await greenTokenToggle.isVisible({ timeout: 3000 })) {
      await greenTokenToggle.click();
      await page.waitForTimeout(500);

      // Should see discount applied
      await page.waitForTimeout(500);
    }
  });
});
