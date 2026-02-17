const { test, expect } = require("@playwright/test");
const { readonlyAdminCookies } = require("./helpers");

test.describe("Authenticated report pages", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies(readonlyAdminCookies());
  });

  test("/turnover-report loads with CID/year form", async ({ page }) => {
    await page.goto("/turnover-report");

    await expect(page.locator('select[name="cid"]')).toBeVisible();
    await expect(page.locator('select[name="year"]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test("/rewards-report loads with CID form", async ({ page }) => {
    await page.goto("/rewards-report");

    await expect(page.locator('select[name="cid"]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test("/transaction-activity loads with CID/year form", async ({ page }) => {
    await page.goto("/transaction-activity");

    await expect(page.locator('select[name="cid"]')).toBeVisible();
    await expect(page.locator('select[name="year"]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test("/money-velocity-report loads with CID/year form", async ({ page }) => {
    await page.goto("/money-velocity-report");

    await expect(page.locator('select[name="cid"]')).toBeVisible();
    await expect(page.locator('select[name="year"]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test("/faucet-drips loads and renders charts", async ({ page }) => {
    await page.goto("/faucet-drips");

    await expect(page.locator("p", { hasText: "Faucet Drips" })).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("canvas")).toHaveCount(2);
  });
});
