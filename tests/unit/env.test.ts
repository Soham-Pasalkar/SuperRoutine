import { describe, it, expect } from "vitest";
import { clientEnv, validateProductionEnv } from "@/lib/env";
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

  describe("Production Environment Validation", () => {
    it("rejects production configuration when required service keys are missing", () => {
      const emptyProd = validateProductionEnv({});
      expect(emptyProd.success).toBe(false);

      if (!emptyProd.success) {
        const paths = emptyProd.error.issues.map((i) => i.path.join("."));
        expect(paths).toContain("SUPABASE_URL");
        expect(paths).toContain("SUPABASE_SERVICE_ROLE_KEY");
        expect(paths).toContain("TURNSTILE_SECRET_KEY");
        expect(paths).toContain("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
        expect(paths).toContain("UPSTASH_REDIS_REST_URL");
        expect(paths).toContain("UPSTASH_REDIS_REST_TOKEN");
        expect(paths).toContain("IP_HASH_SALT");
      }
    });

    it("rejects weak or predictable IP_HASH_SALT in production", () => {
      const weakProd = validateProductionEnv({
        SUPABASE_URL: "https://xyzcompany.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "ey-test-service-key",
        TURNSTILE_SECRET_KEY: "0x4AAAAAAtest-secret-key",
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAtest-site-key",
        UPSTASH_REDIS_REST_URL: "https://test-redis.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
        IP_HASH_SALT: "default-dev-salt-change-in-production",
      });
      expect(weakProd.success).toBe(false);
      if (!weakProd.success) {
        const saltIssue = weakProd.error.issues.find(
          (i) => i.path[0] === "IP_HASH_SALT"
        );
        expect(saltIssue).toBeDefined();
      }
    });

    it("accepts complete and strong production configuration", () => {
      const validProd = validateProductionEnv({
        SUPABASE_URL: "https://xyzcompany.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "ey-test-service-key",
        TURNSTILE_SECRET_KEY: "0x4AAAAAAtest-secret-key",
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAtest-site-key",
        UPSTASH_REDIS_REST_URL: "https://test-redis.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
        IP_HASH_SALT: "strong-random-salt-for-super-routine-production-2026",
      });
      expect(validProd.success).toBe(true);
    });
  });
});
