import React from "react";
import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/branding";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!DEMO_MODE) {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/auth/login");
  }

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 900 }}>
      <h2 style={{ margin: 0 }}>Dashboard</h2>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        {DEMO_MODE ? "Demo mode is enabled." : "Welcome back."}
      </div>
    </main>
  );
}