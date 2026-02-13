"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { clearCachedOrgId, getDemoMode, setDemoMode } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const r = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []); // ✅ add this

  const [demo, setDemo] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
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
    clearCachedOrgId();
    await supabase.auth.signOut();
    r.push("/auth/login");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Settings</h2>

      <Card>
        <div>Signed in as: <b>{email ?? "—"}</b></div>
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

      <button onClick={signOut} style={btn}>Sign out</button>
    </main>
  );
}

const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };