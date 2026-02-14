// =========================================================
// File: src/app/(protected)/metrics/page.tsx
// Rewrite:
// - Demo-mode safe (no Supabase calls; uses seeded local rows)
// - Single org resolution (cached -> membership fallback)
// - Owner role derived from org_members.role (no RPC pitfalls)
// - Uses SparklineChart (ResizeObserver + tooltip)
// =========================================================
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/Card";
import NumberField from "@/components/NumberField";
import SparklineChart from "@/components/SparklineChart";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getCachedOrgId } from "@/lib/storage";
import { DEMO_MODE } from "@/lib/branding";

type Status = { kind: "ok" | "error"; message: string } | null;

type KPIEntry = {
  id: string;
  org_id: string;
  month: string; // YYYY-MM-01
  revenue: number;
  cost: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type OrgMemberRow = { org_id: string; role: "owner" | "member"; created_at: string };
type OrgRow = { id: string; name: string };

function firstDayOfMonthISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function monthOptions(count: number) {
  const now = new Date();
  const out: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      value: firstDayOfMonthISO(d),
      label: d.toLocaleDateString(undefined, { year: "numeric", month: "short" }),
    });
  }
  return out;
}

function money(n: number) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function MonthPicker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, opacity: 0.85 }}>Month</span>
      <select value={value} onChange={(e) => onChange(e.currentTarget.value)} style={inp} aria-label="Month">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label} ({o.value})
          </option>
        ))}
      </select>
    </label>
  );
}

function makeDemoRows(): KPIEntry[] {
  const months = monthOptions(12).map((m) => m.value).reverse(); // oldest -> newest
  const baseRev = 18000;
  const baseCost = 9500;

  return months.map((month, i) => {
    const wiggle = (i % 4) * 1200;
    const revenue = baseRev + wiggle + i * 450;
    const cost = baseCost + (i % 3) * 650 + i * 200;
    return {
      id: `demo-${month}`,
      org_id: "demo-org",
      month,
      revenue,
      cost,
      notes: i % 3 === 0 ? "Demo seeded entry" : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
    };
  }).reverse(); // newest first (matches table sort)
}

export const dynamic = "force-dynamic";

export default function MetricsPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const months = useMemo(() => monthOptions(24), []);
  const [month, setMonth] = useState(() => months[0]?.value ?? firstDayOfMonthISO(new Date()));
  const [revenue, setRevenue] = useState(20000);
  const [cost, setCost] = useState(11000);
  const [notes, setNotes] = useState("");

  const [orgId, setOrgId] = useState<string | null>(DEMO_MODE ? "demo-org" : null);
  const [orgName, setOrgName] = useState<string | null>(DEMO_MODE ? "Demo Organization" : null);
  const [role, setRole] = useState<"owner" | "member">(DEMO_MODE ? "owner" : "member");

  const [rows, setRows] = useState<KPIEntry[]>(DEMO_MODE ? makeDemoRows() : []);
  const [loadingRows, setLoadingRows] = useState(false);

  const [editing, setEditing] = useState<KPIEntry | null>(null);
  const [editRevenue, setEditRevenue] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const [editNotes, setEditNotes] = useState("");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const ensureAuthed = useCallback(async (): Promise<string> => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.replace("/auth/login");
      throw new Error("Not signed in.");
    }
    return data.session.user.id;
  }, [router, supabase]);

  const resolveOrgContext = useCallback(
    async (
      userId: string,
    ): Promise<{ orgId: string; role: "owner" | "member"; orgName: string | null }> => {
      const cached = getCachedOrgId();

      if (cached) {
        const { data: m } = await supabase
          .from("org_members")
          .select("org_id,role,created_at")
          .eq("user_id", userId)
          .eq("org_id", cached)
          .maybeSingle();

        const mem = m as OrgMemberRow | null;
        if (mem?.org_id) {
          const { data: org } = await supabase.from("organizations").select("id,name").eq("id", cached).maybeSingle();
          const orgRow = org as OrgRow | null;
          return { orgId: cached, role: mem.role ?? "member", orgName: orgRow?.name ?? null };
        }
      }

      const { data: ms, error } = await supabase
        .from("org_members")
        .select("org_id,role,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      const first = ms?.[0] as OrgMemberRow | undefined;
      if (error || !first?.org_id) throw new Error("No org selected. Go to Org.");

      const { data: org } = await supabase.from("organizations").select("id,name").eq("id", first.org_id).maybeSingle();
      const orgRow = org as OrgRow | null;

      return { orgId: first.org_id, role: first.role ?? "member", orgName: orgRow?.name ?? null };
    },
    [supabase],
  );

  const loadRows = useCallback(
    async (useOrgId: string) => {
      setLoadingRows(true);
      try {
        const { data, error } = await supabase
          .from("kpi_entries")
          .select("id,org_id,month,revenue,cost,notes,created_at,updated_at,created_by")
          .eq("org_id", useOrgId)
          .order("month", { ascending: false })
          .limit(50);

        if (error) throw new Error(error.message);
        setRows((data as KPIEntry[]) ?? []);
      } finally {
        setLoadingRows(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    if (DEMO_MODE) return;

    let alive = true;
    (async () => {
      try {
        const userId = await ensureAuthed();
        const ctx = await resolveOrgContext(userId);
        if (!alive) return;

        setOrgId(ctx.orgId);
        setOrgName(ctx.orgName);
        setRole(ctx.role);

        await loadRows(ctx.orgId);
      } catch (e: unknown) {
        if (!alive) return;
        setStatus({ kind: "error", message: e instanceof Error ? e.message : "Failed to load." });
      }
    })();

    return () => {
      alive = false;
    };
  }, [ensureAuthed, loadRows, resolveOrgContext]);

  async function saveNew() {
    if (DEMO_MODE) {
      setStatus({ kind: "ok", message: "Demo mode: changes are not persisted." });
      return;
    }
    if (busy) return;

    setBusy(true);
    setStatus(null);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) throw new Error("Not signed in.");
      if (!orgId) throw new Error("No org selected.");

      const payload = {
        org_id: orgId,
        month,
        revenue: Math.max(0, Number(revenue) || 0),
        cost: Math.max(0, Number(cost) || 0),
        notes: notes.trim() || null,
        created_by: userData.user.id,
      };

      const { error } = await supabase.from("kpi_entries").upsert(payload);
      if (error) throw new Error(error.message);

      setStatus({ kind: "ok", message: "Saved!" });
      await loadRows(orgId);
    } catch (e: unknown) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Save failed." });
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(row: KPIEntry) {
    setEditing(row);
    setEditRevenue(Number(row.revenue) || 0);
    setEditCost(Number(row.cost) || 0);
    setEditNotes(row.notes ?? "");
  }

  async function saveEdit() {
    if (DEMO_MODE) {
      setEditing(null);
      setStatus({ kind: "ok", message: "Demo mode: changes are not persisted." });
      return;
    }
    if (!editing || busy) return;

    setBusy(true);
    setStatus(null);

    try {
      if (!orgId) throw new Error("No org selected.");

      const { error } = await supabase
        .from("kpi_entries")
        .update({
          revenue: Math.max(0, Number(editRevenue) || 0),
          cost: Math.max(0, Number(editCost) || 0),
          notes: editNotes.trim() || null,
        })
        .eq("id", editing.id)
        .eq("org_id", orgId);

      if (error) throw new Error(error.message);

      setEditing(null);
      setStatus({ kind: "ok", message: "Updated!" });
      await loadRows(orgId);
    } catch (e: unknown) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Update failed." });
    } finally {
      setBusy(false);
    }
  }

  async function deleteRow(row: KPIEntry) {
    if (DEMO_MODE) {
      setStatus({ kind: "ok", message: "Demo mode: changes are not persisted." });
      return;
    }
    if (role !== "owner") {
      setStatus({ kind: "error", message: "Only org owners can delete KPI entries." });
      return;
    }
    if (busy) return;

    const ok = window.confirm(`Delete KPI entry for ${row.month}? This cannot be undone.`);
    if (!ok) return;

    setBusy(true);
    setStatus(null);

    try {
      if (!orgId) throw new Error("No org selected.");

      const { error } = await supabase.from("kpi_entries").delete().eq("id", row.id).eq("org_id", orgId);
      if (error) throw new Error(error.message);

      setStatus({ kind: "ok", message: "Deleted." });
      await loadRows(orgId);
    } catch (e: unknown) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setBusy(false);
    }
  }

  const recent12 = rows.slice(0, 12);
  const sumRevenue = recent12.reduce((a, r) => a + (Number(r.revenue) || 0), 0);
  const sumCost = recent12.reduce((a, r) => a + (Number(r.cost) || 0), 0);
  const sumNet = sumRevenue - sumCost;
  const netMargin = sumRevenue > 0 ? (sumNet / sumRevenue) * 100 : 0;

  const chartMonths = useMemo(() => rows.slice(0, 12).reverse().map((r) => r.month), [rows]);
  const chartRev = useMemo(() => rows.slice(0, 12).reverse().map((r) => Number(r.revenue) || 0), [rows]);
  const chartCost = useMemo(() => rows.slice(0, 12).reverse().map((r) => Number(r.cost) || 0), [rows]);
  const chartNet = useMemo(
    () => rows.slice(0, 12).reverse().map((r) => (Number(r.revenue) || 0) - (Number(r.cost) || 0)),
    [rows],
  );

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Metrics</h2>
        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
          {orgName ? `Org: ${orgName}` : orgId ? `Org: ${orgId.slice(0, 8)}…` : "Org: —"} ·{" "}
          {role === "owner" ? "Owner" : "Member"}
          {DEMO_MODE ? " · Demo" : ""}
        </span>
      </div>

      <Card title="Last 12 months snapshot">
        <div style={grid3}>
          <div style={statCard}>
            <div style={statLabel}>Revenue</div>
            <div style={statValue}>{money(sumRevenue)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>Cost</div>
            <div style={statValue}>{money(sumCost)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>Net</div>
            <div style={statValue}>{money(sumNet)}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Margin: {clamp(netMargin, -999, 999).toFixed(1)}%</div>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <SparklineChart
            xLabels={chartMonths.length ? chartMonths : ["—", "—"]}
            series={[
              { label: "Revenue", points: chartRev.length ? chartRev : [0, 0] },
              { label: "Cost", points: chartCost.length ? chartCost : [0, 0] },
              { label: "Net", points: chartNet.length ? chartNet : [0, 0] },
            ]}
            height={160}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, opacity: 0.75 }}>
            <span>Revenue</span>
            <span>Cost</span>
            <span>Net</span>
          </div>
        </div>
      </Card>

      <Card title="Add / update KPI entry">
        <div style={{ display: "grid", gap: 12 }}>
          <MonthPicker value={month} onChange={setMonth} options={months} />

          <NumberField label="Revenue" prefix="$" value={revenue} onChange={setRevenue} />
          <NumberField label="Cost" prefix="$" value={cost} onChange={setCost} />

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, opacity: 0.85 }}>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inp, height: 90, resize: "vertical" }}
              placeholder="Optional notes…"
            />
          </label>

          <button onClick={() => void saveNew()} style={btn} disabled={busy || (!orgId && !DEMO_MODE)}>
            {busy ? "Saving..." : DEMO_MODE ? "Save (demo)" : "Save"}
          </button>

          {status ? (
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {status.kind === "error" ? "⚠️ " : "✅ "}
              {status.message}
            </div>
          ) : null}
        </div>
      </Card>

      <Card
        title="Recent KPI entries"
        right={
          <button
            type="button"
            onClick={() => (DEMO_MODE ? setRows(makeDemoRows()) : orgId && void loadRows(orgId))}
            style={miniBtn}
            disabled={loadingRows || busy || (!orgId && !DEMO_MODE)}
          >
            {loadingRows ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Month</th>
                <th style={th}>Revenue</th>
                <th style={th}>Cost</th>
                <th style={th}>Net</th>
                <th style={th}>Notes</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td style={td} colSpan={6}>
                    {loadingRows ? "Loading…" : "No KPI entries yet."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const net = (Number(row.revenue) || 0) - (Number(row.cost) || 0);
                  return (
                    <tr key={row.id}>
                      <td style={td}>{row.month}</td>
                      <td style={td}>{money(row.revenue)}</td>
                      <td style={td}>{money(row.cost)}</td>
                      <td style={td}>{money(net)}</td>
                      <td style={{ ...td, maxWidth: 360 }}>
                        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.notes ?? "—"}
                        </div>
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <button type="button" style={miniBtn} onClick={() => beginEdit(row)} disabled={busy}>
                            Edit
                          </button>
                          <button
                            type="button"
                            style={{ ...miniBtn, ...(role === "owner" || DEMO_MODE ? null : disabledBtn) }}
                            onClick={() => void deleteRow(row)}
                            disabled={busy || (!DEMO_MODE && role !== "owner")}
                            title={!DEMO_MODE && role !== "owner" ? "Owner-only" : "Delete"}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editing ? (
        <div style={modalOverlay} role="dialog" aria-modal="true">
          <div style={modal}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Edit KPI Entry</div>
              <button type="button" style={miniBtn} onClick={() => setEditing(null)} disabled={busy}>
                Close
              </button>
            </div>

            <div style={{ fontSize: 12, opacity: 0.7 }}>Month: {editing.month}</div>

            <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
              <NumberField label="Revenue" prefix="$" value={editRevenue} onChange={setEditRevenue} />
              <NumberField label="Cost" prefix="$" value={editCost} onChange={setEditCost} />

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 13, opacity: 0.85 }}>Notes</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ ...inp, height: 90, resize: "vertical" }}
                />
              </label>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" style={miniBtn} onClick={() => setEditing(null)} disabled={busy}>
                  Cancel
                </button>
                <button type="button" style={btn} onClick={() => void saveEdit()} disabled={busy}>
                  {busy ? "Saving..." : DEMO_MODE ? "Save (demo)" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

const inp: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  width: "100%",
};

const btn: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  cursor: "pointer",
  fontWeight: 800,
  background: "rgba(0,0,0,0.04)",
};

const miniBtn: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #ddd",
  cursor: "pointer",
  fontWeight: 800,
  background: "rgba(0,0,0,0.03)",
  fontSize: 13,
};

const disabledBtn: React.CSSProperties = { opacity: 0.6, cursor: "not-allowed" };

const table: React.CSSProperties = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };

const th: React.CSSProperties = {
  textAlign: "left",
  fontSize: 12,
  opacity: 0.7,
  padding: "10px 10px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: 13,
  verticalAlign: "top",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "grid",
  placeItems: "center",
  padding: 16,
  zIndex: 100,
};

const modal: React.CSSProperties = {
  width: "min(720px, 100%)",
  background: "white",
  borderRadius: 18,
  border: "1px solid #ddd",
  padding: 14,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const statCard: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 12,
  background: "rgba(0,0,0,0.02)",
};

const statLabel: React.CSSProperties = { fontSize: 12, opacity: 0.7, fontWeight: 800 };
const statValue: React.CSSProperties = { fontSize: 18, fontWeight: 900, marginTop: 4 };