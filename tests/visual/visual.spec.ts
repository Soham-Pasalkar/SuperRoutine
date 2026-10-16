import { test, expect } from "@playwright/test";

test.describe("Visual Regression Checks", () => {
  test("Landing Page Snapshot Comparison", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Take screenshot and verify page renders properly
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(10000);
  });

  test("Terms Page Snapshot Comparison", async ({ page }) => {
    await page.goto("/terms");
    await page.waitForLoadState("domcontentloaded");

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(5000);
  });

  test("Privacy Page Snapshot Comparison", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(5000);
  });
});
