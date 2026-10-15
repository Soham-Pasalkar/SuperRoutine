import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/waitlist/route";
import { GET } from "@/app/api/waitlist/count/route";
import { NextRequest } from "next/server";
import { resetMemoryRateLimiter } from "@/lib/ratelimit";
import { resetInMemoryWaitlist } from "@/lib/supabase-server";

describe("Waitlist API Routes", () => {
  beforeEach(() => {
    resetMemoryRateLimiter();
    resetInMemoryWaitlist();
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
    expect(countData.count).toBe(1);
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
});
