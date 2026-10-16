import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata as rootMetadata } from "@/app/layout";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import PosterPage from "@/app/poster/page";
import nextConfig from "../../next.config";

describe("Phase 3: Production Metadata & Basic Web Infrastructure", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe("Sitemap & Robots", () => {
    it("generates sitemap with canonical production URLs and expected public routes", () => {
      const items = sitemap();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(3);

      const urls = items.map((i) => i.url);
      expect(urls).toContain("https://superroutine.in/");
      expect(urls).toContain("https://superroutine.in/privacy");
      expect(urls).toContain("https://superroutine.in/terms");

      // Verify no sensitive or internal routes are included
      urls.forEach((url) => {
        expect(url).not.toContain("/poster");
        expect(url).not.toContain("/api");
      });

      // Verify priorities and change frequencies
      const home = items.find((i) => i.url === "https://superroutine.in/");
      expect(home?.priority).toBe(1.0);
      expect(home?.changeFrequency).toBe("weekly");

      const privacy = items.find((i) => i.url === "https://superroutine.in/privacy");
      expect(privacy?.priority).toBe(0.3);

      const terms = items.find((i) => i.url === "https://superroutine.in/terms");
      expect(terms?.priority).toBe(0.3);
    });

    it("generates robots configuration allowing public index and disallowing internal routes", () => {
      const config = robots();
      expect(config.sitemap).toBe("https://superroutine.in/sitemap.xml");

      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
      const defaultRule = rules.find((r) => r.userAgent === "*");
      expect(defaultRule).toBeDefined();
      expect(defaultRule?.allow).toBe("/");
      expect(defaultRule?.disallow).toEqual(["/api/", "/poster"]);
    });
  });

  describe("Metadata & Canonical URLs", () => {
    it("configures root metadataBase using canonical site URL", () => {
      expect(rootMetadata.metadataBase).toBeDefined();
      expect(rootMetadata.metadataBase?.origin).toBe("https://superroutine.in");
    });

    it("configures Open Graph and Twitter cards referencing verified brand asset", () => {
      expect(rootMetadata.openGraph).toBeDefined();
      expect(rootMetadata.openGraph?.siteName).toBe("Super Routine");
      expect(rootMetadata.openGraph?.locale).toBe("en_IN");
      expect(rootMetadata.openGraph?.images).toEqual([
        {
          url: "/images/logo.png",
          width: 700,
          height: 417,
          alt: "Super Routine",
        },
      ]);

      expect(rootMetadata.twitter).toBeDefined();
      expect((rootMetadata.twitter as { card?: string })?.card).toBe("summary");
      expect(rootMetadata.twitter?.images).toEqual(["/images/logo.png"]);
    });

    it("configures canonical alternates on root and subpages", () => {
      expect(rootMetadata.alternates?.canonical).toBe("/");
      expect(privacyMetadata.alternates?.canonical).toBe("/privacy");
      expect(termsMetadata.alternates?.canonical).toBe("/terms");
    });

    it("configures subpage Open Graph and Twitter cards", () => {
      expect(privacyMetadata.openGraph?.url).toBe("/privacy");
      expect((privacyMetadata.twitter as { card?: string })?.card).toBe("summary");

      expect(termsMetadata.openGraph?.url).toBe("/terms");
      expect((termsMetadata.twitter as { card?: string })?.card).toBe("summary");
    });
  });

  describe("Favicon & App Icon Assets", () => {
    it("verifies icon assets exist in src/app with valid file contents", () => {
      const iconPath = path.resolve(__dirname, "../../src/app/icon.png");
      const appleIconPath = path.resolve(__dirname, "../../src/app/apple-icon.png");
      const faviconPath = path.resolve(__dirname, "../../src/app/favicon.ico");

      expect(fs.existsSync(iconPath)).toBe(true);
      expect(fs.statSync(iconPath).size).toBeGreaterThan(1000);

      expect(fs.existsSync(appleIconPath)).toBe(true);
      expect(fs.statSync(appleIconPath).size).toBeGreaterThan(1000);

      expect(fs.existsSync(faviconPath)).toBe(true);
      expect(fs.statSync(faviconPath).size).toBeGreaterThan(500);
    });
  });

  describe("Route Protection: /poster", () => {
    it("returns notFound in production environment with 404 HTTP fallback", () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      try {
        PosterPage();
        expect.unreachable("PosterPage should have thrown notFound() in production");
      } catch (err: unknown) {
        const error = err as { digest?: string; message?: string };
        expect(error.digest || error.message).toMatch(/404|NEXT_HTTP_ERROR_FALLBACK|NEXT_NOT_FOUND/);
      }
    });

    it("renders stage in development environment for poster generation", () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "development";
      const result = PosterPage();
      expect(result).toBeDefined();
    });
  });

  describe("Security Headers & CSP", () => {
    it("configures production security headers with HSTS and strict CSP without unsafe-eval", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      if (!nextConfig.headers) {
        throw new Error("nextConfig.headers is not defined");
      }
      const headerConfigs = await nextConfig.headers();
      const allRoutes = headerConfigs.find((c) => c.source === "/:path*");
      expect(allRoutes).toBeDefined();

      const headers = allRoutes!.headers;
      const getHeader = (key: string) => headers.find((h) => h.key === key)?.value;

      expect(getHeader("X-Content-Type-Options")).toBe("nosniff");
      expect(getHeader("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(getHeader("X-Frame-Options")).toBe("DENY");
      expect(getHeader("Permissions-Policy")).toContain("camera=()");
      expect(getHeader("Permissions-Policy")).toContain("microphone=()");
      expect(getHeader("Permissions-Policy")).toContain("geolocation=()");

      // HSTS must be present in production
      expect(getHeader("Strict-Transport-Security")).toBe(
        "max-age=63072000; includeSubDomains; preload"
      );

      const csp = getHeader("Content-Security-Policy");
      expect(csp).toBeDefined();

      // Check essential CSP directives in production
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
      expect(csp).toContain("worker-src 'self' blob:");
      expect(csp).toContain("https://challenges.cloudflare.com");
      expect(csp).toContain("https://app.posthog.com");
      expect(csp).toContain("img-src 'self' data: blob:");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");

      // Production must NOT contain unsafe-eval or wildcards
      expect(csp).not.toContain("'unsafe-eval'");
      expect(csp).not.toContain("https:*");
      expect(csp).not.toContain("http:*");
    });

    it("configures development headers allowing unsafe-eval for Next.js Fast Refresh without HSTS", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "development";
      if (!nextConfig.headers) {
        throw new Error("nextConfig.headers is not defined");
      }
      const headerConfigs = await nextConfig.headers();
      const allRoutes = headerConfigs.find((c) => c.source === "/:path*");
      expect(allRoutes).toBeDefined();

      const headers = allRoutes!.headers;
      const getHeader = (key: string) => headers.find((h) => h.key === key)?.value;

      // HSTS must NOT be set in local development
      expect(getHeader("Strict-Transport-Security")).toBeUndefined();

      const csp = getHeader("Content-Security-Policy");
      expect(csp).toBeDefined();
      expect(csp).toContain("'unsafe-eval'");
    });
  });
});
