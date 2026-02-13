"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const r = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const signUp = async () => {
    setStatus(null);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) return setStatus(error.message);

    // Depending on Supabase email-confirm settings, user may need to confirm email.
    setStatus("Account created. You can log in now.");
    r.push("/auth/login");
  };

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <h2 style={{ margin: 0 }}>Create account</h2>

      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inp}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inp}
          />

          <button onClick={signUp} style={btn}>Sign up</button>
          {status ? <div style={{ fontSize: 13, opacity: 0.85 }}>{status}</div> : null}

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            Have an account? <a href="/auth/login">Sign in</a>
          </div>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };