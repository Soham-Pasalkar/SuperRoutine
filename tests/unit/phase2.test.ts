import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Phase 2 Remediation Checks", () => {
  const rootDir = process.cwd();

  it("ensures public/images/hero-OLD-contains-errors.jpg has been permanently removed and production poster exists", () => {
    const oldAssetPath = path.join(
      rootDir,
      "public",
      "images",
      "hero-OLD-contains-errors.jpg"
    );
    expect(fs.existsSync(oldAssetPath)).toBe(false);

    const posterAssetPath = path.join(
      rootDir,
      "public",
      "images",
      "hero-poster.webp"
    );
    expect(fs.existsSync(posterAssetPath)).toBe(true);
    const stat = fs.statSync(posterAssetPath);
    expect(stat.size).toBeGreaterThan(1000);
  });

  it("verifies production hero stage references valid hero-poster asset and maintains fallback without legacy references", () => {
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

  it("verifies neither Privacy nor Terms pages contain [TODO] or legal-review placeholders", () => {
    const privacyPath = path.join(rootDir, "src", "app", "privacy", "page.tsx");
    const privacyContent = fs.readFileSync(privacyPath, "utf-8");

    expect(privacyContent).not.toContain("[TODO");
    expect(privacyContent).not.toContain("TODO:");
    expect(privacyContent).not.toContain("Legal Review Required");

    const termsPath = path.join(rootDir, "src", "app", "terms", "page.tsx");
    const termsContent = fs.readFileSync(termsPath, "utf-8");

    expect(termsContent).not.toContain("[TODO");
    expect(termsContent).not.toContain("TODO:");
    expect(termsContent).not.toContain("Legal Review Required");
  });

  it("verifies Terms page contains conservative draft wording for the waitlist", () => {
    const termsPath = path.join(rootDir, "src", "app", "terms", "page.tsx");
    const content = fs.readFileSync(termsPath, "utf-8");

    expect(content).toContain("Waitlist Participation");
    expect(content).toContain("Payments Disabled");
    expect(content).toContain("Notice:");
    expect(content).toContain("voluntary and free of charge");
  });

  it("verifies Privacy Policy accurately describes data handling without fabricated contacts or unverified claims", () => {
    const privacyPath = path.join(
      rootDir,
      "src",
      "app",
      "privacy",
      "page.tsx"
    );
    const content = fs.readFileSync(privacyPath, "utf-8");

    // Does not use fabricated privacy email fallback
    expect(content).not.toContain("privacy@superroutine.com");

    // Accurately discloses that survey answers are stored linked to the entry
    expect(content).toContain("stored linked to your waitlist entry in our database");

    // Discloses collected personal data
    expect(content).toContain("WhatsApp Mobile Number");
    expect(content).toContain("First Name");
    expect(content).toContain("Salted IP Hash");

    // Discloses what is NOT collected
    expect(content).toContain("Aadhaar");

    // Identifies infrastructure processors
    expect(content).toContain("Supabase");
    expect(content).toContain("Cloudflare");
    expect(content).toContain("Upstash");
    expect(content).toContain("Vercel");

    // Labels policy as interim pre-launch draft without claiming certified compliance
    expect(content).toContain("interim draft privacy statement");
  });

  it("verifies migration 0002_waitlist_position_sequence.sql exists with collision-proof backfill and sequence ownership", () => {
    const migrationPath = path.join(
      rootDir,
      "supabase",
      "migrations",
      "0002_waitlist_position_sequence.sql"
    );
    expect(fs.existsSync(migrationPath)).toBe(true);

    const sql = fs.readFileSync(migrationPath, "utf-8");
    expect(sql).toContain("begin;");
    expect(sql).toContain("commit;");
    expect(sql).toContain("waitlist_signups_position_seq");
    expect(sql).toContain("alter table public.waitlist_signups add column if not exists position");
    expect(sql).toContain("current_max");
    expect(sql).toContain("owned by public.waitlist_signups.position");
    expect(sql).toContain("seq_state as");
    expect(sql).toContain("table_state as");
    expect(sql).toContain("case when is_called then last_value + 1 else last_value end");
    expect(sql).toContain("setval");
    expect(sql).toContain("greatest(");
    expect(sql).toContain("waitlist_signups_position_idx");
  });

  it("verifies sequence next value calculation correctly models PostgreSQL semantics and prevents rewinds", () => {
    // Calculates what the migration's Step 4 CTE yields
    function calcNextSequenceValue(
      maxPositionInTable: number | null,
      seqLastValue: number,
      seqIsCalled: boolean
    ) {
      const nextSeqVal = seqIsCalled ? seqLastValue + 1 : seqLastValue;
      const nextTableVal = (maxPositionInTable ?? 0) + 1;
      return Math.max(nextTableVal, nextSeqVal);
    }

    // 1. Fresh database, empty table, newly created sequence
    // In Postgres, CREATE SEQUENCE initializes with last_value = 1, is_called = false
    expect(calcNextSequenceValue(null, 1, false)).toBe(1);

    // 2. Existing database with 5 rows backfilled (positions 1..5), sequence was fresh
    expect(calcNextSequenceValue(5, 1, false)).toBe(6);

    // 3. Partially populated / gaps: max position is 12, sequence was at 5
    expect(calcNextSequenceValue(12, 5, true)).toBe(13);

    // 4. Deleted rows: max position in table dropped from 15 to 12 because rows 13..15 were deleted
    // Sequence had called up to 15 (last_value = 15, is_called = true)
    // Next value must be 16, NEVER rewinding back to 13
    expect(calcNextSequenceValue(12, 15, true)).toBe(16);

    // 5. Migration rerun: after previous step set sequence to 16 with is_called = false
    // Sequence now has last_value = 16, is_called = false. Table still has max = 12.
    // Must remain 16, perfectly idempotent!
    expect(calcNextSequenceValue(12, 16, false)).toBe(16);

    // 6. Repeated rerun: still 16 indefinitely
    expect(calcNextSequenceValue(12, 16, false)).toBe(16);
  });
});
