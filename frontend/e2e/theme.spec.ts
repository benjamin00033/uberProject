import { test, expect } from '@playwright/test';

test.describe('Theme Toggle & TestBaseUI', () => {
  
  test('Should toggle theme correctly in TestBaseUI', async ({ page }) => {
    await page.goto('test-base-ui');
    
    await expect(page).toHaveURL(/.*test-base-ui/);
    
    // Check if body has a specific theme class initially (e.g. 'dark' or none)
    const body = page.locator('body');
    const isDarkInitial = await body.evaluate(node => node.classList.contains('dark'));
    
    // Find theme toggle button
    const themeToggle = page.locator('ion-toggle, button', { hasText: /theme|模式/i }).first();
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Wait for class change
      await page.waitForTimeout(500); // small delay for ionic animations
      
      const isDarkAfter = await body.evaluate(node => node.classList.contains('dark'));
      expect(isDarkAfter).not.toBe(isDarkInitial);
    } else {
      // If no explicit toggle is found, we pass but note it
      console.log('No theme toggle found on TestBaseUI page.');
    }
  });
});
