import Card from "@/components/Card";

type Point = { label: string; value: number };

function barHeight(v: number, pts: { value: number }[]) {
  const values = pts.map((x) => x.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 24;
  const norm = (v - min) / (max - min);
  return 12 + norm * 44; // 12..56
}

export default function LineChartCard({
  title = "Monthly Trend",
  points,
}: {
  title?: string;
  points: Point[];
}) {
  const last = points[points.length - 1]?.value ?? 0;
  const first = points[0]?.value ?? 0;
  const delta = last - first;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontWeight: 800, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          {points.length} pts • Δ {delta >= 0 ? "+" : ""}
          {delta.toFixed(0)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 76, marginTop: 12 }}>
        {points.slice(-12).map((p) => (
          <div key={p.label} style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                width: "100%",
                height: barHeight(p.value, points),
                borderRadius: 10,
                background: "linear-gradient(180deg, rgba(99,102,241,0.9), rgba(99,102,241,0.25))",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              title={`${p.label}: ${p.value}`}
            />
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, opacity: 0.65, marginTop: 10 }}>
        Replace with Recharts/Chart.js later — this is a lightweight placeholder.
      </div>
    </Card>
  );
}