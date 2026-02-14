"use client";

import React, { useEffect, useRef } from "react";

export type ModalProps = React.PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose: () => void;
  width?: number;
}>;

export default function Modal({ open, title, onClose, width = 560, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.focus?.(), 0);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Dialog"}
      style={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} tabIndex={-1} style={{ ...styles.panel, width: `min(${width}px, 100%)` }}>
        <div style={styles.header}>
          <div style={styles.title}>{title ?? ""}</div>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.28)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 1000,
  },
  panel: {
    borderRadius: 18,
    border: "1px solid #ddd",
    background: "white",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
    outline: "none",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 12,
    borderBottom: "1px solid #eee",
  },
  title: { fontSize: 14, fontWeight: 900 },
  closeBtn: {
    border: "1px solid #ddd",
    background: "transparent",
    borderRadius: 12,
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 900,
  },
  body: { padding: 12 },
};