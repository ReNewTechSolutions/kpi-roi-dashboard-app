// src/components/orgs/SwitchOrgModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { listMyOrganizations, type Organization } from "@/data/orgs";
import { setCurrentOrg } from "@/app/(protected)/actions";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  currentOrgId: string | null;
};

export default function SwitchOrgModal({ open, onClose, currentOrgId }: Props) {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let alive = true;
    (async () => {
      setBusy(true);
      setErr(null);
      try {
        const rows = await listMyOrganizations();
        if (!alive) return;
        setOrgs(rows);
      } catch (e: unknown) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Failed to load orgs.");
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open]);

  const title = useMemo(() => "Switch organization", []);

  async function choose(orgId: string) {
    setBusy(true);
    setErr(null);
    try {
      await setCurrentOrg(orgId);
      onClose();
      router.refresh(); // forces server components to re-read cookie
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to switch org.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div style={{ display: "grid", gap: 10 }}>
        {err ? <div style={{ fontSize: 13, opacity: 0.85 }}>{err}</div> : null}
        {busy ? <div style={{ fontSize: 13, opacity: 0.75 }}>Loading...</div> : null}

        <div style={{ display: "grid", gap: 8 }}>
          {orgs.map((o) => {
            const active = currentOrgId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                disabled={busy}
                style={{
                  textAlign: "left",
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: active ? "rgba(0,0,0,0.04)" : "transparent",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {o.name}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}