// =========================================================
// File: src/app/(protected)/layout.tsx
// Patch:
// - Use getCookie() helper (cookies() is async)
// - Resolve org + role server-side
// - Pass orgName + role into AppShell
// =========================================================
import React from "react";
import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell";
import { ORG_COOKIE, sanitizeOrgId } from "@/lib/orgContext";
import { DEMO_MODE } from "@/lib/branding";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCookie } from "@/lib/serverCookies";

export const dynamic = "force-dynamic";

type MemberRow = { org_id: string; role: "owner" | "member"; created_at?: string };
type OrgRow = { id: string; name: string };

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

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Demo Mode: no auth required
  if (DEMO_MODE) {
    const cookieOrg = sanitizeOrgId(await getCookie(ORG_COOKIE));
    const demoOrgId = cookieOrg ?? "demo-org";
    return (
      <AppShell userEmail={null} currentOrgId={demoOrgId} currentOrgName="Demo Organization" currentOrgRole="owner">
        {children}
      </AppShell>
    );
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !user) redirect("/auth/login");

  const { orgId, role } = await resolveOrgForUser(user.id);
  const orgName = orgId ? await resolveOrgName(orgId) : null;

  return (
    <AppShell userEmail={user.email ?? null} currentOrgId={orgId} currentOrgName={orgName} currentOrgRole={role}>
      {children}
    </AppShell>
  );
}