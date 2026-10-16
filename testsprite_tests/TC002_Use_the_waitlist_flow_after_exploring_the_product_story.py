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
        
        # -> Scroll down to view the Day and Night sachet showcase and product cards.
        await page.mouse.wheel(0, 300)
        
        # -> Open the 'Vitamin D3 + K2' product tile to view its details (then view 'Magnesium Glycinate' and open 'Join the Founding Waitlist').
        # Vitamin D3 + K2 4000 IU tablet button
        elem = page.get_by_role("button", name="Vitamin D3 + K2 4000 IU tablet")
        await elem.click(timeout=10000)
        
        # -> Open the 'Vitamin D3 + K2' product tile to view its details (then view 'Magnesium Glycinate' and open 'Join the Founding Waitlist').
        # Magnesium Glycinate 1000 mg tablet button
        elem = page.get_by_role("button", name="Magnesium Glycinate 1000 mg")
        await elem.click(timeout=10000)
        
        # -> Open the 'Vitamin D3 + K2' product tile to view its details (then view 'Magnesium Glycinate' and open 'Join the Founding Waitlist').
        # Join the Founding Waitlist → link
        elem = page.get_by_role("link", name="Join the Founding Waitlist")
        await elem.click(timeout=10000)
        
        # -> Select the 'Info-first pack' packaging option so the form can proceed to the next question.
        # Info-first pack Ingredients, forms and doses...
        elem = page.locator("label").filter(has_text="Info-first packIngredients,")
        await elem.click(timeout=10000)
        
        # -> Select the 'Info-first pack' packaging option so the form can proceed to the next question.
        # Continue → button
        elem = page.get_by_role("button", name="Continue")
        await elem.click(timeout=10000)
        
        # -> Select the 'Day and Night sachets' option under "How would you like your supplements?" and then click the 'Continue →' button.
        # Day and Night sachets One sachet for the day, one...
        elem = page.locator("label").filter(has_text="Day and Night sachetsOne")
        await elem.click(timeout=10000)
        
        # -> Select the 'Day and Night sachets' option under "How would you like your supplements?" and then click the 'Continue →' button.
        # Continue → button
        elem = page.get_by_role("button", name="Continue")
        await elem.click(timeout=10000)
        
        # -> Select the 'Pre-made' option under 'How should your sachets be made?'.
        # Pre-made All 8 supplements split into 2 sachets...
        elem = page.locator("label").filter(has_text="Pre-madeAll 8 supplements")
        await elem.click(timeout=10000)
        
        # -> Click the 'Continue →' button to proceed to Question 4 of the waitlist form.
        # Continue → button
        elem = page.get_by_role("button", name="Continue")
        await elem.click(timeout=10000)
        
        # -> Set the monthly price sliders to a valid range (lower and upper values) and click the 'Continue →' button to proceed.
        # Lowest monthly price range field
        elem = page.get_by_role("slider", name="Lowest monthly price")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("1500")
        
        # -> Set the monthly price sliders to a valid range (lower and upper values) and click the 'Continue →' button to proceed.
        # Highest monthly price range field
        elem = page.get_by_role("slider", name="Highest monthly price")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("3000")
        
        # -> Set the monthly price sliders to a valid range (lower and upper values) and click the 'Continue →' button to proceed.
        # Continue → button
        elem = page.get_by_role("button", name="Continue")
        await elem.click(timeout=10000)
        
        # -> Fill the 'First name' field with 'Shubham', enter a valid Indian WhatsApp number in the 'WhatsApp number' field, check the consent agreement checkbox, and click the 'Claim founding access' button to submit the waitlist form.
        # Shubham text field
        elem = page.get_by_role("textbox", name="First name")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Shubham")
        
        # -> Fill the 'First name' field with 'Shubham', enter a valid Indian WhatsApp number in the 'WhatsApp number' field, check the consent agreement checkbox, and click the 'Claim founding access' button to submit the waitlist form.
        # tel field
        elem = page.get_by_role("textbox", name="WhatsApp number")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("+919876543210")
        
        # -> Fill the 'First name' field with 'Shubham', enter a valid Indian WhatsApp number in the 'WhatsApp number' field, check the consent agreement checkbox, and click the 'Claim founding access' button to submit the waitlist form.
        # checkbox
        elem = page.get_by_role("checkbox", name="I agree to be contacted about")
        await elem.click(timeout=10000)
        
        # -> Fill the 'First name' field with 'Shubham', enter a valid Indian WhatsApp number in the 'WhatsApp number' field, check the consent agreement checkbox, and click the 'Claim founding access' button to submit the waitlist form.
        # Claim founding access → button
        elem = page.get_by_role("button", name="Claim founding access")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The waitlist confirmation screen is visible with the 'You're in.' message and a Share on WhatsApp control.
        await page.get_by_role("link", name="Share on WhatsApp").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The 'Share on WhatsApp' link is visible on the confirmation screen.
        await expect(page.get_by_role("link", name="Share on WhatsApp").nth(0)).to_be_visible(timeout=15000), "The 'Share on WhatsApp' link is visible on the confirmation screen."
        # Assert-outcome: passed
        # Assert: The URL contains the '#join' fragment indicating the join/confirmation state.
        await expect(page).to_have_url(re.compile("\\#join"), timeout=15000), "The URL contains the '#join' fragment indicating the join/confirmation state."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    