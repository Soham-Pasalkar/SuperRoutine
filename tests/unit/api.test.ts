import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/waitlist/route";
import { GET } from "@/app/api/waitlist/count/route";
import { NextRequest } from "next/server";
import { resetMemoryRateLimiter, setMockRateLimiter } from "@/lib/ratelimit";
import {
  resetInMemoryWaitlist,
  setMockSupabaseClient,
} from "@/lib/supabase-server";

describe("Waitlist API Routes", () => {
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

  const validPayload = {
    firstName: "Aditi",
    phone: "+91 98765 43210",
    consent: true,
    answers: {
      packaging: "info",
      format: "sachets",
      build: "premade",
      customItems: [],
      priceMin: 1200,
      priceMax: 3300,
    },
    turnstileToken: "test-token",
  };

  it("POST /api/waitlist successfully registers a founding member", async () => {
    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.position).toBe(1);
    expect(data.duplicate).toBeUndefined();

    // Verify GET /api/waitlist/count reflects the new member
    const countRes = await GET();
    expect(countRes.status).toBe(200);
    const countData = await countRes.json();
    expect(countData.ok).toBe(true);
    expect(countData.count).toBe(1);
  });

  it("GET /api/waitlist/count returns ok: true with genuine count of zero when empty", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.count).toBe(0);
  });

  it("GET /api/waitlist/count returns 500 with ok: false when database query fails, never returning fake zero", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          count: null,
          error: { code: "50000", message: "Database down" },
        }),
      }),
    };
    setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);

    const res = await GET();
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.count).toBeUndefined();
    expect(data.error).toBe("Failed to retrieve waitlist count");
  });

  it("POST /api/waitlist handles concurrent signups with unique monotonic positions", async () => {
    const reqA = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        firstName: "Concurrent User A",
        phone: "+919876543221",
      }),
    });

    const reqB = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        firstName: "Concurrent User B",
        phone: "+919876543222",
      }),
    });

    const [resA, resB] = await Promise.all([POST(reqA), POST(reqB)]);
    expect(resA.status).toBe(201);
    expect(resB.status).toBe(201);

    const dataA = await resA.json();
    const dataB = await resB.json();

    expect(dataA.ok).toBe(true);
    expect(dataB.ok).toBe(true);
    expect(dataA.position).not.toBe(dataB.position);
    expect([dataA.position, dataB.position].sort()).toEqual([1, 2]);
  });

  it("POST /api/waitlist handles duplicate phone gracefully with existing position", async () => {
    const req1 = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    await POST(req1);

    // Duplicate request
    const req2 = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        firstName: "Aditi S.",
      }),
    });

    const res2 = await POST(req2);
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.ok).toBe(true);
    expect(data2.duplicate).toBe(true);
    expect(data2.position).toBe(1);
  });

  it("POST /api/waitlist rejects requests with bot honeypot populated", async () => {
    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        hp: "automated-bot-payload",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("POST /api/waitlist rejects invalid phone numbers", async () => {
    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPayload,
        phone: "12345", // Invalid Indian phone
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("POST /api/waitlist returns safe 500 when rate limiting service fails", async () => {
    setMockRateLimiter({
      limit: async () => {
        throw new Error("Upstash rate limit unreachable");
      },
    });

    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe("Service temporarily unavailable. Please try again later.");
  });

  it("POST /api/waitlist returns safe 500 and never reports success on database insert failure", async () => {
    const mockClient = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "50000", message: "Database down" },
            }),
          }),
        }),
      }),
    };
    setMockSupabaseClient(mockClient as unknown as import("@supabase/supabase-js").SupabaseClient);

    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.position).toBeUndefined();
    expect(data.error).toBe("We could not save your answers. Check your connection and try again.");
  });
});
