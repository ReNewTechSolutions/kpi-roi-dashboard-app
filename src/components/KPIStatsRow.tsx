"use client";

import React from "react";

type StatCard = {
  label: string;
  value: string | number;
};

export default function KPIStatsRow({ stats = [] }: { stats?: StatCard[] }) {
  const filled =
    stats.length > 0
      ? stats
      : Array.from({ length: 6 }, (_, i) => ({
          label: `KPI ${i + 1}`,
          value: "—",
        }));

  return (
    <section style={styles.wrap}>
      {filled.map((s, idx) => (
        <div key={`${s.label}-${idx}`} style={styles.card}>
          <div style={styles.label}>{s.label}</div>
          <div style={styles.value}>{s.value}</div>
        </div>
      ))}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: 12,
    width: "100%",
  },
  card: {
    borderRadius: 16,
    padding: "14px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    minHeight: 82,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.4,
    opacity: 0.75,
    marginBottom: 6,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  value: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: -0.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};