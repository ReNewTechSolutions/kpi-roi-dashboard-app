import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Browser-only Supabase client.
 * IMPORTANT: Call this only inside useEffect, event handlers, or other browser-only code.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (_client) return _client;

  if (typeof window === "undefined") {
    // This keeps builds from exploding if someone accidentally calls it during SSR
    throw new Error("getSupabaseBrowserClient must be called in the browser.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  if (!supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}