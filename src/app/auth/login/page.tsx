"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase.client";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const login = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
    r.push("/dashboard");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
          <button onClick={login} style={btn}>Login</button>
          <a href="/signup" style={{ fontSize: 13 }}>Create account</a>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };