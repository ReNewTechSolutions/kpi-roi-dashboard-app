// =========================================================
// File: src/lib/supabase/server.ts
// Server-only helpers using ONLY @supabase/supabase-js.
// - Normalizes Next 16 cookies()/headers() sync/async via nextRequest helpers.
// - getSupabaseServerClient() is async (callers must await).
// =========================================================
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCookieStore, getHeaderStore } from "@/lib/nextRequest";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function bearerTokenFromHeaders(): Promise<string | null> {
  const h = await getHeaderStore();
  const raw = h.get("authorization") ?? h.get("Authorization");
  if (!raw) return null;

  const [scheme, token] = raw.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  const trimmed = token.trim();
  return trimmed.length ? trimmed : null;
}

async function accessTokenFromCookies(): Promise<string | null> {
  const store = await getCookieStore();

  const direct =
    store.get("sb-access-token")?.value ??
    store.get("supabase-auth-token")?.value ??
    store.get("access_token")?.value;

  if (direct) return direct;

  const authCookie = store.getAll().find((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
  if (!authCookie?.value) return null;

  const raw = safeDecodeURIComponent(authCookie.value);
  const parsed = safeJsonParse(raw);

  if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];

  if (parsed && typeof parsed === "object" && "access_token" in (parsed as Record<string, unknown>)) {
    const token = (parsed as Record<string, unknown>).access_token;
    return typeof token === "string" ? token : null;
  }

  return null;
}

async function authHeaderForServerClient(): Promise<Record<string, string> | undefined> {
  const token = (await bearerTokenFromHeaders()) ?? (await accessTokenFromCookies());
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function getSupabaseAdminClient(): SupabaseClient {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const authHeader = await authHeaderForServerClient();

  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: authHeader ? { headers: authHeader } : undefined,
  });
}