import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll to the "Tap any supplement for the full details" / product breakdown section so supplement tiles become visible, then click a supplement tile.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Vitamin D3 + K2' supplement tile to open its detail panel.
        # Vitamin D3 + K2 4000 IU tablet button
        elem = page.get_by_role("button", name="Vitamin D3 + K2 4000 IU tablet")
        await elem.click(timeout=10000)
        
        # -> Click the 'Vitamin B12' supplement tile to open its detail panel and verify the dosage and active-form information are displayed.
        # Vitamin B12 200 mcg tablet button
        elem = page.get_by_role("button", name="Vitamin B12 200 mcg tablet")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Dosage text is visible for the Vitamin D3 + K2 and Vitamin B12 supplement tiles.
        # Assert-outcome: passed
        # Assert: Vitamin D3 + K2 shows the dosage '4000 IU tablet'.
        await expect(page.locator("#tile-btn-vitamin-d3-k2").nth(0)).to_contain_text("4000 IU tablet", timeout=15000), "Vitamin D3 + K2 shows the dosage '4000 IU tablet'."
        # Assert-outcome: passed
        # Assert: Vitamin B12 shows the dosage '200 mcg tablet'.
        await expect(page.locator("#tile-btn-vitamin-b12").nth(0)).to_contain_text("200 mcg tablet", timeout=15000), "Vitamin B12 shows the dosage '200 mcg tablet'."
        
        # --> Active-form information is visible for the Vitamin D3 + K2 and Vitamin B12 tiles.
        # Assert-outcome: passed
        # Assert: Vitamin D3 + K2 displays the active form 'D3 (cholecalciferol)'.
        await expect(page.locator("#tile-btn-vitamin-d3-k2").nth(0)).to_contain_text("D3 (cholecalciferol)", timeout=15000), "Vitamin D3 + K2 displays the active form 'D3 (cholecalciferol)'."
        # Assert-outcome: passed
        # Assert: Vitamin B12 displays the active form text mentioning 'Methylcobalamin'.
        await expect(page.locator("#tile-btn-vitamin-b12").nth(0)).to_contain_text("Methylcobalamin is the active form; cyanocobalamin is the cheaper, stable one.", timeout=15000), "Vitamin B12 displays the active form text mentioning 'Methylcobalamin'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    