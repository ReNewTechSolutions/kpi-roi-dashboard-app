// =========================================================
// File: src/components/features/demo/LandingCTA.tsx
// Patch: accept appName + demoMode, route CTA accordingly
// =========================================================
"use client";

import React from "react";
import Link from "next/link";

export default function LandingCTA({
  appName,
  demoMode,
  primaryBtnStyle,
  linkBtnStyle,
}: {
  appName: string;
  demoMode: boolean;
  primaryBtnStyle?: React.CSSProperties;
  linkBtnStyle?: React.CSSProperties;
}) {
  const primaryHref = demoMode ? "/dashboard" : "/auth/signup";
  const secondaryHref = "/auth/login";

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <Link href={primaryHref} style={primaryBtnStyle}>
        {demoMode ? `Enter ${appName} Demo` : `Start with ${appName}`}
      </Link>

      <Link href={secondaryHref} style={linkBtnStyle}>
        Sign in
      </Link>
    </div>
  );
}