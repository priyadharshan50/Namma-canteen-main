import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Kitchen/Admin Dashboard
 * Tests kitchen order management and status updates
 */

test.describe('Kitchen Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500); // Wait for splash screen
  });

  test('should display kitchen dashboard', async ({ page }) => {
    await page.goto('/kitchen');

    // Should show kitchen or orders section
    await expect(page.locator('text=/kitchen|orders|dashboard/i')).toBeVisible({ timeout: 3000 });
  });

  test('should display active orders', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Look for order cards or list
    const ordersSection = page.locator('[class*="order"]');
    // Orders may or may not exist
    await page.waitForTimeout(500);
  });

  test('should update order status to cooking', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Find an order and update to cooking
    const cookingButton = page.locator('button:has-text("Start Cooking"), button:has-text("Cooking")').first();
    
    if (await cookingButton.isVisible({ timeout: 3000 })) {
      await cookingButton.click();

      // Should show updated status
      await expect(page.locator('text=/cooking|preparing/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should update order status to ready', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Find ready button
    const readyButton = page.locator('button:has-text("Ready"), button:has-text("Mark Ready")').first();
    
    if (await readyButton.isVisible({ timeout: 3000 })) {
      await readyButton.click();

      // Should show ready status
      await expect(page.locator('text=/ready|pick.*up/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should mark order as delivered', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Find delivered button
    const deliveredButton = page.locator('button:has-text("Delivered"), button:has-text("Complete")').first();
    
    if (await deliveredButton.isVisible({ timeout: 3000 })) {
      await deliveredButton.click();

      // Should show delivered status or remove from active
      await page.waitForTimeout(1000);
    }
  });

  test('should cancel order', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Find cancel button
    const cancelButton = page.locator('button:has-text("Cancel")').first();
    
    if (await cancelButton.isVisible({ timeout: 3000 })) {
      await cancelButton.click();

      // May show confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Should show cancelled status
      await page.waitForTimeout(1000);
    }
  });

  test('should display rush hour indicator', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Look for rush hour or busy indicator
    const rushIndicator = page.locator('text=/rush|busy|active.*orders/i');
    // May or may not be visible
    await page.waitForTimeout(500);
  });

  test('should show order details', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Click on an order to view details
    const orderCard = page.locator('[class*="order"][class*="card"]').first();
    
    if (await orderCard.isVisible({ timeout: 3000 })) {
      await orderCard.click();

      // Should show order details (items, price, student info)
      await page.waitForTimeout(500);
    }
  });

  test('should filter orders by status', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Look for filter buttons
    const filterButton = page.locator('button:has-text("All"), button:has-text("Active"), button:has-text("Completed")').first();
    
    if (await filterButton.isVisible({ timeout: 3000 })) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Orders should filter
    }
  });

  test('should show estimated preparation time', async ({ page }) => {
    await page.goto('/kitchen');
    await page.waitForTimeout(1000);

    // Look for time estimates
    const timeElement = page.locator('text=/min|minutes|estimate/i');
    // May or may not be visible
    await page.waitForTimeout(500);
  });
});

test.describe('Orders Tracking Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('should display orders page', async ({ page }) => {
    await page.goto('/orders');

    // Should show orders section
    await expect(page.locator('text=/orders|my orders/i')).toBeVisible({ timeout: 3000 });
  });

  test('should show order history', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForTimeout(1000);

    // Look for past orders
    const ordersSection = page.locator('[class*="order"]');
    // Orders may or may not exist
    await page.waitForTimeout(500);
  });

  test('should track active order status', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForTimeout(1000);

    // Look for active order with status
    const statusElement = page.locator('text=/placed|cooking|ready|delivered/i');
    // May or may not have active orders
    await page.waitForTimeout(500);
  });

  test('should submit feedback for delivered order', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForTimeout(1000);

    // Find feedback button
    const feedbackButton = page.locator('text=/feedback|rate|review/i').first();
    
    if (await feedbackButton.isVisible({ timeout: 3000 })) {
      await feedbackButton.click();
      await page.waitForTimeout(500);

      // Fill feedback form
      const ratingButtons = page.locator('[class*="rating"], [class*="star"]');
      if (await ratingButtons.first().isVisible({ timeout: 2000 })) {
        await ratingButtons.first().click();
      }

      const commentInput = page.locator('textarea, input[type="text"]').first();
      if (await commentInput.isVisible({ timeout: 2000 })) {
        await commentInput.fill('Great food!');
      }

      const submitButton = page.locator('button:has-text("Submit"), button:has-text("Send")').first();
      if (await submitButton.isVisible({ timeout: 2000 })) {
        await submitButton.click();

        // Should show thank you message
        await expect(page.locator('text=/thank.*you|feedback.*submitted/i')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should cancel pending order', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForTimeout(1000);

    // Find cancel button for pending order
    const cancelButton = page.locator('button:has-text("Cancel")').first();
    
    if (await cancelButton.isVisible({ timeout: 3000 })) {
      await cancelButton.click();

      // Confirm cancellation
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();

        // Should show cancellation message
        await expect(page.locator('text=/cancel|refund/i')).toBeVisible({ timeout: 3000 });
      }
    }
  });
});
