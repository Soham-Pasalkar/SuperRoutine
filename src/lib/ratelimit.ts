import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { serverEnv } from "./env";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback for local dev / testing
class MemoryRateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private store = new Map<string, number[]>();

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const timestamps = (this.store.get(identifier) || []).filter(
      (ts) => now - ts < this.windowMs
    );

    if (timestamps.length >= this.maxRequests) {
      const oldest = timestamps[0] ?? now;
      const reset = oldest + this.windowMs;
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      };
    }

    timestamps.push(now);
    this.store.set(identifier, timestamps);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - timestamps.length,
      reset: now + this.windowMs,
    };
  }

  reset() {
    this.store.clear();
  }
}

// 5 requests per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

let upstashLimiter: Ratelimit | null = null;
if (serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN) {
  upstashLimiter = new Ratelimit({
    redis: new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "10 m"),
    analytics: false,
    prefix: "sr_waitlist",
  });
}

const memoryLimiter = new MemoryRateLimiter(MAX_REQUESTS, WINDOW_MS);

let mockRateLimiter: { limit: (id: string) => Promise<RateLimitResult> } | null = null;

export function setMockRateLimiter(
  mock: { limit: (id: string) => Promise<RateLimitResult> } | null
) {
  if (serverEnv.NODE_ENV === "production") {
    throw new Error("Cannot set mock rate limiter in production");
  }
  mockRateLimiter = mock;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const isProduction = serverEnv.NODE_ENV === "production";

  if (!isProduction && mockRateLimiter) {
    return mockRateLimiter.limit(identifier);
  }

  if (upstashLimiter) {
    try {
      const res = await upstashLimiter.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch {
      console.error("Upstash rate limit request failed");
      throw new Error("Rate limiting service failure");
    }
  }

  if (isProduction) {
    throw new Error("Rate limiting service not configured in production");
  }

  // Explicit development / test fallback
  return memoryLimiter.limit(identifier);
}

export function resetMemoryRateLimiter() {
  memoryLimiter.reset();
}
