"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  const r = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Optional: if already signed in, jump to dashboard
  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (data.session) r.replace("/dashboard");
      } catch {
        // ignore (build/SSR safety or env)
      }
    })();
  }, [r]);

  const signIn = async () => {
    setStatus(null);
    setBusy(true);

    try {
      const supabase = getSupabaseBrowserClient(); // browser-only

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      r.push("/dashboard");
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h2 style={{ margin: 0 }}>Login</h2>

      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inp}
            autoComplete="email"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inp}
            autoComplete="current-password"
          />

          <button onClick={signIn} style={btn} disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>

          {status ? <div style={{ fontSize: 13, opacity: 0.85 }}>{status}</div> : null}

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            No account? <Link href="/auth/signup">Create one</Link>
          </div>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
};

const btn: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  cursor: "pointer",
};