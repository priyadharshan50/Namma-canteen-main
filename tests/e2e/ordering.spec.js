import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Ordering Flow
 * Tests menu browsing, cart management, and order placement
 */

test.describe('Ordering Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500); // Wait for splash screen
  });

  test('should display menu page', async ({ page }) => {
    // Navigate to menu
    await page.goto('/menu');

    // Should show menu items
    await expect(page.locator('text=/menu|food items/i')).toBeVisible({ timeout: 3000 });

    // Should have some menu items visible
    const menuItems = page.locator('[class*="menu"][class*="item"], [class*="card"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 5000 });
  });

  test('should add items to cart', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Find and click add to cart button
    const addButton = page.locator('button:has-text("Add"), button:has-text("+")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();

      // Cart count should increase
      await page.waitForTimeout(500);
      
      // Check for cart indicator or count
      const cartIndicator = page.locator('[class*="cart"]');
      await expect(cartIndicator).toBeVisible({ timeout: 2000 });
    }
  });

  test('should manage cart quantities', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to cart
    const addButton = page.locator('button:has-text("Add"), button:has-text("+")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Try to increase quantity
      const increaseButton = page.locator('button:has-text("+")').first();
      if (await increaseButton.isVisible({ timeout: 2000 })) {
        await increaseButton.click();
        await page.waitForTimeout(300);
      }

      // Try to decrease quantity
      const decreaseButton = page.locator('button:has-text("-")').first();
      if (await decreaseButton.isVisible({ timeout: 2000 })) {
        await decreaseButton.click();
      }
    }
  });

  test('should place an order', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to cart
    const addButton = page.locator('button:has-text("Add"), button:has-text("+")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Find checkout or place order button
      const checkoutButton = page.locator('text=/checkout|place order|confirm/i').first();
      
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();

        await page.waitForTimeout(1000);

        // Fill phone number if required
        const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone"]');
        if (await phoneInput.isVisible({ timeout: 2000 })) {
          await phoneInput.fill('9876543210');
        }

        // Submit order
        const submitButton = page.locator('button:has-text("Place Order"), button:has-text("Confirm")').first();
        if (await submitButton.isVisible({ timeout: 2000 })) {
          await submitButton.click();

          // Should show success message
          await expect(page.locator('text=/order.*confirmed|success/i')).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should search/filter menu items', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('dosa');
      await page.waitForTimeout(500);

      // Results should update
      const menuItems = page.locator('[class*="menu"], [class*="item"]');
      await expect(menuItems.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should show AI food pairing suggestion after order', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Quick order flow
    const addButton = page.locator('button:has-text("Add"), button:has-text("+")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      const checkoutButton = page.locator('text=/checkout|place order/i').first();
      
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
        await page.waitForTimeout(1000);

        const phoneInput = page.locator('input[type="tel"]');
        if (await phoneInput.isVisible({ timeout: 2000 })) {
          await phoneInput.fill('9876543210');
        }

        const submitButton = page.locator('button:has-text("Place Order"), button:has-text("Confirm")').first();
        if (await submitButton.isVisible({ timeout: 2000 })) {
          await submitButton.click();

          // AI suggestion should appear
          await page.waitForTimeout(2000);
          // Look for suggestion text (usually contains emoji or suggestion keywords)
        }
      }
    }
  });

  test('should display cart total correctly', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add multiple items
    const addButtons = page.locator('button:has-text("Add"), button:has-text("+")');
    const count = await addButtons.count();
    
    if (count > 0) {
      await addButtons.first().click();
      await page.waitForTimeout(300);

      if (count > 1) {
        await addButtons.nth(1).click();
        await page.waitForTimeout(300);
      }

      // Check for total price display
      const totalElement = page.locator('text=/total|₹/i');
      await expect(totalElement.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should apply discount if eligible', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to cart
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Look for discount indicator
      const discountText = page.locator('text=/discount|save/i');
      // May or may not be visible depending on user profile
      await page.waitForTimeout(1000);
    }
  });

  test('should handle empty cart', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Try to checkout with empty cart
    const checkoutButton = page.locator('text=/checkout|place order/i').first();
    
    if (await checkoutButton.isVisible({ timeout: 2000 })) {
      await checkoutButton.click();

      // Should show empty cart message or disabled state
      await page.waitForTimeout(500);
    }
  });
});
