// =========================================================
// File: src/components/legal/PrivacyPolicyContent.tsx
// Single source of truth for Privacy Policy content.
// Used by /privacy and /(protected)/legal/privacy.
// =========================================================
import React from "react";
import Link from "next/link";
import Card from "@/components/Card";
import { APP_NAME } from "@/lib/branding";

export default function PrivacyPolicyContent({
  variant = "public",
}: {
  variant?: "public" | "protected";
}) {
  const updated = "Last updated: " + new Date().getFullYear();

  return (
    <Card title="Privacy Policy">
      <div style={{ display: "grid", gap: 12, fontSize: 14, lineHeight: 1.6 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{updated}</div>

        <p style={{ margin: 0 }}>
          This Privacy Policy explains how <b>{APP_NAME}</b> (“we”, “us”) collects, uses, and safeguards information
          when you use the application.
        </p>

        <div>
          <div style={h}>Information we collect</div>
          <ul style={ul}>
            <li>
              <b>Account data:</b> email address and authentication identifiers required to provide access.
            </li>
            <li>
              <b>Organization data:</b> organization names, membership roles, and settings you configure.
            </li>
            <li>
              <b>Product data:</b> KPI entries, ROI model inputs, and notes you enter into the app.
            </li>
            <li>
              <b>Usage data:</b> basic logs and diagnostics needed to operate and secure the service.
            </li>
          </ul>
        </div>

        <div>
          <div style={h}>How we use information</div>
          <ul style={ul}>
            <li>Provide, maintain, and improve the service.</li>
            <li>Authenticate users and enforce organization access controls.</li>
            <li>Secure the app, prevent abuse, and troubleshoot issues.</li>
            <li>Communicate service-related messages (e.g., password resets).</li>
          </ul>
        </div>

        <div>
          <div style={h}>Data storage & security</div>
          <p style={{ margin: 0 }}>
            Data is stored in Supabase (Postgres) and protected by Row Level Security (RLS) policies that restrict access
            to organization members. We apply reasonable administrative, technical, and physical safeguards to protect
            information.
          </p>
        </div>

        <div>
          <div style={h}>Sharing</div>
          <p style={{ margin: 0 }}>
            We do not sell your personal information. We may share data with infrastructure providers strictly to operate
            the service (e.g., hosting, email delivery), or if required by law.
          </p>
        </div>

        <div>
          <div style={h}>Your choices</div>
          <ul style={ul}>
            <li>You can update your organization information within the app.</li>
            <li>You can request deletion of your account and associated data where applicable.</li>
          </ul>
        </div>

        <div>
          <div style={h}>Contact</div>
          <p style={{ margin: 0 }}>
            For privacy questions, contact the site owner / operator of this deployment.
          </p>
        </div>

        {variant === "protected" ? (
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Want the public version? <Link href="/privacy">Open public privacy page</Link>
          </div>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Signed in? <Link href="/legal/privacy">Open org-scoped privacy page</Link>
          </div>
        )}
      </div>
    </Card>
  );
}

const h: React.CSSProperties = { fontWeight: 900, marginBottom: 6 };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 18, display: "grid", gap: 6 };