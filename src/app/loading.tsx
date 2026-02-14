// =========================================================
// File: src/app/loading.tsx
// =========================================================
import React from "react";
import { APP_NAME } from "@/lib/branding";

export default function GlobalLoading() {
  return (
    <main style={styles.page} aria-busy="true" aria-live="polite">
      <div style={styles.card}>
        <div style={styles.top}>
          <span style={styles.dot} aria-hidden="true" />
          <div style={styles.title}>Loading {APP_NAME}…</div>
        </div>

        <div style={styles.bar} />
        <div style={styles.bar} />
        <div style={{ ...styles.bar, width: "68%" }} />
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "40px 16px",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: 18,
    padding: 16,
    background: "rgba(0,0,0,0.02)",
  },
  top: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "#111",
    flex: "0 0 auto",
  },
  title: {
    fontWeight: 900,
  },
  bar: {
    height: 12,
    borderRadius: 999,
    background: "rgba(0,0,0,0.08)",
    marginTop: 10,
    width: "100%",
  },
};