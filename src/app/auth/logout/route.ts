/* =========================================================
      OPTIONAL: File: src/app/auth/logout/route.ts
      Lets you hit /auth/logout to sign out server-side (useful for links).
      Requires: src/lib/supabase/server.ts already present in your repo.
      ========================================================= */
      import { NextResponse } from "next/server";
      import { getSupabaseServerClient } from "@/lib/supabase/server";
      
      export const dynamic = "force-dynamic";
      
      export async function GET() {
        const supabase = await getSupabaseServerClient();
        await supabase.auth.signOut();
      
        const url = new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
        return NextResponse.redirect(url);
      }