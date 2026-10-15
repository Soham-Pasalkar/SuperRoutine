import { describe, it, expect, beforeEach } from "vitest";
import { extractIp, hashIp } from "@/lib/ip";
import { checkRateLimit, resetMemoryRateLimiter } from "@/lib/ratelimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  insertWaitlistSignup,
  getWaitlistCount,
  deleteWaitlistSignupByPhone,
  resetInMemoryWaitlist,
} from "@/lib/supabase-server";
import { waitlistSchema } from "@/lib/schemas";

describe("Backend and API logic", () => {
  beforeEach(() => {
    resetMemoryRateLimiter();
    resetInMemoryWaitlist();
  });

  describe("IP and Hashing", () => {
    it("extracts IP from x-forwarded-for header", () => {
      const headers = new Headers({
        "x-forwarded-for": "203.0.113.195, 70.41.3.18",
      });
      expect(extractIp(headers)).toBe("203.0.113.195");
    });

    it("extracts IP from x-real-ip if forwarded-for is missing", () => {
      const headers = new Headers({
        "x-real-ip": "198.51.100.1",
      });
      expect(extractIp(headers)).toBe("198.51.100.1");
    });

    it("falls back to 127.0.0.1 if no IP headers present", () => {
      const headers = new Headers();
      expect(extractIp(headers)).toBe("127.0.0.1");
    });

    it("hashes IP consistently and never returns raw IP", () => {
      const ip = "192.0.2.1";
      const h1 = hashIp(ip);
      const h2 = hashIp(ip);
      expect(h1).toBe(h2);
      expect(h1).toHaveLength(64);
      expect(h1).not.toContain(ip);
    });
  });

  describe("Rate Limiting", () => {
    it("allows up to 5 requests and blocks the 6th", async () => {
      const id = "test-client-ip";
      for (let i = 0; i < 5; i++) {
        const res = await checkRateLimit(id);
        expect(res.success).toBe(true);
        expect(res.remaining).toBe(4 - i);
      }

      const blocked = await checkRateLimit(id);
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
    });
  });

  describe("Turnstile Token Verification", () => {
    it("bypasses verification when TURNSTILE_SECRET_KEY is empty in dev", async () => {
      const res = await verifyTurnstileToken("");
      expect(res.success).toBe(true);
    });
  });

  describe("Waitlist In-Memory DB operations", () => {
    const samplePayload = {
      firstName: "Aarav",
      phoneE164: "+919876543210",
      consent: true,
      answers: {
        packaging: "info" as const,
        format: "sachets" as const,
        build: "premade" as const,
        customItems: [],
        priceMin: 1200,
        priceMax: 3300,
      },
    };

    it("inserts first member with position 1", async () => {
      const res = await insertWaitlistSignup(samplePayload);
      expect(res.ok).toBe(true);
      expect(res.duplicate).toBe(false);
      expect(res.position).toBe(1);
      expect(await getWaitlistCount()).toBe(1);
    });

    it("increments position for subsequent signups", async () => {
      await insertWaitlistSignup(samplePayload);
      const second = await insertWaitlistSignup({
        ...samplePayload,
        firstName: "Diya",
        phoneE164: "+919876543211",
      });

      expect(second.position).toBe(2);
      expect(second.duplicate).toBe(false);
      expect(await getWaitlistCount()).toBe(2);
    });

    it("returns existing position on duplicate phone without creating new entry", async () => {
      const first = await insertWaitlistSignup(samplePayload);
      expect(first.position).toBe(1);

      // Second user with different phone
      await insertWaitlistSignup({
        ...samplePayload,
        phoneE164: "+919876543211",
      });

      // Repeat first phone
      const dup = await insertWaitlistSignup({
        ...samplePayload,
        firstName: "Changed Name",
      });

      expect(dup.duplicate).toBe(true);
      expect(dup.position).toBe(1); // Position remains #1
      expect(await getWaitlistCount()).toBe(2);
    });

    it("can delete a signup by phone for compliance", async () => {
      await insertWaitlistSignup(samplePayload);
      expect(await getWaitlistCount()).toBe(1);

      const deleted = await deleteWaitlistSignupByPhone("+919876543210");
      expect(deleted).toBe(true);
      expect(await getWaitlistCount()).toBe(0);

      const notFound = await deleteWaitlistSignupByPhone("+919876543210");
      expect(notFound).toBe(false);
    });
  });

  describe("Zod schema validation", () => {
    it("validates a full correct payload", () => {
      const valid = {
        firstName: "Priya",
        phone: "+91 98765 43210",
        consent: true,
        answers: {
          packaging: "designer",
          format: "either",
          build: "custom",
          customItems: ["Magnesium Glycinate", "Vitamin D3 + K2"],
          priceMin: 1500,
          priceMax: 3000,
        },
      };

      const result = waitlistSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe("+919876543210");
      }
    });

    it("fails when honeypot hp is filled", () => {
      const bot = {
        firstName: "SpamBot",
        phone: "9876543210",
        consent: true,
        answers: {
          packaging: "info",
          format: "sachets",
          build: "unsure",
          customItems: [],
          priceMin: 1000,
          priceMax: 2000,
        },
        hp: "I am a spam bot",
      };

      const result = waitlistSchema.safeParse(bot);
      expect(result.success).toBe(false);
    });

    it("fails when priceMin > priceMax", () => {
      const invalidPrice = {
        firstName: "Rohan",
        phone: "9876543210",
        consent: true,
        answers: {
          packaging: "info",
          format: "sachets",
          build: "premade",
          customItems: [],
          priceMin: 3500,
          priceMax: 1500,
        },
      };

      const result = waitlistSchema.safeParse(invalidPrice);
      expect(result.success).toBe(false);
    });
  });
});
