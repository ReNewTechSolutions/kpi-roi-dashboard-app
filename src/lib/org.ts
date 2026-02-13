import type { SupabaseClient } from "@supabase/supabase-js";

export type Org = { id: string; name: string };

export async function fetchOrgs(supabase: SupabaseClient): Promise<Org[]> {
  const { data, error } = await supabase
    .from("organizations")
    .select("id,name")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Org[];
}

export async function createOrg(supabase: SupabaseClient, name: string, userId: string) {
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name, created_by: userId })
    .select("id,name")
    .single();

  if (error) throw error;
  return data as Org;
}

export async function addOwnerMembership(supabase: SupabaseClient, orgId: string, userId: string) {
  const { error } = await supabase
    .from("org_members")
    .insert({ org_id: orgId, user_id: userId, role: "owner" });

  if (error) throw error;
}

export async function renameOrg(supabase: SupabaseClient, orgId: string, name: string) {
  const { error } = await supabase
    .from("organizations")
    .update({ name })
    .eq("id", orgId);

  if (error) throw error;
}