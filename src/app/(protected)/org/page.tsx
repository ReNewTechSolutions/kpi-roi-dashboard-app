"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { clearCachedOrgId, getDemoMode, setDemoMode } from "@/lib/storage";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const r = useRouter();

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [demo, setDemo] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowserClient();
    setSupabase(sb);

    (async () => {
      const { data: sess } = await sb.auth.getSession();
      if (!sess.session) return r.push("/auth/login");
      setEmail(sess.session.user.email ?? null);
      setDemo(getDemoMode());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (v: boolean) => {
    setDemo(v);
    setDemoMode(v);
  };

  const signOut = async () => {
    if (!supabase) return;
    clearCachedOrgId();
    await supabase.auth.signOut();
    r.push("/auth/login");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Settings</h2>

      <Card>
        <div>
          Signed in as: <b>{email ?? "—"}</b>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 800 }}>Demo Mode</div>
        <div style={{ opacity: 0.75, marginTop: 6 }}>
          When ON, dashboard uses built-in sample data (great for screenshots + first-run).
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
          <input type="checkbox" checked={demo} onChange={(e) => toggle(e.target.checked)} />
          <div>{demo ? "ON" : "OFF"}</div>
        </div>
      </Card>

      <button onClick={signOut} style={btn} disabled={!supabase}>
        Sign out
      </button>
    </main>
  );
}

const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };