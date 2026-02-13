"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase.client";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";

export default function SignupPage() {
  const r = useRouter();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const signup = async () => {
    setErr(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company } }, // matches your DB trigger if you keep it
    });
    if (error) return setErr(error.message);
    r.push("/dashboard");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <Card>
        <h2 style={{ marginTop: 0 }}>Create account</h2>
        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
        <div style={{ display: "grid", gap: 10 }}>
          <input placeholder="Company / Org name" value={company} onChange={(e) => setCompany(e.target.value)} style={inp} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inp} />
          <button onClick={signup} style={btn}>Sign up</button>
          <a href="/login" style={{ fontSize: 13 }}>Back to login</a>
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };