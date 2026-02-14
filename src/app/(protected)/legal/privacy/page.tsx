// =========================================================
// File: src/app/(protected)/legal/privacy/page.tsx
// Protected privacy page (org + role header) using shared content.
// =========================================================
import React from "react";
import Link from "next/link";

import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ORG_COOKIE, sanitizeOrgId } from "@/lib/orgContext";
import { getCookie } from "@/lib/serverCookies";

type MemberRow = { org_id: string; role: "owner" | "member"; created_at?: string };
type OrgRow = { id: string; name: string };

export const dynamic = "force-dynamic";

async function resolveOrgForUser(
  userId: string,
): Promise<{ orgId: string | null; role: MemberRow["role"] | null }> {
  const supabase = await getSupabaseServerClient();
  const cookieOrg = sanitizeOrgId(await getCookie(ORG_COOKIE));

  if (cookieOrg) {
    const { data: m } = await supabase
      .from("org_members")
      .select("org_id,role")
      .eq("org_id", cookieOrg)
      .eq("user_id", userId)
      .maybeSingle();

    const row = m as MemberRow | null;
    if (row?.org_id) return { orgId: cookieOrg, role: row.role };
  }

  const { data: ms } = await supabase
    .from("org_members")
    .select("org_id,role,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  const first = ms?.[0] as MemberRow | undefined;
  return { orgId: first?.org_id ?? null, role: first?.role ?? null };
}

async function resolveOrgName(orgId: string): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { data: org } = await supabase.from("organizations").select("id,name").eq("id", orgId).maybeSingle();
  return (org as OrgRow | null)?.name ?? null;
}

export default async function ProtectedPrivacyPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return (
      <main style={{ width: "100%", display: "grid", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Privacy</h1>
        <p style={{ opacity: 0.75 }}>You must be signed in to view the org-scoped legal page.</p>
        <Link href="/privacy">View public privacy page</Link>
      </main>
    );
  }

  const { orgId, role } = await resolveOrgForUser(user.id);
  const orgName = orgId ? await resolveOrgName(orgId) : null;

  return (
    <main style={{ width: "100%", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
        <h1 style={{ margin: 0 }}>Privacy</h1>
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
          {orgName ? `Org: ${orgName}` : orgId ? `Org: ${orgId.slice(0, 8)}…` : "Org: —"} ·{" "}
          {role === "owner" ? "Owner" : "Member"}
        </span>
      </div>

      <PrivacyPolicyContent variant="protected" />
    </main>
  );
}