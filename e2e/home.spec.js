const { test, expect } = require("@playwright/test");

test.describe("Home page", () => {
  test("displays community reward headings", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("big", { hasText: "Leu Zürich Rewards Overview" })).toBeVisible();
    await expect(page.locator("big", { hasText: "Nyota Rewards Overview" })).toBeVisible();
    await expect(page.locator("big", { hasText: "Paynuq Rewards Overview" })).toBeVisible();
    await expect(page.locator("big", { hasText: "Greenbay Dollar Rewards Overview" })).toBeVisible();
  });
});
