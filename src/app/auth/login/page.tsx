"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const r = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const signIn = async () => {
    setStatus(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) return setStatus(error.message);
    r.push("/dashboard");
  };

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <h2 style={{ margin: 0 }}>Login</h2>

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

          <button onClick={signIn} style={btn}>Sign in</button>
          {status ? <div style={{ fontSize: 13, opacity: 0.85 }}>{status}</div> : null}

          <div style={{ fontSize: 13, opacity: 0.75 }}>
            No account? <a href="/auth/signup">Create one</a>
          </div>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };