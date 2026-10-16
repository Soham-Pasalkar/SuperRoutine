import { test, expect } from "@playwright/test";

test.describe("Founding-Member Waitlist Funnel", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept waitlist submission to keep tests deterministic and prevent DB pollution
    await page.route("**/api/waitlist", async (route) => {
      if (route.request().method() === "POST") {
        const body = JSON.parse(route.request().postData() || "{}");
        if (!body.consent || !body.firstName || !body.phone) {
          await route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({ error: "Missing required fields" }),
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            position: 42,
            duplicate: false,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("TC001: Completes full waitlist funnel to confirmation queue (Happy Path)", async ({
    page,
  }) => {
    // Scroll or click Hero CTA to open waitlist form
    const joinCta = page.getByRole("link", { name: "Join the Founding Waitlist" }).first();
    if (await joinCta.isVisible()) {
      await joinCta.click();
    }

    const formCard = page.locator(".formcard");
    await expect(formCard).toBeVisible();

    // Step 1: Packaging Style
    const infoPack = page.locator("label").filter({ hasText: "Info-first pack" });
    await infoPack.click();
    const nextBtn = page.locator("#nextBtn");
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Step 2: Format
    const sachets = page.locator("label").filter({ hasText: "Day and Night sachets" });
    await sachets.click();
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Step 3: Build Type
    const premade = page.locator("label").filter({ hasText: "Pre-made" });
    await premade.click();
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Step 4: Price Slider
    const minSlider = page.getByRole("slider", { name: "Lowest monthly price" });
    await expect(minSlider).toBeVisible();
    await minSlider.fill("1500");
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Step 5: Contact Details & Consent
    const fname = page.locator("#fname");
    const fphone = page.locator("#fphone");
    const fconsent = page.locator("#fconsent");

    await expect(fname).toBeVisible();
    await fname.fill("Asha");
    await fphone.fill("+91 98765 43210");

    // Before consent is checked, button should be disabled
    await expect(nextBtn).toBeDisabled();

    // Check consent
    await fconsent.scrollIntoViewIfNeeded();
    await fconsent.check();
    await expect(nextBtn).toBeEnabled();
    await expect(nextBtn).toContainText("Claim founding access");

    // Submit
    await nextBtn.click();

    // Step 6: Confirmation Screen
    const doneSection = page.locator(".fstep[data-s='6']");
    await expect(doneSection).toHaveClass(/on/);
    await expect(page.locator("h3", { hasText: "You're in." })).toBeVisible();
    await expect(page.locator("#doneMsg")).toContainText("Asha");
    await expect(page.locator("#shareBtn")).toBeVisible();
  });

  test("TC003: Strictly validates Indian WhatsApp number before allowing submission", async ({
    page,
  }) => {
    // Quick advance through steps 1-4
    await page.locator("label").filter({ hasText: "Info-first pack" }).click();
    await page.locator("#nextBtn").click();

    await page.locator("label").filter({ hasText: "Day and Night sachets" }).click();
    await page.locator("#nextBtn").click();

    await page.locator("label").filter({ hasText: "Pre-made" }).click();
    await page.locator("#nextBtn").click();

    await page.getByRole("slider", { name: "Lowest monthly price" }).fill("1400");
    await page.locator("#nextBtn").click();

    // Step 5
    const fname = page.locator("#fname");
    const fphone = page.locator("#fphone");
    const fconsent = page.locator("#fconsent");
    const nextBtn = page.locator("#nextBtn");

    await expect(fname).toBeVisible();
    await fname.fill("Soham");
    await fconsent.check();

    // Enter invalid short phone number
    await fphone.fill("+91 1234");
    await expect(nextBtn).toBeDisabled();

    // Enter non-Indian phone prefix format
    await fphone.fill("+1 555 123 4567");
    await expect(nextBtn).toBeDisabled();

    // Enter valid 10-digit Indian phone number
    await fphone.fill("+91 98220 12345");
    await expect(nextBtn).toBeEnabled();
  });

  test("TC004: Enforces explicit consent requirement before waitlist submission", async ({
    page,
  }) => {
    // Advance to step 5
    await page.locator("label").filter({ hasText: "Info-first pack" }).click();
    await page.locator("#nextBtn").click();

    await page.locator("label").filter({ hasText: "Day and Night sachets" }).click();
    await page.locator("#nextBtn").click();

    await page.locator("label").filter({ hasText: "Pre-made" }).click();
    await page.locator("#nextBtn").click();

    await page.getByRole("slider", { name: "Lowest monthly price" }).fill("1600");
    await page.locator("#nextBtn").click();

    // Step 5
    const fname = page.locator("#fname");
    const fphone = page.locator("#fphone");
    const fconsent = page.locator("#fconsent");
    const nextBtn = page.locator("#nextBtn");

    await fname.fill("Rahul");
    await fphone.fill("+91 98111 22233");

    // Consent NOT checked
    await expect(fconsent).not.toBeChecked();
    await expect(nextBtn).toBeDisabled();

    // Check consent -> button becomes enabled
    await fconsent.check();
    await expect(nextBtn).toBeEnabled();

    // Uncheck consent -> button reverts to disabled
    await fconsent.uncheck();
    await expect(nextBtn).toBeDisabled();
  });

  test("Restores survey draft from sessionStorage upon page reload", async ({
    page,
  }) => {
    // Complete steps 1 and 2
    await page.locator("label").filter({ hasText: "Info-first pack" }).click();
    await page.locator("#nextBtn").click();

    await page.locator("label").filter({ hasText: "Day and Night sachets" }).click();
    await page.locator("#nextBtn").click();

    // Wait until draft is committed to sessionStorage
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const raw = sessionStorage.getItem("sr_waitlist_draft");
          return raw ? JSON.parse(raw).packaging : null;
        });
      })
      .toBe("info");

    // Reload page
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // Check that draft answers were saved
    const draft = await page.evaluate(() => {
      return sessionStorage.getItem("sr_waitlist_draft");
    });
    expect(draft).toBeTruthy();
    const parsed = JSON.parse(draft || "{}");
    expect(parsed.packaging).toBe("info");
    expect(parsed.format).toBe("sachets");
  });
});
