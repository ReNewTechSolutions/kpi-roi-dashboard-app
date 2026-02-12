"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import KPIStatsRow from "@/components/KPIStatsRow";
import LineChartCard from "@/components/LineChartCard";
import { DEMO_KPIS, DEMO_ROI } from "@/lib/demo";
import { calcProfit, calcMoMGrowthPercent, calcNetSavings, calcRoiPercent } from "@/lib/calc";
import { supabase } from "@/lib/supabase";
import { getCachedOrgId, getDemoMode, setCachedOrgId } from "@/lib/storage";
import { useRouter } from "next/navigation";

type KPIRow = { month: string; revenue: number; cost: number };

export default function DashboardPage() {
  const r = useRouter();
  const [demo, setDemo] = useState(false);
  const [orgName, setOrgName] = useState("Demo Organization");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPIRow[]>(DEMO_KPIS);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);

    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      r.push("/login");
      return;
    }

    const demoMode = getDemoMode();
    setDemo(demoMode);

    if (demoMode) {
      setOrgId(null);
      setOrgName("Demo Organization");
      setKpis(DEMO_KPIS);
      setLoading(false);
      return;
    }

    const cached = getCachedOrgId();

    const { data: orgs, error: orgErr } = await supabase
      .from("organizations")
      .select("id,name")
      .order("created_at", { ascending: false });

    if (orgErr) {
      setErr(orgErr.message);
      setLoading(false);
      return;
    }
    if (!orgs?.length) {
      setErr("No organizations found. Create one in Organizations.");
      setKpis([]);
      setLoading(false);
      return;
    }

    const chosen =
      cached && orgs.find((o) => o.id === cached) ? orgs.find((o) => o.id === cached)! : orgs[0];

    setOrgId(chosen.id);
    setOrgName(chosen.name);
    setCachedOrgId(chosen.id);

    const { data: rows, error: kpiErr } = await supabase
      .from("kpi_entries")
      .select("month,revenue,cost")
      .eq("org_id", chosen.id)
      .order("month", { ascending: true })
      .limit(24);

    if (kpiErr) {
      setErr(kpiErr.message);
      setLoading(false);
      return;
    }

    const mapped = (rows ?? []) as KPIRow[];
    setKpis(mapped.length ? mapped : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latest = useMemo(() => {
    const sorted = [...(kpis.length ? kpis : DEMO_KPIS)].sort((a, b) => (a.month > b.month ? 1 : -1));
    return { curr: sorted[sorted.length - 1], prev: sorted[sorted.length - 2] };
  }, [kpis]);

  const stats = useMemo(() => {
    const revenue = latest.curr?.revenue ?? 0;
    const cost = latest.curr?.cost ?? 0;
    const profit = calcProfit(revenue, cost);

    const roiPct = calcRoiPercent(DEMO_ROI.totalInvestment, DEMO_ROI.valueDelivered);
    const netSavings = calcNetSavings(DEMO_ROI.totalInvestment, DEMO_ROI.valueDelivered);
    const mom = latest.prev ? calcMoMGrowthPercent(revenue, latest.prev.revenue) : 0;

    return { revenue, cost, profit, roiPct, netSavings, mom };
  }, [latest]);

  const statCards = [
    { label: "Revenue", value: `$${stats.revenue.toFixed(0)}` },
    { label: "Cost", value: `$${stats.cost.toFixed(0)}` },
    { label: "Profit", value: `$${stats.profit.toFixed(0)}` },
    { label: "ROI %", value: `${stats.roiPct.toFixed(1)}%` },
    { label: "Net Savings", value: `$${stats.netSavings.toFixed(0)}` },
    { label: "MoM Growth", value: `${stats.mom.toFixed(1)}%` },
  ];

  const chartPoints = (kpis.length ? kpis : DEMO_KPIS).slice(-12).map((row) => ({
    label: row.month.slice(0, 7),
    value: row.revenue,
  }));

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {demo ? "Demo Mode" : orgName} {orgId ? `• ${orgId.slice(0, 8)}…` : ""}
          </div>
        </div>
        <button onClick={load} style={btn}>Refresh</button>
      </div>

      {loading ? <Card>Loading…</Card> : null}
      {err ? <Card><div style={{ color: "crimson" }}>{err}</div></Card> : null}

      <KPIStatsRow stats={statCards} />
      <LineChartCard title="Revenue Trend" points={chartPoints} />
    </main>
  );
}

const btn: React.CSSProperties = { padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" };