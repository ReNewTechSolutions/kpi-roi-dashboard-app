// =========================================================
// File: src/components/AppShell.tsx
// =========================================================
import React from "react";
import NavBar from "@/components/NavBar";

export default function AppShell({
  children,
  userEmail,
  currentOrgId,
  currentOrgName,
  currentOrgRole,
}: {
  children: React.ReactNode;
  userEmail: string | null;
  currentOrgId: string | null;
  currentOrgName?: string | null;
  currentOrgRole?: "owner" | "member" | null;
}) {
  return (
    <div>
      <NavBar
        userEmail={userEmail}
        currentOrgId={currentOrgId}
        currentOrgName={currentOrgName ?? null}
        currentOrgRole={currentOrgRole ?? null}
      />
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}