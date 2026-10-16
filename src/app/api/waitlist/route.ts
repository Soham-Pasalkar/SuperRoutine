import { NextRequest, NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/schemas";
import { extractIp, hashIp } from "@/lib/ip";
import { checkRateLimit } from "@/lib/ratelimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { insertWaitlistSignup } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // 1. Validate with Zod (includes honeypot check `hp: z.string().max(0)`)
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstIssue?.message || "Validation failed" },
        { status: 400 }
      );
    }

    // In production, Turnstile token is mandatory
    const isProduction = process.env.NODE_ENV === "production";
    if (
      isProduction &&
      (!parsed.data.turnstileToken || !parsed.data.turnstileToken.trim())
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Verification check required. Please complete the security challenge.",
        },
        { status: 400 }
      );
    }

    // 2. Rate-limit by hashed IP
    const clientIp = extractIp(request.headers);
    let ipHash: string;
    try {
      ipHash = hashIp(clientIp);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Service temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    let rateLimit;
    try {
      rateLimit = await checkRateLimit(ipHash);
    } catch {
      // In production, rate limit service failures fail safely with 500
      return NextResponse.json(
        {
          ok: false,
          error: "Service temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many requests. Please wait a few minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimit.reset - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // 3. Turnstile token verification
    const turnstileResult = await verifyTurnstileToken(
      parsed.data.turnstileToken,
      clientIp
    );
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Verification check failed. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    // 4. Insert into database (handles duplicate phone by returning existing position)
    const userAgent = request.headers.get("user-agent") || undefined;
    let result;
    try {
      result = await insertWaitlistSignup({
        firstName: parsed.data.firstName,
        phoneE164: parsed.data.phone,
        consent: parsed.data.consent,
        answers: parsed.data.answers,
        utm: parsed.data.utm,
        ipHash,
        userAgent,
      });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "We could not save your answers. Check your connection and try again.",
        },
        { status: 500 }
      );
    }

    if (result.duplicate) {
      return NextResponse.json(
        { ok: true, duplicate: true, position: result.position },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, position: result.position },
      { status: 201 }
    );
  } catch {
    // Sanitize log: do not log payload, tokens, or PII
    console.error("Unhandled waitlist submission error");
    return NextResponse.json(
      {
        ok: false,
        error: "We could not save your answers. Check your connection and try again.",
      },
      { status: 500 }
    );
  }
}
