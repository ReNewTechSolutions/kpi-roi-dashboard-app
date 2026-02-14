// =========================================================
// File: src/components/Card.tsx
// Glass morphism dark card
// =========================================================
import React from "react";

export default function Card({
  title,
  right,
  children,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.card}>
      {(title || right) ? (
        <div style={styles.header}>
          <div style={styles.title}>{title ?? ""}</div>
          <div>{right}</div>
        </div>
      ) : null}
      <div>{children}</div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  title: {
    fontWeight: 900,
    letterSpacing: 0.2,
    opacity: 0.95,
  },
};