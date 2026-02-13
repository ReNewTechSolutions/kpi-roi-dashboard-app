"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roi", label: "ROI" },
  { href: "/metrics", label: "Metrics" },
  { href: "/org", label: "Organizations" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 0" }}>
      {items.map((i) => {
        const active = path === i.href || path?.startsWith(i.href + "/");
        return (
          <Link
            key={i.href}
            href={i.href}
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              boxShadow: active ? "0 10px 20px rgba(0,0,0,0.10)" : "none",
            }}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}