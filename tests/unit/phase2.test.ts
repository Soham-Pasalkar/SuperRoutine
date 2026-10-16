import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Phase 2 Remediation Checks", () => {
  const rootDir = process.cwd();

  it("ensures public/images/hero-OLD-contains-errors.jpg has been permanently removed", () => {
    const oldAssetPath = path.join(
      rootDir,
      "public",
      "images",
      "hero-OLD-contains-errors.jpg"
    );
    expect(fs.existsSync(oldAssetPath)).toBe(false);
  });

  it("verifies production hero stage references valid hero-poster asset and maintains fallback", () => {
    const heroStagePath = path.join(
      rootDir,
      "src",
      "components",
      "hero",
      "HeroStage.tsx"
    );
    const content = fs.readFileSync(heroStagePath, "utf-8");

    // Must not reference legacy erroneous asset
    expect(content).not.toContain("hero-OLD-contains-errors");

    // Must reference valid optimized poster and fallback
    expect(content).toContain("/images/hero-poster.webp");
    expect(content).toContain("onError={() => setHasPosterImage(false)}");
  });

  it("verifies Privacy Policy has no [TODO] placeholders and contains required DPDP disclosures", () => {
    const privacyPath = path.join(
      rootDir,
      "src",
      "app",
      "privacy",
      "page.tsx"
    );
    const content = fs.readFileSync(privacyPath, "utf-8");

    // No public placeholder text
    expect(content).not.toContain("[TODO");
    expect(content).not.toContain("TODO:");
    expect(content).not.toContain("Legal Review Required");

    // Accurately discloses collected personal data
    expect(content).toContain("WhatsApp Mobile Number");
    expect(content).toContain("First Name");
    expect(content).toContain("Salted IP Hash");

    // Discloses what is NOT collected
    expect(content).toContain("Aadhaar");

    // Identifies infrastructure processors
    expect(content).toContain("Supabase");
    expect(content).toContain("Cloudflare");
    expect(content).toContain("Upstash");

    // Documents user erasure rights under DPDP framework
    expect(content).toContain("Digital Personal Data Protection");
    expect(content).toContain("erasure");
  });

  it("verifies migration 0002_waitlist_position_sequence.sql exists with safe backfill and sequence", () => {
    const migrationPath = path.join(
      rootDir,
      "supabase",
      "migrations",
      "0002_waitlist_position_sequence.sql"
    );
    expect(fs.existsSync(migrationPath)).toBe(true);

    const sql = fs.readFileSync(migrationPath, "utf-8");
    expect(sql).toContain("waitlist_signups_position_seq");
    expect(sql).toContain("alter table public.waitlist_signups add column if not exists position");
    expect(sql).toContain("setval");
    expect(sql).toContain("waitlist_signups_position_idx");
  });
});
