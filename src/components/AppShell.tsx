// =========================================================
// File: src/components/AppShell.tsx
// Premium dark glass shell + centered app frame
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
    <div style={styles.outer}>
      <div style={styles.frame}>
        <div style={styles.navWrap}>
          <NavBar
            userEmail={userEmail}
            currentOrgId={currentOrgId}
            currentOrgName={currentOrgName ?? null}
            currentOrgRole={currentOrgRole ?? null}
          />
        </div>

        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outer: {
    width: "100%",
    display: "grid",
    placeItems: "center",
  },

  frame: {
    width: "min(1180px, 100%)",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.45)",
    overflow: "hidden",
  },

  navWrap: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(10,12,20,0.55)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },

  content: {
    padding: 16,
    display: "grid",
    gap: 14,
  },
};