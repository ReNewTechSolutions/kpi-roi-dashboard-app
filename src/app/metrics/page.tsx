"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import NumberField from "@/components/NumberField";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getCachedOrgId } from "@/lib/storage";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function MetricsPage() {
  const r = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [month, setMonth] = useState("2026-02-01");
  const [revenue, setRevenue] = useState(20000);
  const [cost, setCost] = useState(11000);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        r.push("/auth/login"); // ✅ correct route
        return;
      }
      setOrgId(getCachedOrgId());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const save = async () => {
    setStatus(null);

    const { data: sess } = await supabase.auth.getSession();
    const userId = sess.session?.user.id;
    if (!userId) return setStatus("Not signed in.");

    let useOrgId = orgId;
    if (!useOrgId) {
      const { data: orgs, error: orgErr } = await supabase.from("organizations").select("id").limit(1);
      if (orgErr || !orgs?.[0]?.id) return setStatus("No org selected. Go to Organizations.");
      useOrgId = orgs[0].id;
    }

    const { error } = await supabase.from("kpi_entries").upsert({
      org_id: useOrgId,
      month,
      revenue,
      cost,
      notes,
      created_by: userId,
    });

    setStatus(error ? error.message : "Saved!");
  };

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Metrics Entry</h2>

      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, opacity: 0.85 }}>Month (YYYY-MM-01)</span>
            <input value={month} onChange={(e) => setMonth(e.target.value)} style={inp} />
          </label>

          <NumberField label="Revenue" prefix="$" value={revenue} onChange={setRevenue} />
          <NumberField label="Cost" prefix="$" value={cost} onChange={setCost} />

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 14, opacity: 0.85 }}>Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inp, height: 90 }} />
          </label>

          <button onClick={save} style={btn}>Save</button>
          {status ? <div style={{ fontSize: 13, opacity: 0.85 }}>{status}</div> : null}
        </div>
      </Card>
    </main>
  );
}

const inp: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn: React.CSSProperties = { padding: 12, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };