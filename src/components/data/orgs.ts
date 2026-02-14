// =========================================================
// File: src/data/orgs.ts
// - Browser-only org queries (RLS enforced)
// - Stronger typing for the joined select shape
// =========================================================
import { getSupabaseBrowserClient } from "@/lib/supabase";

export type Organization = {
  id: string;
  name: string;
  created_at: string;
};

type OrgMemberRow = {
  org_id: string;
  organizations: Organization | null;
};

export async function listMyOrganizations(): Promise<Organization[]> {
  const supabase = await getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("org_members")
    .select("org_id, organizations:organizations(id, name, created_at)")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as unknown as OrgMemberRow[];

  const orgs: Organization[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const org = row.organizations;
    if (!org) continue;
    if (seen.has(org.id)) continue;
    seen.add(org.id);
    orgs.push(org);
  }

  return orgs;
}