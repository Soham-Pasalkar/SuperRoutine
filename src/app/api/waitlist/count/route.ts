import { NextResponse } from "next/server";
import { getWaitlistCount } from "@/lib/supabase-server";

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json(
      { ok: true, count },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    console.error("Waitlist count error");
    return NextResponse.json(
      { ok: false, error: "Failed to retrieve waitlist count" },
      { status: 500 }
    );
  }
}
