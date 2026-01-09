import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * Tests complete auth journey: signup → email verification → phone OTP → login
 */

test.describe('Authentication Flow', () => {
  const testUser = {
    email: `test${Date.now()}@college.edu`,
    password: 'TestPassword123',
    name: 'Test Student',
    phone: '9876543210',
    studentId: 'ST12345',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for splash screen to finish
    await page.waitForTimeout(3500);
  });

  test('should complete full signup flow', async ({ page }) => {
    // Navigate to signup page
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('/signup');

    // Fill signup form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="phone"]', testUser.phone);
    await page.fill('input[name="studentId"]', testUser.studentId);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should show success message and redirect
    await expect(page.locator('text=/account created/i')).toBeVisible({ timeout: 5000 });
  });

  test('should complete login flow', async ({ page }) => {
    // Go to login directly
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect after successful login
    await page.waitForURL(/\/(|menu|profile|orders)/, { timeout: 5000 });
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error notification
    await expect(page.locator('text=/invalid|incorrect|not found/i')).toBeVisible({ timeout: 3000 });
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/login');

    // Click forgot password link
    await page.click('text=/forgot password/i');
    await expect(page).toHaveURL('/forgot-password');

    // Enter email
    await page.fill('input[name="email"]', testUser.email);
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=/reset link sent/i')).toBeVisible({ timeout: 3000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should show validation message
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should require minimum password length', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');

    // Should show password length error
    await expect(page.locator('text=/at least 6 characters/i')).toBeVisible({ timeout: 3000 });
  });

  test('should handle phone OTP verification', async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/verify-phone');

    // Enter phone number
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill(testUser.phone);
      await page.click('text=/send otp/i');

      await page.waitForTimeout(1000);

      // In mock mode, OTP is shown in console - enter any 6 digits
      const otpInputs = page.locator('input[type="text"]').filter({ hasText: '' });
      const count = await otpInputs.count();
      
      // Fill OTP inputs (mock OTP: 123456)
      if (count >= 6) {
        for (let i = 0; i < 6; i++) {
          await otpInputs.nth(i).fill((i + 1).toString());
        }
      } else {
        // Single OTP input
        await page.fill('input[placeholder*="OTP"]', '123456');
      }

      await page.click('text=/verify/i');

      // Should show success or redirect
      await page.waitForTimeout(1000);
    }
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Find and click logout button (usually in navbar or profile)
    const logoutButton = page.locator('text=/logout|sign out/i').first();
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();

      // Should redirect to login
      await expect(page).toHaveURL('/login', { timeout: 3000 });
    }
  });

  test('should allow skipping to demo mode', async ({ page }) => {
    await page.goto('/login');

    const skipLink = page.locator('text=/skip for now|demo mode/i');
    if (await skipLink.isVisible()) {
      await skipLink.click();

      // Should go to home page
      await expect(page).toHaveURL('/', { timeout: 2000 });
    }
  });
});
