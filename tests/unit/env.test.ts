import { describe, it, expect } from "vitest";
import { clientEnv } from "@/lib/env";
import { supplementsData } from "@/lib/supplements";

describe("Environment & Setup", () => {
  it("has valid client environment defaults", () => {
    expect(clientEnv.NEXT_PUBLIC_SITE_URL).toBeDefined();
    expect(clientEnv.NEXT_PUBLIC_PAYMENTS_ENABLED).toBe(false);
  });

  it("loads supplements data correctly", () => {
    expect(supplementsData.SUPS.day).toHaveLength(4);
    expect(supplementsData.SUPS.night).toHaveLength(4);
    expect(Object.keys(supplementsData.PILLS)).toHaveLength(8);
  });
});
