import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { extractIp, hashIp } from "@/lib/ip";
import {
  checkRateLimit,
  resetMemoryRateLimiter,
  setMockRateLimiter,
} from "@/lib/ratelimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  insertWaitlistSignup,
  getWaitlistCount,
  deleteWaitlistSignupByPhone,
  resetInMemoryWaitlist,
  setMockSupabaseClient,
} from "@/lib/supabase-server";
import { waitlistSchema } from "@/lib/schemas";
import { serverEnv } from "@/lib/env";

describe("Backend and API logic", () => {
  beforeEach(() => {
    resetMemoryRateLimiter();
    resetInMemoryWaitlist();
    setMockRateLimiter(null);
    setMockSupabaseClient(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setMockRateLimiter(null);
    setMockSupabaseClient(null);
    vi.restoreAllMocks();
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
    it("allows up to 5 requests and blocks the 6th in memory limiter", async () => {
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

    it("fails safely when rate limiting service encounters an error", async () => {
      setMockRateLimiter({
        limit: async () => {
          throw new Error("Upstash Redis connection timeout");
        },
      });

      await expect(checkRateLimit("client-123")).rejects.toThrow(
        "Upstash Redis connection timeout"
      );
    });
  });

  describe("Turnstile Token Verification", () => {
    it("bypasses verification when TURNSTILE_SECRET_KEY is empty in dev/test", async () => {
      const res = await verifyTurnstileToken("");
      expect(res.success).toBe(true);
    });

    it("fails when token is missing and secret key is provided", async () => {
      const originalKey = serverEnv.TURNSTILE_SECRET_KEY;
      try {
        serverEnv.TURNSTILE_SECRET_KEY = "test-secret";
        const res = await verifyTurnstileToken("");
        expect(res.success).toBe(false);
        expect(res.errorCodes).toContain("missing-input-response");
      } finally {
        serverEnv.TURNSTILE_SECRET_KEY = originalKey;
      }
    });

    it("successfully verifies token with mocked Cloudflare verification service", async () => {
      const originalKey = serverEnv.TURNSTILE_SECRET_KEY;
      try {
        serverEnv.TURNSTILE_SECRET_KEY = "test-secret-key";
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            success: true,
            challenge_ts: new Date().toISOString(),
          }),
        } as unknown as Response);

        const res = await verifyTurnstileToken("valid-token-from-cf");
        expect(res.success).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      } finally {
        serverEnv.TURNSTILE_SECRET_KEY = originalKey;
      }
    });

    it("handles invalid or rejected Turnstile tokens correctly", async () => {
      const originalKey = serverEnv.TURNSTILE_SECRET_KEY;
      try {
        serverEnv.TURNSTILE_SECRET_KEY = "test-secret-key";
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            success: false,
            "error-codes": ["invalid-input-response"],
          }),
        } as unknown as Response);

        const res = await verifyTurnstileToken("invalid-token");
        expect(res.success).toBe(false);
        expect(res.errorCodes).toContain("invalid-input-response");
      } finally {
        serverEnv.TURNSTILE_SECRET_KEY = originalKey;
      }
    });

    it("handles Cloudflare service request failures without crashing", async () => {
      const originalKey = serverEnv.TURNSTILE_SECRET_KEY;
      try {
        serverEnv.TURNSTILE_SECRET_KEY = "test-secret-key";
        global.fetch = vi.fn().mockRejectedValue(new Error("Network offline"));

        const res = await verifyTurnstileToken("any-token");
        expect(res.success).toBe(false);
        expect(res.errorCodes).toContain("turnstile-request-failed");
      } finally {
        serverEnv.TURNSTILE_SECRET_KEY = originalKey;
      }
    });
  });

  describe("Waitlist DB operations", () => {
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

    it("inserts first member with position 1 in dev memory store", async () => {
      const res = await insertWaitlistSignup(samplePayload);
      expect(res.ok).toBe(true);
      expect(res.duplicate).toBe(false);
      expect(res.position).toBe(1);
      expect(await getWaitlistCount()).toBe(1);
    });

    it("increments position for subsequent signups in dev memory store", async () => {
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

    it("handles database insert failure by throwing and never returning false success", async () => {
      // Mock Supabase client returning an insert error
      const mockClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "50000", message: "Database connection failed" },
              }),
            }),
          }),
        }),
      };

      setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);

      await expect(insertWaitlistSignup(samplePayload)).rejects.toThrow(
        "Database insert failed: Database connection failed"
      );
    });

    it("returns existing position on duplicate phone in database query path", async () => {
      const mockClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "23505", message: "duplicate key value violates unique constraint" },
              }),
            }),
          }),
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { position: 42 },
                error: null,
              }),
            }),
          }),
        }),
      };

      setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);
      const res = await insertWaitlistSignup(samplePayload);
      expect(res.ok).toBe(true);
      expect(res.duplicate).toBe(true);
      expect(res.position).toBe(42);
    });

    it("correctly parses string-serialized bigint positions from database responses", async () => {
      const mockClient = {
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "test-uuid", created_at: "2026-10-16T12:00:00Z", position: "105" },
                error: null,
              }),
            }),
          }),
        }),
      };

      setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);
      const res = await insertWaitlistSignup(samplePayload);
      expect(res.ok).toBe(true);
      expect(res.duplicate).toBe(false);
      expect(res.position).toBe(105);
      expect(typeof res.position).toBe("number");
    });

    it("returns existing position on duplicate phone in memory store without overwriting", async () => {
      const first = await insertWaitlistSignup(samplePayload);
      expect(first.position).toBe(1);

      await insertWaitlistSignup({
        ...samplePayload,
        phoneE164: "+919876543211",
      });

      // Repeat first phone with different name
      const dup = await insertWaitlistSignup({
        ...samplePayload,
        firstName: "Changed Name",
      });

      expect(dup.duplicate).toBe(true);
      expect(dup.position).toBe(1);
      expect(await getWaitlistCount()).toBe(2);
    });

    it("allocates monotonic sequential positions under concurrent submissions", async () => {
      const signups = await Promise.all([
        insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543001" }),
        insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543002" }),
        insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543003" }),
      ]);

      const positions = signups.map((s) => s.position);
      expect(new Set(positions).size).toBe(3);
      expect(positions.sort()).toEqual([1, 2, 3]);
    });

    it("maintains stable positions when an earlier signup is deleted, preserving gaps without position shift", async () => {
      const u1 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543011" });
      const u2 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543012" });
      const u3 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543013" });

      expect(u1.position).toBe(1);
      expect(u2.position).toBe(2);
      expect(u3.position).toBe(3);

      // User 2 requests erasure
      await deleteWaitlistSignupByPhone("+919876543012");
      expect(await getWaitlistCount()).toBe(2);

      // Verify u1 and u3 still retain their original immutable positions
      const dup1 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543011" });
      const dup3 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543013" });
      expect(dup1.position).toBe(1);
      expect(dup3.position).toBe(3);

      // Next new signup receives #4, not re-using gap #2
      const u4 = await insertWaitlistSignup({ ...samplePayload, phoneE164: "+919876543014" });
      expect(u4.position).toBe(4);
    });

    it("getWaitlistCount throws on database query failure and never returns fake 0", async () => {
      const mockClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            count: null,
            error: { code: "42P01", message: "relation waitlist_signups does not exist" },
          }),
        }),
      };

      setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);
      await expect(getWaitlistCount()).rejects.toThrow(
        "Failed to count waitlist signups: relation waitlist_signups does not exist"
      );
    });

    it("prevents activating mock Supabase client or mock rate limiter in production", () => {
      const originalEnv = serverEnv.NODE_ENV;
      try {
        serverEnv.NODE_ENV = "production";
        expect(() => setMockSupabaseClient({} as import("@supabase/supabase-js").SupabaseClient)).toThrow(
          "Cannot set mock Supabase client in production"
        );
        expect(() => setMockRateLimiter({ limit: async () => ({ success: true, limit: 5, remaining: 5, reset: 0 }) })).toThrow(
          "Cannot set mock rate limiter in production"
        );
      } finally {
        serverEnv.NODE_ENV = originalEnv;
      }
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
