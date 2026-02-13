import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Client-side Supabase instance.
 * Safe for App Router because it will only initialize in the browser.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase browser client cannot be created on the server.");
  }

  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  if (!supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

/**
 * Convenience export for files that previously did:
 *   import { supabase } from "@/lib/supabase"
 *
 * IMPORTANT: only use this inside Client Components and inside effects/handlers.
 */
export const supabase = (() => {
  if (typeof window === "undefined") return null as unknown as SupabaseClient;
  return getSupabaseBrowserClient();
})();