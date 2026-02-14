// =========================================================
// File: src/components/RouteLoading.tsx
// Patch:
// - Animated shimmer bars
// - Configurable bars + lastBarWidth
// =========================================================
import React from "react";

export default function RouteLoading({
  title,
  bars = 3,
  lastBarWidth = "64%",
}: {
  title: string;
  bars?: number;
  lastBarWidth?: string;
}) {
  const safeBars = Math.max(1, Math.min(6, Math.floor(bars)));

  return (
    <main style={styles.page}>
      <style>{css}</style>
      <div style={styles.card}>
        <div style={styles.title}>{title}</div>

        {Array.from({ length: safeBars }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div
            key={i}
            className="metricroi-shimmer"
            style={{
              ...styles.bar,
              width: i === safeBars - 1 ? lastBarWidth : "100%",
            }}
          />
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 760, margin: "0 auto", padding: "40px 16px" },
  card: { border: "1px solid #eee", borderRadius: 18, padding: 16, background: "rgba(0,0,0,0.02)" },
  title: { fontWeight: 900 },
  bar: {
    height: 12,
    borderRadius: 999,
    marginTop: 10,
    background: "rgba(0,0,0,0.08)",
    position: "relative",
    overflow: "hidden",
  },
};

const css = `
@keyframes metricroi-shimmer {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.metricroi-shimmer::after{
  content:"";
  position:absolute;
  inset:0;
  transform: translateX(-120%);
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.55) 45%,
    rgba(255,255,255,0) 100%
  );
  animation: metricroi-shimmer 1.15s ease-in-out infinite;
}
`;