// =========================================================
// File: src/components/legal/PrivacyContent.tsx
// Single source of truth for privacy content.
// =========================================================
import React from "react";

export default function PrivacyContent({ appName }: { appName: string }) {
  return (
    <>
      <section style={styles.card}>
        <h2 style={styles.h2}>Summary</h2>
        <ul style={styles.ul}>
          <li>We collect the minimum needed to provide the service (account email, org data, KPI/ROI data you enter).</li>
          <li>Your data is stored in Supabase (Postgres) and protected by row-level security (RLS).</li>
          <li>You control who has access via organization membership.</li>
        </ul>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Data we process</h2>
        <ul style={styles.ul}>
          <li>
            <strong>Account data:</strong> email, authentication identifiers (managed by Supabase Auth).
          </li>
          <li>
            <strong>Organization data:</strong> org name, membership roles.
          </li>
          <li>
            <strong>Business data you provide:</strong> KPI entries (revenue, cost, notes), ROI model inputs (JSON).
          </li>
          <li>
            <strong>Operational data:</strong> basic logs/telemetry from hosting providers.
          </li>
        </ul>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>How access works (multi-tenant)</h2>
        <p style={styles.p}>
          {appName} uses organization-based access controls. Database row-level security policies restrict reads/writes to
          members of the relevant organization. Owners may have additional privileges (such as deleting certain records).
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Cookies</h2>
        <p style={styles.p}>
          We use authentication cookies/tokens to keep you signed in. The app may also store a small amount of state (like
          selected organization or demo mode) in browser storage to improve the experience.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Third-party services</h2>
        <ul style={styles.ul}>
          <li>
            <strong>Supabase:</strong> authentication and database hosting.
          </li>
          <li>
            <strong>Vercel:</strong> application hosting and delivery.
          </li>
          <li>
            <strong>Stripe (optional):</strong> billing and payments if enabled.
          </li>
        </ul>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Your choices</h2>
        <ul style={styles.ul}>
          <li>Update organization settings and memberships (owner role required for some actions).</li>
          <li>Export or delete records (where enabled and permitted by role).</li>
          <li>Sign out at any time.</li>
        </ul>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Contact</h2>
        <p style={styles.p}>
          For privacy questions, contact the operator of this deployment. If you’re running the open-source version,
          update this page with your official support email and legal entity name.
        </p>
      </section>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #eee",
    borderRadius: 18,
    padding: 14,
    background: "rgba(0,0,0,0.02)",
    display: "grid",
    gap: 10,
  },
  h2: { margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: -0.2 },
  p: { margin: 0, opacity: 0.8, lineHeight: 1.6, fontSize: 13 },
  ul: { margin: 0, paddingLeft: 18, display: "grid", gap: 6, opacity: 0.85, fontSize: 13, lineHeight: 1.6 },
};