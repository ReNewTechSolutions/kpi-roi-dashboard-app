import React from "react";
import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/branding";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!DEMO_MODE) {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/auth/login");
  }
  return <>{children}</>;
}