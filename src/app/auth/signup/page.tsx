"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SignupPage() {
  const r = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signUp = async () => {
    setStatus(null);
    setBusy(true);

    try {
      const supabase = getSupabaseBrowserClient(); // browser-only

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setStatus(error.message);
        return;
      }

      setStatus("Account created. Check your email if confirmation is required.");
      r.push("/auth/login");
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Signup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h2 style={{ margin: 0 }}>Create account</h2>

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
            autoComplete="new-password"
          />

          <button onClick={signUp} style={btn} disabled={busy}>
            {busy ? "Creating..." : "Sign up"}
          </button>

          {status ? <div style={{ fontSize: 13, opacity: 0.85 }}>{status}</div> : null}

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            Have an account? <Link href="/auth/login">Sign in</Link>
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