import { NextResponse } from "next/server";
import { getWaitlistCount } from "@/lib/supabase-server";

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("Waitlist count error:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
