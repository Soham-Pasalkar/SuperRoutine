import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional().or(z.literal("")),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional().or(z.literal("")),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional().or(z.literal("")),
  IP_HASH_SALT: z.string().min(1).default("default-dev-salt-change-in-production"),
  COUNTER_MIN_DISPLAY: z.coerce.number().default(25),
  RAZORPAY_KEY_ID: z.string().optional().or(z.literal("")),
  RAZORPAY_KEY_SECRET: z.string().optional().or(z.literal("")),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
});

const clientEnvSchema = z.object({
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
