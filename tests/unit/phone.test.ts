import { describe, it, expect } from "vitest";
import { normalizePhone } from "@/lib/phone";

describe("Phone normalization utility", () => {
  it("normalizes a standard 10-digit number", () => {
    const res = normalizePhone("9876543210");
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe("+919876543210");
    expect(res.formatted).toBe("+91 98765 43210");
  });

  it("handles +91 prefix with spaces and dashes", () => {
    const res = normalizePhone("+91 98765-43210");
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe("+919876543210");
  });

  it("handles 0 prefix", () => {
    const res = normalizePhone("09876543210");
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe("+919876543210");
  });

  it("handles 91 prefix without plus", () => {
    const res = normalizePhone("919876543210");
    expect(res.isValid).toBe(true);
    expect(res.e164).toBe("+919876543210");
  });

  it("rejects numbers starting with invalid digits (e.g. 5 or 1)", () => {
    const res = normalizePhone("5876543210");
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("rejects too short or too long inputs", () => {
    expect(normalizePhone("98765").isValid).toBe(false);
    expect(normalizePhone("987654321012").isValid).toBe(false);
    expect(normalizePhone("").isValid).toBe(false);
  });
});
