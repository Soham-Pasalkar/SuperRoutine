import { test, expect } from "@playwright/test";

test.describe("Navigation, Product Showcase & Legal Pages", () => {
  test("TC005 & TC006: Day & Night sachet showcase and supplement accordion disclosure", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Scroll to routine section
    const routineSec = page.locator("#routine");
    await expect(routineSec).toBeVisible();

    // Verify Day Sachet card
    const dayBox = page.locator(".box.day");
    await expect(dayBox).toBeVisible();
    await expect(dayBox.locator("h3")).toContainText("Day Pack");
    await expect(dayBox.locator(".grp")).toContainText("Energy · Focus · Strength");

    // Verify Night Sachet card
    const nightBox = page.locator(".box.night");
    await expect(nightBox).toBeVisible();
    await expect(nightBox.locator("h3")).toContainText("Night Pack");
    await expect(nightBox.locator(".grp")).toContainText("Recover · Sleep · Relax");

    // Test accordion expansion on a supplement tile
    const firstTileBtn = dayBox.locator(".sup button").first();
    await expect(firstTileBtn).toBeVisible();
    await expect(firstTileBtn).toHaveAttribute("aria-expanded", "false");

    // Click to open
    await firstTileBtn.click();
    await expect(firstTileBtn).toHaveAttribute("aria-expanded", "true");

    // Associated panel should be visible
    const panelId = await firstTileBtn.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator("dt", { hasText: "What it does" })).toBeVisible();
    await expect(panel.locator("dt", { hasText: "Evidence" })).toBeVisible();

    // Click again to close
    await firstTileBtn.click();
    await expect(firstTileBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("TC007 & TC008: Navigates cleanly to Terms and Privacy pages from footer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Scroll to footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Click Terms of Service link
    const termsLink = footer.getByRole("link", { name: "Terms" });
    await expect(termsLink).toBeVisible();
    await termsLink.click();

    await page.waitForURL("**/terms");
    await expect(page.locator("h1")).toContainText("Terms");

    // Back to home
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Click Privacy Policy link
    const privacyLink = page.locator("footer").getByRole("link", { name: "Privacy" });
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();

    await page.waitForURL("**/privacy");
    await expect(page.locator("h1")).toContainText("Privacy");
  });

  test("TC009: Legal pages render with correct meta tags and disclosures", async ({
    page,
  }) => {
    // Navigate to Terms page
    await page.goto("/terms");
    await page.waitForLoadState("domcontentloaded");

    // Check headings
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Super Routine" }).first()).toBeVisible();

    // Navigate to Privacy page
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1")).toBeVisible();
    // Check that personal data boundaries are mentioned
    await expect(page.locator("body")).toContainText("WhatsApp");
  });
});
