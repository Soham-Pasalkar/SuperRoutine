import { describe, it, expect } from "vitest";
import { supplementsData } from "@/lib/supplements";

describe("Phase 2 - Interactivity & Accordion logic", () => {
  it("has valid supplement names matching pill config keys", () => {
    const allSupplements = [
      ...supplementsData.SUPS.day,
      ...supplementsData.SUPS.night,
    ];

    allSupplements.forEach((sup) => {
      expect(supplementsData.PILLS[sup.n]).toBeDefined();
      const pill = supplementsData.PILLS[sup.n];
      expect(pill?.W).toBeGreaterThan(0);
      expect(pill?.H).toBeGreaterThan(0);
      expect(pill?.T).toBeGreaterThan(0);
      expect(["cap", "disc", "caps", "gel"]).toContain(pill?.k);
    });
  });

  it("handles single-open accordion toggle logic correctly", () => {
    let openSupplement: string | null = null;

    const toggle = (name: string) => {
      openSupplement = openSupplement === name ? null : name;
    };

    // Open first supplement
    toggle("Magnesium Glycinate");
    expect(openSupplement).toBe("Magnesium Glycinate");

    // Clicking another closes the first and opens the second
    toggle("Zinc Picolinate");
    expect(openSupplement).toBe("Zinc Picolinate");

    // Clicking the same supplement closes it
    toggle("Zinc Picolinate");
    expect(openSupplement).toBeNull();
  });
});
