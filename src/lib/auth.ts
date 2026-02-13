import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireSession(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}