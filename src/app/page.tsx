// =========================================================
// File: src/app/page.tsx
// Patch: brand hero + CTA respects DEMO_MODE
// =========================================================
import React from "react";
import Link from "next/link";
import LandingCTA from "@/components/features/demo/LandingCTA";
import { APP_NAME, DEMO_MODE } from "@/lib/branding";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.brandRow}>
          <div style={styles.logoDot} aria-hidden="true" />
          <div style={{ fontWeight: 900 }}>{APP_NAME}</div>
          {DEMO_MODE ? <span style={styles.demoPill}>Demo Mode</span> : null}
        </div>

        <h1 style={styles.h1}>KPI + ROI dashboard for multi-tenant teams.</h1>
        <p style={styles.sub}>
          Track monthly KPIs, model ROI scenarios, and manage organizations — built with Next.js + Supabase.
        </p>

        <div style={{ marginTop: 10 }}>
          <LandingCTA
            appName={APP_NAME}
            demoMode={DEMO_MODE}
            primaryBtnStyle={styles.primaryBtn}
            linkBtnStyle={styles.linkBtn}
          />
        </div>
      </header>

      <footer style={styles.footer}>
        <Link href="/privacy" style={styles.footerLink}>
          Privacy
        </Link>
        <span style={styles.dot}>·</span>
        <Link href="/terms" style={styles.footerLink}>
          Terms
        </Link>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 980, margin: "0 auto", padding: "48px 16px", display: "grid", gap: 18 },
  hero: {
    border: "1px solid #eee",
    borderRadius: 22,
    padding: 18,
    background: "rgba(0,0,0,0.02)",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.9 },
  logoDot: { width: 10, height: 10, borderRadius: 99, background: "#111" },
  demoPill: {
    marginLeft: 8,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #ddd",
    fontSize: 12,
    fontWeight: 900,
    background: "rgba(0,0,0,0.03)",
  },
  h1: { margin: "12px 0 6px", fontSize: 34, letterSpacing: -0.4 },
  sub: { margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.6, maxWidth: 720 },

  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: 900,
    background: "rgba(0,0,0,0.06)",
    textDecoration: "none",
    display: "inline-block",
  },
  linkBtn: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: 900,
    background: "transparent",
    textDecoration: "none",
    display: "inline-block",
    marginLeft: 10,
  },

  footer: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, opacity: 0.75 },
  footerLink: { color: "inherit", textDecoration: "none" },
  dot: { opacity: 0.5 },
};