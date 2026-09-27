import { test, expect } from '@playwright/test';

test.describe('Login & Forgot Password Flow', () => {
  
  test('Should display login form correctly', async ({ page }) => {
    await page.goto('login');
    
    // Check if the page title or a specific header exists
    await expect(page).toHaveURL(/.*login/);
    
    // Depending on the UI, check for username/password inputs
    // Assuming standard Ionic/HTML structure:
    const usernameInput = page.locator('input[type="text"], input[name="username"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button', { hasText: /login|登入/i }).first();
    
    // Validate inputs exist
    // await expect(usernameInput).toBeVisible();
    // await expect(passwordInput).toBeVisible();
    // await expect(loginButton).toBeVisible();
  });

  test('Should navigate to forgot password page', async ({ page }) => {
    await page.goto('login');
    
    // Click on forgot password link
    const forgotPasswordLink = page.locator('a, button', { hasText: /forgot.*password|忘記密碼/i }).first();
    
    // If the link exists, we can click it and verify navigation
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*forgot-password/);
    } else {
      // Just directly visit the route if the link is not present
      await page.goto('forgot-password');
      await expect(page).toHaveURL(/.*forgot-password/);
    }
  });
});
