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
  position: number;
}

const memoryRows: MemoryRow[] = [];
let memoryPositionSequence = 0;

let supabaseClient: SupabaseClient | null = null;
let mockSupabaseClient: SupabaseClient | null = null;

export function setMockSupabaseClient(mock: SupabaseClient | null) {
  if (serverEnv.NODE_ENV === "production") {
    throw new Error("Cannot set mock Supabase client in production");
  }
  mockSupabaseClient = mock;
}

export function getSupabaseServerClient(): SupabaseClient | null {
  if (serverEnv.NODE_ENV !== "production" && mockSupabaseClient) {
    return mockSupabaseClient;
  }
  if (!supabaseClient && serverEnv.SUPABASE_URL && serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
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
  return supabaseClient;
}

export async function insertWaitlistSignup(
  input: WaitlistSignupInput
): Promise<WaitlistSignupResult> {
  const isProduction = serverEnv.NODE_ENV === "production";
  const client = getSupabaseServerClient();

  if (!client) {
    if (isProduction) {
      throw new Error("Supabase configuration missing in production");
    }

    // In-memory fallback: strictly dev / test only
    const existingRow = memoryRows.find(
      (r) => r.phone_e164 === input.phoneE164
    );

    if (existingRow) {
      return {
        ok: true,
        duplicate: true,
        position: existingRow.position,
      };
    }

    memoryPositionSequence += 1;
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
      position: memoryPositionSequence,
    };

    memoryRows.push(row);
    return {
      ok: true,
      duplicate: false,
      position: row.position,
    };
  }

  // Insert into Supabase (PostgreSQL default nextval('public.waitlist_signups_position_seq') assigns monotonic position)
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
    .select("id, created_at, position")
    .single();

  if (error) {
    // 23505 is PostgreSQL unique violation code (duplicate phone_e164)
    if (error.code === "23505") {
      const { data: existing, error: fetchErr } = await client
        .from("waitlist_signups")
        .select("position")
        .eq("phone_e164", input.phoneE164)
        .single();

      const existingPos = existing ? Number(existing.position) : NaN;
      if (fetchErr || !existing || !Number.isFinite(existingPos)) {
        throw new Error("Failed to retrieve existing waitlist position");
      }

      return {
        ok: true,
        duplicate: true,
        position: existingPos,
      };
    }

    // Sanitize log: do not log raw phone or PII
    console.error("Database insert error code:", error.code);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  const newPos = data ? Number(data.position) : NaN;
  if (!Number.isFinite(newPos)) {
    throw new Error("Invalid position returned from database");
  }

  return {
    ok: true,
    duplicate: false,
    position: newPos,
  };
}

export async function getWaitlistCount(): Promise<number> {
  const isProduction = serverEnv.NODE_ENV === "production";
  const client = getSupabaseServerClient();
  if (!client) {
    if (isProduction) {
      throw new Error("Supabase configuration missing in production");
    }
    return memoryRows.length;
  }

  const { count, error } = await client
    .from("waitlist_signups")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Supabase count query error code:", error.code);
    throw new Error(`Failed to count waitlist signups: ${error.message}`);
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
  memoryPositionSequence = 0;
}
