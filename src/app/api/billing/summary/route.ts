// =========================================================
// File: src/app/api/billing/summary/route.ts
// =========================================================
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orgId = url.searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

    const supabase = await getSupabaseServerClient(); // ✅ FIX
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: membership } = await supabase
      .from("org_members")
      .select("role")
      .eq("org_id", orgId)
      .eq("user_id", data.user.id)
      .maybeSingle();

    const isOwner = (membership as { role: "owner" | "member" } | null)?.role === "owner";

    // Default until Stripe tables exist
    return NextResponse.json({ isOwner, plan: "free" as const });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 });
  }
}