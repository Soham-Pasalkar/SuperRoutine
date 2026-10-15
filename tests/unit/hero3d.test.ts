import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { HERO_POSTER_BLUR } from "@/lib/poster-blur";

describe("Phase 3 - 3D Hero & Poster verification", () => {
  it("has generated hero poster assets within performance budget (<= 60 KB)", () => {
    const publicImagesDir = path.resolve(__dirname, "../../public/images");
    const avifPath = path.join(publicImagesDir, "hero-poster.avif");
    const webpPath = path.join(publicImagesDir, "hero-poster.webp");

    expect(fs.existsSync(avifPath)).toBe(true);
    expect(fs.existsSync(webpPath)).toBe(true);

    const avifSize = fs.statSync(avifPath).size;
    const webpSize = fs.statSync(webpPath).size;

    // Must be <= 60 KB per docs/05-HERO-3D.md
    expect(avifSize).toBeLessThan(60 * 1024);
    expect(webpSize).toBeLessThan(60 * 1024);
  });

  it("has a valid base64 blur placeholder", () => {
    expect(HERO_POSTER_BLUR).toBeDefined();
    expect(HERO_POSTER_BLUR.startsWith("data:image/webp;base64,")).toBe(true);
  });
});
