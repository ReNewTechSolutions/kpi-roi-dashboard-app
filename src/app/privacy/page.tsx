// =========================================================
// File: src/app/privacy/page.tsx
// Public privacy policy page.
// =========================================================
import React from "react";
import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <main style={{ width: "100%", display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Privacy</h1>
      <PrivacyPolicyContent variant="public" />
    </main>
  );
}