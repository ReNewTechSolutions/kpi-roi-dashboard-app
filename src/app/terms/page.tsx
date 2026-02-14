// =========================================================
// File: src/app/terms/page.tsx
// =========================================================
import React from "react";
import Link from "next/link";

export const dynamic = "force-static";

export default function TermsPage() {
  const updated = "2026-02-13";

  return (
    <main style={styles.page}>
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={styles.h1}>Terms of Service</h1>
        <div style={styles.meta}>Last updated: {updated}</div>
        <div style={styles.meta}>
          Need the Privacy Policy? <Link href="/privacy">View Privacy</Link>
        </div>
      </header>

      <section style={styles.card}>
        <h2 style={styles.h2}>1. Agreement</h2>
        <p style={styles.p}>
          By accessing or using MetricROI (the “Service”), you agree to these Terms. If you do not agree, do not use the
          Service.
        </p>

        <h2 style={styles.h2}>2. Accounts</h2>
        <p style={styles.p}>
          You are responsible for maintaining the confidentiality of your account and for all activities that occur under
          your account.
        </p>

        <h2 style={styles.h2}>3. Acceptable Use</h2>
        <p style={styles.p}>
          You agree not to misuse the Service, interfere with its operation, attempt unauthorized access, or use the
          Service in a way that violates any applicable laws.
        </p>

        <h2 style={styles.h2}>4. Data &amp; Analytics</h2>
        <p style={styles.p}>
          The Service helps you track KPIs and estimate ROI. You are responsible for the accuracy of inputs and business
          decisions based on outputs.
        </p>

        <h2 style={styles.h2}>5. Subscriptions &amp; Billing</h2>
        <p style={styles.p}>
          If paid plans are enabled, billing terms (price, renewal, cancellation) will be shown at checkout and/or in
          the billing settings. If billing is not enabled, this section has no effect.
        </p>

        <h2 style={styles.h2}>6. Intellectual Property</h2>
        <p style={styles.p}>
          The Service and its content are protected by intellectual property laws. You may not copy, modify, or
          distribute the Service except as permitted by law or an explicit license.
        </p>

        <h2 style={styles.h2}>7. Disclaimers</h2>
        <p style={styles.p}>
          THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. METRICROI DOES NOT WARRANT THAT THE SERVICE
          WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>

        <h2 style={styles.h2}>8. Limitation of Liability</h2>
        <p style={styles.p}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, METRICROI WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
        </p>

        <h2 style={styles.h2}>9. Termination</h2>
        <p style={styles.p}>
          We may suspend or terminate access to the Service at any time if we reasonably believe you violated these
          Terms.
        </p>

        <h2 style={styles.h2}>10. Changes</h2>
        <p style={styles.p}>
          We may update these Terms from time to time. Continued use of the Service after changes become effective means
          you accept the updated Terms.
        </p>

        <h2 style={styles.h2}>11. Contact</h2>
        <p style={styles.p}>
          For questions about these Terms, contact the Service operator or repository owner.
        </p>
      </section>

      <footer style={styles.footer}>
        <Link href="/">← Back to home</Link>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 900, margin: "0 auto", padding: "40px 16px", display: "grid", gap: 14 },
  h1: { margin: 0, fontSize: 34, letterSpacing: -0.3 },
  h2: { margin: "18px 0 6px", fontSize: 18 },
  meta: { fontSize: 13, opacity: 0.75 },
  card: { border: "1px solid #eee", borderRadius: 18, padding: 16, background: "rgba(0,0,0,0.02)" },
  p: { margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.9 },
  footer: { fontSize: 13, opacity: 0.8, marginTop: 8 },
};