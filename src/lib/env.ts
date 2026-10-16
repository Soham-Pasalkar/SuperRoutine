import { z } from "zod";

const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SUPABASE_URL: z.string().url().optional().or(z.literal("")),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional().or(z.literal("")),
    TURNSTILE_SECRET_KEY: z.string().min(1).optional().or(z.literal("")),
    UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional().or(z.literal("")),
    IP_HASH_SALT: z.string().min(1).default("default-dev-salt-change-in-production"),
    COUNTER_MIN_DISPLAY: z.coerce.number().default(25),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional().or(z.literal("")),
    RAZORPAY_KEY_ID: z.string().optional().or(z.literal("")),
    RAZORPAY_KEY_SECRET: z.string().optional().or(z.literal("")),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Only enforce strict credentials at runtime in production (skip during Next.js static build phase)
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    if (data.NODE_ENV === "production" && !isBuildPhase) {
      if (!data.SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SUPABASE_URL is required in production",
          path: ["SUPABASE_URL"],
        });
      }
      if (!data.SUPABASE_SERVICE_ROLE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SUPABASE_SERVICE_ROLE_KEY is required in production",
          path: ["SUPABASE_SERVICE_ROLE_KEY"],
        });
      }
      if (!data.TURNSTILE_SECRET_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TURNSTILE_SECRET_KEY is required in production",
          path: ["TURNSTILE_SECRET_KEY"],
        });
      }
      if (!data.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY is required in production",
          path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
        });
      }
      if (!data.UPSTASH_REDIS_REST_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UPSTASH_REDIS_REST_URL is required in production",
          path: ["UPSTASH_REDIS_REST_URL"],
        });
      }
      if (!data.UPSTASH_REDIS_REST_TOKEN) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UPSTASH_REDIS_REST_TOKEN is required in production",
          path: ["UPSTASH_REDIS_REST_TOKEN"],
        });
      }
      const weakSalts = [
        "default-dev-salt-change-in-production",
        "change-me",
        "dev-salt",
        "salt",
      ];
      if (
        !data.IP_HASH_SALT ||
        weakSalts.includes(data.IP_HASH_SALT) ||
        data.IP_HASH_SALT.length < 16
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A strong IP_HASH_SALT (at least 16 characters, not predictable default) is required in production",
          path: ["IP_HASH_SALT"],
        });
      }
    }
  });

const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional().or(z.literal("")),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional().or(z.literal("")),
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional().or(z.literal("")),
    NEXT_PUBLIC_INSTAGRAM: z.string().url().optional().or(z.literal("")),
    NEXT_PUBLIC_LINKEDIN: z.string().url().optional().or(z.literal("")),
    NEXT_PUBLIC_WHATSAPP: z.string().url().optional().or(z.literal("")),
    NEXT_PUBLIC_YOUTUBE: z.string().url().optional().or(z.literal("")),
    NEXT_PUBLIC_PAYMENTS_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((val) => val === "true"),
  })
  .superRefine((data, ctx) => {
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    const isProd = process.env.NODE_ENV === "production";
    if (isProd && !isBuildPhase && !data.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY is required in production",
        path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
      });
    }
  });

const isServer = typeof window === "undefined";

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  NEXT_PUBLIC_INSTAGRAM: process.env.NEXT_PUBLIC_INSTAGRAM,
  NEXT_PUBLIC_LINKEDIN: process.env.NEXT_PUBLIC_LINKEDIN,
  NEXT_PUBLIC_WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP,
  NEXT_PUBLIC_YOUTUBE: process.env.NEXT_PUBLIC_YOUTUBE,
  NEXT_PUBLIC_PAYMENTS_ENABLED: process.env.NEXT_PUBLIC_PAYMENTS_ENABLED ?? "false",
});

export const serverEnv = isServer
  ? serverEnvSchema.parse(process.env)
  : ({} as z.infer<typeof serverEnvSchema>);

export function validateProductionEnv(rawEnv: Record<string, string | undefined>) {
  return serverEnvSchema.safeParse({
    ...rawEnv,
    NODE_ENV: "production",
  });
}
