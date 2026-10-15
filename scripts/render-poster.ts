import { chromium } from "@playwright/test";
import sharp from "sharp";
import fs from "fs";
import path from "path";

async function renderPoster() {
  console.log("Launching headless browser to capture hero poster...");
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2,
  });

  const url = process.env.POSTER_URL || "http://localhost:3000/poster";
  console.log(`Navigating to ${url}...`);

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("#poster-stage canvas", { timeout: 15000 });

  // Give materials, procedural reflections, and shadows a moment to settle
  await page.waitForTimeout(2000);

  const stage = page.locator("#poster-stage");
  const screenshotBuffer = await stage.screenshot({ type: "png" });

  await browser.close();
  console.log("Screenshot captured. Optimizing with sharp...");

  const publicImagesDir = path.resolve(__dirname, "../public/images");
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  const avifPath = path.join(publicImagesDir, "hero-poster.avif");
  const webpPath = path.join(publicImagesDir, "hero-poster.webp");

  // Output AVIF (target <= 60 KB)
  await sharp(screenshotBuffer)
    .resize(1200, 800)
    .avif({ quality: 80, effort: 6 })
    .toFile(avifPath);

  // Output WebP (target <= 60 KB)
  await sharp(screenshotBuffer)
    .resize(1200, 800)
    .webp({ quality: 85, effort: 6 })
    .toFile(webpPath);

  // Output tiny blur placeholder
  const blurBuffer = await sharp(screenshotBuffer)
    .resize(16, 11)
    .webp({ quality: 20 })
    .toBuffer();

  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  const blurTsPath = path.resolve(__dirname, "../src/lib/poster-blur.ts");
  fs.writeFileSync(
    blurTsPath,
    `export const HERO_POSTER_BLUR = "${blurDataUrl}";\n`
  );

  const avifSize = fs.statSync(avifPath).size;
  const webpSize = fs.statSync(webpPath).size;

  console.log(`✅ hero-poster.avif written: ${(avifSize / 1024).toFixed(1)} KB`);
  console.log(`✅ hero-poster.webp written: ${(webpSize / 1024).toFixed(1)} KB`);
  console.log(`✅ blur placeholder written to src/lib/poster-blur.ts`);
}

renderPoster().catch((err) => {
  console.error("Failed to render poster:", err);
  process.exit(1);
});
