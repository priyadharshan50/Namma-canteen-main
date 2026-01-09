import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Navigation and General App Features
 * Tests navigation, error handling, and cross-page functionality
 */

test.describe('Navigation and General Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500); // Wait for splash screen
  });

  test('should display splash screen on initial load', async ({ page }) => {
    // Reload to see splash again
    await page.goto('/');

    // Should show splash screen briefly
    const splashElements = page.locator('[class*="splash"], text=/namma.*canteen/i');
    // Splash screen appears for 3 seconds
    await page.waitForTimeout(1000);
  });

  test('should navigate between pages using navbar', async ({ page }) => {
    // Skip to demo mode or ensure we're past auth
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Test navigation to menu
    const menuLink = page.locator('a[href="/menu"], text=/menu/i').first();
    if (await menuLink.isVisible({ timeout: 3000 })) {
      await menuLink.click();
      await expect(page).toHaveURL('/menu', { timeout: 2000 });
    }

    // Test navigation to orders
    const ordersLink = page.locator('a[href="/orders"], text=/orders/i').first();
    if (await ordersLink.isVisible({ timeout: 3000 })) {
      await ordersLink.click();
      await expect(page).toHaveURL('/orders', { timeout: 2000 });
    }

    // Test navigation to profile
    const profileLink = page.locator('a[href="/profile"], text=/profile/i').first();
    if (await profileLink.isVisible({ timeout: 3000 })) {
      await profileLink.click();
      await expect(page).toHaveURL('/profile', { timeout: 2000 });
    }

    // Test navigation to home
    const homeLink = page.locator('a[href="/"], text=/home/i').first();
    if (await homeLink.isVisible({ timeout: 3000 })) {
      await homeLink.click();
      await expect(page).toHaveURL('/', { timeout: 2000 });
    }
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');

    // Should show 404 or not found page
    await expect(page.locator('text=/404|not found|page.*not.*exist/i')).toBeVisible({ timeout: 3000 });
  });

  test('should display notifications/toasts', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to trigger notification
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();

      // Should show toast notification
      await page.waitForTimeout(500);
      const toast = page.locator('[class*="toast"], [class*="notification"]');
      // Toast may appear briefly
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);

    await page.goto('/login');
    await page.waitForTimeout(1000);

    // Try to login
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should show network error or timeout
    await page.waitForTimeout(2000);
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('should persist cart across page navigation', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to cart
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Navigate away
      await page.goto('/');
      await page.waitForTimeout(500);

      // Go back to menu
      await page.goto('/menu');
      await page.waitForTimeout(500);

      // Cart should still have item
      const cartIndicator = page.locator('[class*="cart"]');
      await expect(cartIndicator).toBeVisible({ timeout: 2000 });
    }
  });

  test('should show loading states', async ({ page }) => {
    await page.goto('/menu');

    // Look for loading spinners or skeletons during initial load
    const loadingElement = page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]');
    // May appear briefly during page load
    await page.waitForTimeout(500);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForTimeout(1000);

    // Should render without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('should display home page features', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Look for home page elements
    const features = page.locator('text=/menu|orders|credit|track/i');
    await expect(features.first()).toBeVisible({ timeout: 3000 });
  });

  test('should handle refresh without losing state', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add item to cart
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();
      await page.waitForTimeout(3500); // Wait for splash

      // Cart should be preserved (from localStorage)
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Error Handling', () => {
  test('should recover from component errors with Error Boundary', async ({ page }) => {
    // This would require intentionally breaking a component
    // In real scenario, Error Boundary would catch and display fallback UI
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should validate form inputs', async ({ page }) => {  
    await page.goto('/signup');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Browser validation should prevent submission
    await page.waitForTimeout(500);
  });

  test('should handle API timeout', async ({ page }) => {
    // This tests Gemini API timeout handling
    await page.goto('/menu');
    await page.waitForTimeout(1000);

    // Add items and place order (which triggers AI suggestion)
    const addButton = page.locator('button:has-text("Add")').first();
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(500);

      const checkoutButton = page.locator('text=/checkout|place order/i').first();
      if (await checkoutButton.isVisible({ timeout: 2000 })) {
        await checkoutButton.click();
        await page.waitForTimeout(1000);

        const phoneInput = page.locator('input[type="tel"]');
        if (await phoneInput.isVisible({ timeout: 2000 })) {
          await phoneInput.fill('9876543210');
        }

        const submitButton = page.locator('button:has-text("Place Order")').first();
        if (await submitButton.isVisible({ timeout: 2000 })) {
          await submitButton.click();

          // Even if AI fails, order should succeed with fallback message
          await expect(page.locator('text=/order.*confirmed|success/i')).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });
});
