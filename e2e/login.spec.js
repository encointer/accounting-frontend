const { test, expect } = require("@playwright/test");

test.describe("Login page", () => {
  test("/internal shows login form when unauthenticated", async ({ page }) => {
    await page.goto("/internal");

    await expect(page.locator("h1", { hasText: "Login" })).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });
});
