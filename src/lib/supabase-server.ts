import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "./env";

export interface WaitlistSignupInput {
  firstName: string;
  phoneE164: string;
  consent: boolean;
  consentTextVersion?: string;
  answers: {
    packaging: "info" | "designer";
    format: "sachets" | "jars" | "either";
    build: "premade" | "custom" | "unsure";
    customItems: string[];
    priceMin: number;
    priceMax: number;
  };
  utm?: Record<string, string>;
  ipHash?: string;
  userAgent?: string;
}

export interface WaitlistSignupResult {
  ok: boolean;
  duplicate: boolean;
  position: number;
}

// Memory store fallback for dev / tests
interface MemoryRow {
  id: string;
  created_at: string;
  first_name: string;
  phone_e164: string;
  consent: boolean;
  consent_text_version: string;
  answers: WaitlistSignupInput["answers"];
  utm?: Record<string, string>;
  ip_hash?: string;
  user_agent?: string;
}

const memoryRows: MemoryRow[] = [];

let supabaseClient: SupabaseClient | null = null;
if (serverEnv.SUPABASE_URL && serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseClient = createClient(
    serverEnv.SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export function getSupabaseServerClient(): SupabaseClient | null {
  return supabaseClient;
}

export async function insertWaitlistSignup(
  input: WaitlistSignupInput
): Promise<WaitlistSignupResult> {
  const client = getSupabaseServerClient();

  if (!client) {
    // In-memory fallback
    const existingIndex = memoryRows.findIndex(
      (r) => r.phone_e164 === input.phoneE164
    );

    if (existingIndex !== -1) {
      return {
        ok: true,
        duplicate: true,
        position: existingIndex + 1,
      };
    }

    const row: MemoryRow = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      first_name: input.firstName,
      phone_e164: input.phoneE164,
      consent: input.consent,
      consent_text_version: input.consentTextVersion || "v1",
      answers: input.answers,
      utm: input.utm,
      ip_hash: input.ipHash,
      user_agent: input.userAgent,
    };

    memoryRows.push(row);
    return {
      ok: true,
      duplicate: false,
      position: memoryRows.length,
    };
  }

  // Insert into Supabase
  const { data, error } = await client
    .from("waitlist_signups")
    .insert({
      first_name: input.firstName,
      phone_e164: input.phoneE164,
      consent: input.consent,
      consent_text_version: input.consentTextVersion || "v1",
      answers: input.answers,
      utm: input.utm ?? null,
      ip_hash: input.ipHash ?? null,
      user_agent: input.userAgent ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    // 23505 is PostgreSQL unique violation code
    if (error.code === "23505") {
      const { data: existing, error: fetchErr } = await client
        .from("waitlist_signups")
        .select("created_at")
        .eq("phone_e164", input.phoneE164)
        .single();

      if (fetchErr || !existing) {
        throw new Error("Failed to retrieve existing waitlist position");
      }

      const { count } = await client
        .from("waitlist_signups")
        .select("*", { count: "exact", head: true })
        .lte("created_at", existing.created_at);

      return {
        ok: true,
        duplicate: true,
        position: count ?? 1,
      };
    }

    console.error("Supabase insert error:", error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  // Calculate position for new signup
  const { count } = await client
    .from("waitlist_signups")
    .select("*", { count: "exact", head: true })
    .lte("created_at", data.created_at);

  return {
    ok: true,
    duplicate: false,
    position: count ?? 1,
  };
}

export async function getWaitlistCount(): Promise<number> {
  const client = getSupabaseServerClient();
  if (!client) {
    return memoryRows.length;
  }

  const { count, error } = await client
    .from("waitlist_signups")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Supabase count error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function deleteWaitlistSignupByPhone(
  phoneE164: string
): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) {
    const idx = memoryRows.findIndex((r) => r.phone_e164 === phoneE164);
    if (idx !== -1) {
      memoryRows.splice(idx, 1);
      return true;
    }
    return false;
  }

  const { error } = await client
    .from("waitlist_signups")
    .delete()
    .eq("phone_e164", phoneE164);

  if (error) {
    console.error("Supabase delete error:", error);
    return false;
  }

  return true;
}

export function resetInMemoryWaitlist() {
  memoryRows.length = 0;
}
